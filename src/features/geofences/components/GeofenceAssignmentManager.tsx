import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import {
  Button,
  EmptyState,
  ErrorState,
  LoadingState,
  StatusBadge,
} from '../../../shared/components';
import { formatArgentinaDateTime } from '../../../shared/utils/dateTime';
import { useAssignAssetsToGeofence } from '../hooks/useAssignAssetsToGeofence';
import { useDeactivateGeofenceAssignment } from '../hooks/useDeactivateGeofenceAssignment';
import { useGeofenceAssignableDevices } from '../hooks/useGeofenceAssignableDevices';
import { useGeofenceAssignments } from '../hooks/useGeofenceAssignments';
import type { GeoFenceAssignmentRead } from '../types/geofence.types';

type GeofenceAssignmentManagerProps = {
  geofence_id: number;
  is_open: boolean;
};

function getAssignmentId(assignment: GeoFenceAssignmentRead) {
  return assignment.id_assignment ?? assignment.id_geofence_assignment ?? null;
}

export function GeofenceAssignmentManager({
  geofence_id,
  is_open,
}: GeofenceAssignmentManagerProps) {
  const [selected_asset_ids, setSelectedAssetIds] = useState<number[]>([]);
  const assignments = useGeofenceAssignments(geofence_id, is_open);
  const devices = useGeofenceAssignableDevices(is_open);
  const assignAssets = useAssignAssetsToGeofence();
  const deactivateAssignment = useDeactivateGeofenceAssignment();

  const active_assignments = useMemo(
    () => (assignments.data ?? []).filter((assignment) => assignment.active),
    [assignments.data],
  );

  const assigned_asset_ids = useMemo(
    () => new Set(active_assignments.map((assignment) => assignment.asset_id)),
    [active_assignments],
  );

  const assignable_devices = useMemo(
    () =>
      (devices.data ?? []).filter(
        (device) => device.asset_id !== null && !assigned_asset_ids.has(device.asset_id),
      ),
    [assigned_asset_ids, devices.data],
  );

  function handleSelection(asset_id: number, checked: boolean) {
    setSelectedAssetIds((current) =>
      checked ? [...current, asset_id] : current.filter((selected) => selected !== asset_id),
    );
  }

  async function handleAssign(event: FormEvent<HTMLFormElement>) {
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

  async function handleDeactivate(assignment: GeoFenceAssignmentRead) {
    const assignment_id = getAssignmentId(assignment);

    if (!assignment_id) {
      return;
    }

    await deactivateAssignment.mutateAsync({ assignment_id, geofence_id });
  }

  if (!is_open) {
    return null;
  }

  return (
    <div className="space-y-4 rounded-2xl border border-brand-border bg-brand-surfaceSoft p-4">
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-brand-text">Dispositivos asignados</h3>

        {assignments.isLoading ? <LoadingState message="Cargando asignaciones..." /> : null}

        {assignments.isError ? (
          <ErrorState
            title="No pudimos cargar las asignaciones"
            message={
              assignments.error instanceof Error
                ? assignments.error.message
                : 'Intentalo nuevamente.'
            }
          />
        ) : null}

        {!assignments.isLoading && !assignments.isError && active_assignments.length === 0 ? (
          <EmptyState
            title="Sin dispositivos asignados"
            message="Todavia no hay dispositivos activos en esta geocerca."
          />
        ) : null}

        {active_assignments.length > 0 ? (
          <div className="grid gap-3">
            {active_assignments.map((assignment) => {
              const device = (devices.data ?? []).find(
                (candidate) => candidate.asset_id === assignment.asset_id,
              );
              const assignment_id = getAssignmentId(assignment);
              const is_deactivating =
                deactivateAssignment.isPending &&
                deactivateAssignment.variables?.assignment_id === assignment_id;

              return (
                <div
                  className="flex flex-col gap-3 rounded-2xl border border-brand-border bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
                  key={assignment_id ?? assignment.asset_id}
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-brand-text">
                        {device ? device.name : `Asset ${assignment.asset_id}`}
                      </p>
                      <StatusBadge label="Activo" tone="success" />
                    </div>
                    <p className="mt-1 text-sm text-brand-muted">
                      {device
                        ? `${device.serial} - Asset ${assignment.asset_id}`
                        : `Asset ${assignment.asset_id}`}
                    </p>
                    <p className="mt-1 text-xs text-brand-muted">
                      Asignado {formatArgentinaDateTime(assignment.assigned_at)}
                    </p>
                  </div>

                  <Button
                    className="w-full sm:w-auto"
                    disabled={!assignment_id || is_deactivating}
                    onClick={() => handleDeactivate(assignment)}
                    type="button"
                    variant="secondary"
                  >
                    {is_deactivating ? 'Desactivando...' : 'Desactivar'}
                  </Button>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>

      <form className="space-y-3" onSubmit={handleAssign}>
        <h3 className="text-sm font-semibold text-brand-text">Agregar dispositivos</h3>

        {devices.isLoading ? <LoadingState message="Cargando dispositivos..." /> : null}

        {devices.isError ? (
          <ErrorState
            title="No pudimos cargar los dispositivos"
            message={
              devices.error instanceof Error ? devices.error.message : 'Intentalo nuevamente.'
            }
          />
        ) : null}

        {!devices.isLoading && !devices.isError && assignable_devices.length === 0 ? (
          <p className="rounded-2xl bg-white px-4 py-3 text-sm text-brand-muted">
            No hay dispositivos con asset disponible para agregar.
          </p>
        ) : null}

        {assignable_devices.length > 0 ? (
          <div className="grid gap-2 sm:grid-cols-2">
            {assignable_devices.map((device) => {
              const asset_id = device.asset_id;

              if (asset_id === null) {
                return null;
              }

              return (
                <label
                  className="flex items-start gap-3 rounded-2xl border border-brand-border bg-white p-3 text-sm text-brand-text"
                  key={device.id_device}
                >
                  <input
                    checked={selected_asset_ids.includes(asset_id)}
                    className="mt-1 h-4 w-4 accent-brand-primary"
                    onChange={(event) => handleSelection(asset_id, event.target.checked)}
                    type="checkbox"
                  />
                  <span>
                    <span className="block font-semibold">{device.name}</span>
                    <span className="block text-brand-muted">
                      {device.serial} - Asset {asset_id}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        ) : null}

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

        <Button
          className="w-full sm:w-auto"
          disabled={selected_asset_ids.length === 0 || assignAssets.isPending}
          type="submit"
        >
          {assignAssets.isPending ? 'Agregando...' : 'Agregar seleccionados'}
        </Button>
      </form>
    </div>
  );
}
