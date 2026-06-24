import { useDeferredValue, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  EmptyState,
  ErrorState,
  LoadingState,
  StatusBadge,
} from '../../../shared/components';
import { formatArgentinaDateTime } from '../../../shared/utils/dateTime';
import { DeviceStateBadge } from '../../devices/components/DeviceStateBadge';
import { getDeviceAssetName, type DeviceApiResponse } from '../../devices/types/device.types';
import { RodeoAssetSelector } from '../../rodeos/components/RodeoAssetSelector';
import { useMyRodeos } from '../../rodeos/hooks/useMyRodeos';
import type { RodeoAssetOption } from '../../rodeos/types/rodeo.types';
import { useAssignAssetGroupsToGeofence } from '../hooks/useAssignAssetGroupsToGeofence';
import { useAssignAssetsToGeofence } from '../hooks/useAssignAssetsToGeofence';
import { useDeactivateGeofenceAssignment } from '../hooks/useDeactivateGeofenceAssignment';
import { useGeofence } from '../hooks/useGeofence';
import { useGeofenceAssignableDevices } from '../hooks/useGeofenceAssignableDevices';
import { useGeofenceAssignments } from '../hooks/useGeofenceAssignments';
import { useRemoveAssetGroupsFromGeofence } from '../hooks/useRemoveAssetGroupsFromGeofence';
import type {
  GeoFenceAssignedAsset,
  GeoFenceAssignedAssetGroup,
  GeoFenceAssignmentRead,
} from '../types/geofence.types';

type GeofenceAssignmentManagerProps = {
  geofence_id: number;
  is_open: boolean;
};

type AssetGroupSelectorProps = {
  title: string;
  groups: GeoFenceAssignedAssetGroup[];
  selected_ids: number[];
  on_change: (ids: number[]) => void;
  empty_message: string;
};

function getAssignmentId(assignment: GeoFenceAssignmentRead) {
  return assignment.id_assignment ?? assignment.id_geofence_assignment ?? null;
}

function getAssetLabel(asset: GeoFenceAssignedAsset, fallbackAssetName?: string | null) {
  if (asset.asset_name?.trim()) {
    return asset.asset_name.trim();
  }

  if (asset.asset_serial?.trim()) {
    return asset.asset_serial.trim();
  }

  if (typeof fallbackAssetName === 'string' && fallbackAssetName.trim()) {
    return fallbackAssetName.trim();
  }

  return 'Asset sin nombre';
}

function getDirectAssetOption(device: DeviceApiResponse): RodeoAssetOption | null {
  if (device.asset_id === null) {
    return null;
  }

  const label = getDeviceAssetName(device, device.name.trim());

  return {
    asset_id: device.asset_id,
    asset_name: device.asset_name ?? null,
    asset_type: device.asset_type ?? null,
    asset_serial: device.asset_serial ?? null,
    device_id: device.id_device,
    device_name: device.name,
    device_serial: device.serial,
    device_active: device.active,
    device_state: device.state,
    label,
    search_text: [
      label,
      device.asset_name,
      device.asset_type,
      device.asset_serial,
      device.asset_id,
      device.name,
      device.serial,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase(),
  };
}

function getGroupErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

function AssetGroupSelector({
  title,
  groups,
  selected_ids,
  on_change,
  empty_message,
}: AssetGroupSelectorProps) {
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);

  const filteredGroups = useMemo(() => {
    const normalizedSearch = deferredSearch.trim().toLowerCase();

    if (!normalizedSearch) {
      return groups;
    }

    return groups.filter((group) =>
      [group.name, group.description, group.id_asset_group]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch),
    );
  }, [deferredSearch, groups]);

  function handleToggle(id_asset_group: number, checked: boolean) {
    if (checked) {
      on_change([...selected_ids, id_asset_group]);
      return;
    }

    on_change(selected_ids.filter((selected_id) => selected_id !== id_asset_group));
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-sm font-semibold text-brand-text">{title}</h3>
        <span className="text-xs font-medium text-brand-muted">{selected_ids.length} seleccionados</span>
      </div>

      <input
        className="w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Buscar por nombre o descripcion"
        value={search}
      />

      {filteredGroups.length === 0 ? (
        <p className="rounded-2xl bg-white px-4 py-3 text-sm text-brand-muted">{empty_message}</p>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2">
          {filteredGroups.map((group) => (
            <label
              className="flex items-start gap-3 rounded-2xl border border-brand-border bg-white p-3 text-sm text-brand-text"
              key={group.id_asset_group}
            >
              <input
                checked={selected_ids.includes(group.id_asset_group)}
                className="mt-1 h-4 w-4 accent-brand-primary"
                onChange={(event) => handleToggle(group.id_asset_group, event.target.checked)}
                type="checkbox"
              />
              <span>
                <span className="block font-semibold">{group.name}</span>
                <span className="block text-brand-muted">{group.description || 'Sin descripcion'}</span>
                <span className="block text-xs text-brand-muted">
                  {group.total_assets ?? 0} animales
                </span>
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export function GeofenceAssignmentManager({
  geofence_id,
  is_open,
}: GeofenceAssignmentManagerProps) {
  const [selected_asset_ids, setSelectedAssetIds] = useState<number[]>([]);
  const [selected_asset_group_ids, setSelectedAssetGroupIds] = useState<number[]>([]);
  const [selected_assigned_group_ids, setSelectedAssignedGroupIds] = useState<number[]>([]);
  const geofence = useGeofence(geofence_id, is_open);
  const assignments = useGeofenceAssignments(geofence_id, is_open);
  const devices = useGeofenceAssignableDevices(is_open);
  const rodeos = useMyRodeos();
  const assignAssets = useAssignAssetsToGeofence();
  const deactivateAssignment = useDeactivateGeofenceAssignment();
  const assignAssetGroups = useAssignAssetGroupsToGeofence();
  const removeAssetGroups = useRemoveAssetGroupsFromGeofence();

  const activeAssignments = useMemo(
    () => (assignments.data ?? []).filter((assignment) => assignment.active),
    [assignments.data],
  );
  const assignmentByAssetId = useMemo(
    () =>
      new Map(activeAssignments.map((assignment) => [assignment.asset_id, assignment] as const)),
    [activeAssignments],
  );
  const directlyAssignedAssetIds = useMemo(
    () => new Set((geofence.data?.assets_assigned_direct ?? []).map((asset) => asset.asset_id)),
    [geofence.data?.assets_assigned_direct],
  );
  const availableDirectAssets = useMemo(
    () =>
      (devices.data ?? [])
        .map(getDirectAssetOption)
        .filter((option): option is RodeoAssetOption => option !== null)
        .filter((option) => !directlyAssignedAssetIds.has(option.asset_id)),
    [devices.data, directlyAssignedAssetIds],
  );
  const assignedAssetGroupIds = useMemo(
    () => new Set((geofence.data?.asset_groups_assigned ?? []).map((group) => group.id_asset_group)),
    [geofence.data?.asset_groups_assigned],
  );
  const availableRodeos = useMemo(
    () =>
      (rodeos.data ?? [])
        .filter((rodeo) => rodeo.active && !assignedAssetGroupIds.has(rodeo.id_asset_group))
        .map((rodeo) => ({
          id_asset_group: rodeo.id_asset_group,
          name: rodeo.name,
          description: rodeo.description,
          active: rodeo.active,
          total_assets: rodeo.total_assets,
        })),
    [assignedAssetGroupIds, rodeos.data],
  );

  if (!is_open) {
    return null;
  }

  if (geofence.isLoading) {
    return (
      <div className="space-y-4 rounded-2xl border border-brand-border bg-brand-surfaceSoft p-4">
        <LoadingState message="Cargando detalle de la geocerca..." />
      </div>
    );
  }

  if (geofence.isError || !geofence.data) {
    return (
      <div className="space-y-4 rounded-2xl border border-brand-border bg-brand-surfaceSoft p-4">
        <ErrorState
          title="No pudimos cargar el detalle de la geocerca"
          message={getGroupErrorMessage(geofence.error, 'Intentalo nuevamente.')}
        />
      </div>
    );
  }

  const geofenceDetail = geofence.data;

  async function handleAssignAssets(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (selected_asset_ids.length === 0) {
      return;
    }

    await assignAssets.mutateAsync({
      geofence_id,
      payload: { asset_ids: selected_asset_ids },
    });
    setSelectedAssetIds([]);
  }

  async function handleDeactivate(assignment: GeoFenceAssignmentRead | undefined) {
    if (!assignment) {
      return;
    }

    const assignment_id = getAssignmentId(assignment);

    if (!assignment_id) {
      return;
    }

    await deactivateAssignment.mutateAsync({ assignment_id, geofence_id });
  }

  async function handleAssignGroups(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (selected_asset_group_ids.length === 0) {
      return;
    }

    await assignAssetGroups.mutateAsync({
      geofence_id,
      payload: { asset_group_ids: selected_asset_group_ids },
    });
    setSelectedAssetGroupIds([]);
  }

  async function handleRemoveGroups(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (selected_assigned_group_ids.length === 0) {
      return;
    }

    await removeAssetGroups.mutateAsync({
      geofence_id,
      payload: { asset_group_ids: selected_assigned_group_ids },
    });
    setSelectedAssignedGroupIds([]);
  }

  return (
    <div className="space-y-4 rounded-2xl border border-brand-border bg-brand-surfaceSoft p-4">
      <div>
        <h3 className="text-sm font-semibold text-brand-text">Alcance de la geocerca</h3>
        <p className="mt-1 text-sm text-brand-muted">
          Combina asignacion directa por asset y asignacion indirecta por rodeos.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
          <div className="rounded-2xl border border-brand-border bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">
              Assets directos
            </p>
            <p className="mt-2 text-2xl font-semibold text-brand-primary">
              {geofenceDetail.total_assets_direct}
            </p>
            <p className="mt-1 text-sm text-brand-muted">
              Asignados manualmente a esta geocerca.
            </p>
          </div>

          <div className="rounded-2xl border border-brand-border bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">
              Rodeos asignados
            </p>
            <p className="mt-2 text-2xl font-semibold text-brand-primary">
              {geofenceDetail.total_asset_groups}
            </p>
            <p className="mt-1 text-sm text-brand-muted">
              Rodeos que aportan miembros a la geocerca.
            </p>
          </div>

          <div className="rounded-2xl border border-brand-border bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">
              Assets efectivos
            </p>
            <p className="mt-2 text-2xl font-semibold text-brand-primary">
              {geofenceDetail.total_assets_effective}
            </p>
            <p className="mt-1 text-sm text-brand-muted">
              Total real cubierto entre directos y rodeos.
            </p>
          </div>
        </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="space-y-4 rounded-2xl border border-brand-border bg-white p-4">
          <div>
            <h4 className="text-base font-semibold text-brand-text">Assets directos</h4>
            <p className="mt-1 text-sm text-brand-muted">
              Mantiene la asignacion manual asset por asset.
            </p>
          </div>

          {assignments.isLoading || devices.isLoading ? (
            <LoadingState message="Cargando assets directos..." />
          ) : null}

          {assignments.isError ? (
            <ErrorState
              title="No pudimos cargar las asignaciones directas"
              message={getGroupErrorMessage(assignments.error, 'Intentalo nuevamente.')}
            />
          ) : null}

          {!assignments.isLoading && !assignments.isError && geofenceDetail.assets_assigned_direct.length === 0 ? (
            <EmptyState
              title="Sin assets directos"
              message="Todavia no hay assets asignados manualmente a esta geocerca."
            />
          ) : null}

          {geofenceDetail.assets_assigned_direct.length > 0 ? (
            <div className="max-h-96 space-y-3 overflow-y-auto pr-1">
              {geofenceDetail.assets_assigned_direct.map((asset) => {
                const assignment = assignmentByAssetId.get(asset.asset_id);
                const assignment_id = assignment ? getAssignmentId(assignment) : null;
                const fallbackDevice = (devices.data ?? []).find(
                  (device) => device.asset_id === asset.asset_id,
                );
                const device_id = asset.device_id ?? fallbackDevice?.id_device ?? null;
                const device_name = asset.device_name ?? fallbackDevice?.name ?? null;
                const device_serial = asset.device_serial ?? fallbackDevice?.serial ?? null;
                const device_state = asset.device_state ?? fallbackDevice?.state ?? 'unknown';
                const device_active = asset.device_active ?? fallbackDevice?.active ?? null;
                const fallbackAssetName = fallbackDevice?.asset_name ?? null;
                const isDeactivating =
                  deactivateAssignment.isPending &&
                  deactivateAssignment.variables?.assignment_id === assignment_id;

                return (
                  <div
                    className="rounded-2xl border border-brand-border bg-brand-surfaceSoft p-4"
                    key={asset.asset_id}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-brand-text">
                        {getAssetLabel(asset, fallbackAssetName)}
                      </p>
                      {asset.asset_type ? <StatusBadge label={asset.asset_type} /> : null}
                    </div>
                    {device_id ? (
                      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                        <Link
                          className="font-semibold text-brand-primary hover:underline"
                          to={`/app/devices/${device_id}`}
                        >
                          {device_serial || device_name || 'Sin serial'}
                        </Link>
                        <DeviceStateBadge state={device_state} />
                        {typeof device_active === 'boolean' ? (
                          <StatusBadge
                            label={device_active ? 'Activo' : 'Inactivo'}
                            tone={device_active ? 'success' : 'default'}
                          />
                        ) : null}
                      </div>
                    ) : null}

                    {assignment ? (
                      <p className="mt-2 text-xs text-brand-muted">
                        Asignado {formatArgentinaDateTime(assignment.assigned_at)}
                      </p>
                    ) : null}

                    <div className="mt-3">
                      <Button
                        className="w-full"
                        disabled={!assignment_id || isDeactivating}
                        onClick={() => handleDeactivate(assignment)}
                        type="button"
                        variant="secondary"
                      >
                        {isDeactivating ? 'Quitando...' : 'Quitar asignacion directa'}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}

          <form className="space-y-4 border-t border-brand-border pt-4" onSubmit={handleAssignAssets}>
            <RodeoAssetSelector
              empty_message="No hay assets disponibles para asignar de forma directa."
              on_change={setSelectedAssetIds}
              options={availableDirectAssets}
              selected_asset_ids={selected_asset_ids}
              title="Agregar assets directos"
            />

            {assignAssets.isError ? (
              <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-brand-danger">
                {assignAssets.error.message}
              </p>
            ) : null}

            {deactivateAssignment.isError ? (
              <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-brand-danger">
                {deactivateAssignment.error.message}
              </p>
            ) : null}

            <Button disabled={selected_asset_ids.length === 0 || assignAssets.isPending} type="submit">
              {assignAssets.isPending ? 'Asignando...' : 'Asignar assets directos'}
            </Button>
          </form>
        </div>

        <div className="space-y-4 rounded-2xl border border-brand-border bg-white p-4">
          <div>
            <h4 className="text-base font-semibold text-brand-text">Rodeos asignados</h4>
            <p className="mt-1 text-sm text-brand-muted">
              Los rodeos agregan sus miembros al alcance efectivo de la geocerca.
            </p>
          </div>

          {rodeos.isLoading ? <LoadingState message="Cargando rodeos..." /> : null}

          {rodeos.isError ? (
            <ErrorState
              title="No pudimos cargar los rodeos"
              message={getGroupErrorMessage(rodeos.error, 'Intentalo nuevamente.')}
            />
          ) : null}

          {geofenceDetail.asset_groups_assigned.length === 0 ? (
            <EmptyState
              title="Sin rodeos asignados"
              message="Puedes sumar rodeos para ampliar el alcance sin perder las asignaciones directas."
            />
          ) : (
            <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
              {geofenceDetail.asset_groups_assigned.map((group) => (
                <div
                  className="rounded-2xl border border-brand-border bg-brand-surfaceSoft p-4"
                  key={group.id_asset_group}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      className="font-semibold text-brand-primary hover:underline"
                      to={`/app/rodeos/${group.id_asset_group}`}
                    >
                      {group.name}
                    </Link>
                    <StatusBadge
                      label={group.active === false ? 'Inactivo' : 'Activo'}
                      tone={group.active === false ? 'default' : 'success'}
                    />
                  </div>
                  <p className="mt-1 text-sm text-brand-muted">{group.description || 'Sin descripcion'}</p>
                  <p className="mt-2 text-xs text-brand-muted">
                    {group.total_assets ?? 0} animales en el rodeo
                  </p>
                </div>
              ))}
            </div>
          )}

          <form className="space-y-4 border-t border-brand-border pt-4" onSubmit={handleAssignGroups}>
            <AssetGroupSelector
              empty_message="No hay rodeos activos disponibles para asignar."
              groups={availableRodeos}
              on_change={setSelectedAssetGroupIds}
              selected_ids={selected_asset_group_ids}
              title="Agregar rodeos"
            />

            {assignAssetGroups.isError ? (
              <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-brand-danger">
                {assignAssetGroups.error.message}
              </p>
            ) : null}

            <Button
              disabled={selected_asset_group_ids.length === 0 || assignAssetGroups.isPending}
              type="submit"
            >
              {assignAssetGroups.isPending ? 'Asignando...' : 'Asignar rodeos seleccionados'}
            </Button>
          </form>

          <form className="space-y-4 border-t border-brand-border pt-4" onSubmit={handleRemoveGroups}>
            <AssetGroupSelector
              empty_message="No hay rodeos asignados para quitar."
              groups={geofenceDetail.asset_groups_assigned}
              on_change={setSelectedAssignedGroupIds}
              selected_ids={selected_assigned_group_ids}
              title="Quitar rodeos"
            />

            {removeAssetGroups.isError ? (
              <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-brand-danger">
                {removeAssetGroups.error.message}
              </p>
            ) : null}

            <Button
              disabled={selected_assigned_group_ids.length === 0 || removeAssetGroups.isPending}
              type="submit"
              variant="secondary"
            >
              {removeAssetGroups.isPending ? 'Quitando...' : 'Quitar rodeos seleccionados'}
            </Button>
          </form>
        </div>

        <div className="space-y-4 rounded-2xl border border-brand-border bg-white p-4">
          <div>
            <h4 className="text-base font-semibold text-brand-text">Assets efectivos</h4>
            <p className="mt-1 text-sm text-brand-muted">
              Cobertura real que resulta de assets directos y miembros que llegan por rodeos.
            </p>
          </div>

          {geofenceDetail.assets_assigned_effective.length === 0 ? (
            <EmptyState
              title="Sin assets efectivos"
              message="Esta geocerca todavia no cubre assets activos por asignacion directa o rodeos."
            />
          ) : (
            <div className="max-h-[32rem] space-y-3 overflow-y-auto pr-1">
              {geofenceDetail.assets_assigned_effective.map((asset) => {
                const fallbackDevice = (devices.data ?? []).find(
                  (device) => device.asset_id === asset.asset_id,
                );
                const fallbackAssetName = fallbackDevice?.asset_name ?? null;

                return (
                  <div
                    className="rounded-2xl border border-brand-border bg-brand-surfaceSoft p-4"
                    key={asset.asset_id}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-brand-text">
                        {getAssetLabel(asset, fallbackAssetName)}
                      </p>
                      {asset.asset_type ? <StatusBadge label={asset.asset_type} /> : null}
                    </div>
                    {asset.device_id ? (
                      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                        <Link
                          className="font-semibold text-brand-primary hover:underline"
                          to={`/app/devices/${asset.device_id}`}
                        >
                          {asset.device_serial || asset.device_name || 'Sin serial'}
                        </Link>
                        <DeviceStateBadge state={asset.device_state || 'unknown'} />
                        {typeof asset.device_active === 'boolean' ? (
                          <StatusBadge
                            label={asset.device_active ? 'Activo' : 'Inactivo'}
                            tone={asset.device_active ? 'success' : 'default'}
                          />
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
