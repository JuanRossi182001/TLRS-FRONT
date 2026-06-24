import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Card, EmptyState, ErrorState, LoadingState, PageHeader, StatusBadge } from '../../../shared/components';
import { formatArgentinaDateTime } from '../../../shared/utils/dateTime';
import { DeviceStateBadge } from '../../devices/components/DeviceStateBadge';
import { useAddRodeoMembers } from '../hooks/useAddRodeoMembers';
import { useRemoveRodeoMembers } from '../hooks/useRemoveRodeoMembers';
import { useRodeo } from '../hooks/useRodeo';
import { useRodeoAssetOptions } from '../hooks/useRodeoAssetOptions';
import { useSetRodeoActivation } from '../hooks/useSetRodeoActivation';
import { useUpdateRodeo } from '../hooks/useUpdateRodeo';
import { RodeoAssetSelector } from '../components/RodeoAssetSelector';
import type { RodeoAssetOption } from '../types/rodeo.types';

function getRodeoErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

function buildMemberOption(member: {
  asset_id: number;
  asset_name?: string | null;
  asset_type: string | null;
  asset_serial: string | null;
  device_id: number | null;
  device_name: string | null;
  device_serial: string | null;
  device_active: boolean | null;
  device_state: string | null;
}): RodeoAssetOption {
  const label = member.asset_name?.trim() || member.asset_serial?.trim() || 'Asset sin nombre';

  return {
    asset_id: member.asset_id,
    asset_name: member.asset_name ?? member.asset_serial ?? null,
    asset_type: member.asset_type,
    asset_serial: member.asset_serial,
    device_id: member.device_id ?? 0,
    device_name: member.device_name ?? 'Sin device',
    device_serial: member.device_serial ?? 'Sin serial',
    device_active: member.device_active ?? false,
    device_state: member.device_state ?? 'unknown',
    label,
    search_text: [
      label,
      member.asset_type,
      member.asset_serial,
      member.asset_id,
      member.device_name,
      member.device_serial,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase(),
  };
}

export function RodeoDetailPage() {
  const { assetGroupId } = useParams<{ assetGroupId: string }>();
  const id_asset_group = Number(assetGroupId);
  const isValidId = Number.isFinite(id_asset_group) && id_asset_group > 0;
  const rodeo = useRodeo(id_asset_group, isValidId);
  const assetOptions = useRodeoAssetOptions(isValidId);
  const updateRodeo = useUpdateRodeo();
  const setRodeoActivation = useSetRodeoActivation();
  const addRodeoMembers = useAddRodeoMembers();
  const removeRodeoMembers = useRemoveRodeoMembers();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [edit_asset_ids, setEditAssetIds] = useState<number[]>([]);
  const [assets_to_add, setAssetsToAdd] = useState<number[]>([]);
  const [assets_to_remove, setAssetsToRemove] = useState<number[]>([]);
  const [edit_error_message, setEditErrorMessage] = useState<string | null>(null);
  const [add_error_message, setAddErrorMessage] = useState<string | null>(null);
  const [remove_error_message, setRemoveErrorMessage] = useState<string | null>(null);
  const currentRodeo = rodeo.data;

  useEffect(() => {
    if (!currentRodeo) {
      return;
    }

    setName(currentRodeo.name);
    setDescription(currentRodeo.description ?? '');
    setEditAssetIds(currentRodeo.members.map((member) => member.asset_id));
    setAssetsToAdd([]);
    setAssetsToRemove([]);
  }, [currentRodeo]);

  const memberOptions = useMemo(
    () => (currentRodeo?.members ?? []).map(buildMemberOption),
    [currentRodeo?.members],
  );
  const memberIds = useMemo(
    () => new Set((currentRodeo?.members ?? []).map((member) => member.asset_id)),
    [currentRodeo?.members],
  );
  const availableAssetsToAdd = useMemo(
    () => (assetOptions.data ?? []).filter((option) => !memberIds.has(option.asset_id)),
    [assetOptions.data, memberIds],
  );

  if (!isValidId) {
    return (
      <ErrorState
        title="Rodeo no encontrado"
        message="El identificador solicitado no es valido."
      />
    );
  }

  if (rodeo.isLoading) {
    return <LoadingState message="Cargando rodeo..." />;
  }

  if (rodeo.isError) {
    return (
      <ErrorState
        title="No pudimos cargar el rodeo"
        message={getRodeoErrorMessage(rodeo.error, 'Intentalo nuevamente.')}
      />
    );
  }

  if (!currentRodeo) {
    return (
      <EmptyState
        title="No encontramos este rodeo"
        message="Volve al listado para seleccionar un rodeo disponible."
      />
    );
  }

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEditErrorMessage(null);

    if (!name.trim()) {
      setEditErrorMessage('El rodeo necesita un nombre.');
      return;
    }

    try {
      await updateRodeo.mutateAsync({
        id_asset_group,
        payload: {
          name: name.trim(),
          description: description.trim() ? description.trim() : null,
          asset_ids: edit_asset_ids,
        },
      });
    } catch (error) {
      setEditErrorMessage(getRodeoErrorMessage(error, 'No pudimos guardar los cambios.'));
    }
  }

  async function handleActivationToggle() {
    if (!currentRodeo) {
      return;
    }

    try {
      await setRodeoActivation.mutateAsync({
        id_asset_group,
        payload: { active: !currentRodeo.active },
      });
    } catch {
      return;
    }
  }

  async function handleAddMembers(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAddErrorMessage(null);

    if (assets_to_add.length === 0) {
      setAddErrorMessage('Selecciona al menos un asset para agregar.');
      return;
    }

    try {
      await addRodeoMembers.mutateAsync({
        id_asset_group,
        payload: { asset_ids: assets_to_add },
      });
      setAssetsToAdd([]);
    } catch (error) {
      setAddErrorMessage(getRodeoErrorMessage(error, 'No pudimos agregar miembros.'));
    }
  }

  async function handleRemoveMembers(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRemoveErrorMessage(null);

    if (assets_to_remove.length === 0) {
      setRemoveErrorMessage('Selecciona al menos un asset para quitar.');
      return;
    }

    try {
      await removeRodeoMembers.mutateAsync({
        id_asset_group,
        payload: { asset_ids: assets_to_remove },
      });
      setAssetsToRemove([]);
    } catch (error) {
      setRemoveErrorMessage(getRodeoErrorMessage(error, 'No pudimos quitar miembros.'));
    }
  }

  return (
    <section className="space-y-5 xl:space-y-4">
      <PageHeader
        title={currentRodeo.name}
        description="Detalle del rodeo, sus miembros y acciones rapidas de mantenimiento."
        actions={
          <>
            <StatusBadge
              label={currentRodeo.active ? 'Activo' : 'Inactivo'}
              tone={currentRodeo.active ? 'success' : 'default'}
            />
            <Button disabled={setRodeoActivation.isPending} onClick={handleActivationToggle} type="button" variant="secondary">
              {setRodeoActivation.isPending
                ? 'Actualizando...'
                : currentRodeo.active
                  ? 'Desactivar'
                  : 'Activar'}
            </Button>
            <Link
              className="inline-flex items-center justify-center rounded-full border border-brand-border/70 bg-brand-surface px-5 py-2.5 text-sm font-semibold text-brand-primary shadow-sm transition hover:bg-brand-surfaceSoft hover:shadow-md"
              to="/app/rodeos"
            >
              Volver a rodeos
            </Link>
          </>
        }
      />

      {setRodeoActivation.isError ? (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-brand-danger">
          {getRodeoErrorMessage(setRodeoActivation.error, 'No pudimos actualizar el rodeo.')}
        </p>
      ) : null}

      <Card className="space-y-6">
        <div className="grid gap-4 text-sm sm:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-2xl bg-brand-surfaceSoft p-4">
            <dt className="font-medium text-brand-muted">ID</dt>
            <dd className="mt-1 text-brand-text">{currentRodeo.id_asset_group}</dd>
          </div>
          <div className="rounded-2xl bg-brand-surfaceSoft p-4">
            <dt className="font-medium text-brand-muted">Descripcion</dt>
            <dd className="mt-1 text-brand-text">{currentRodeo.description || 'Sin descripcion'}</dd>
          </div>
          <div className="rounded-2xl bg-brand-surfaceSoft p-4">
            <dt className="font-medium text-brand-muted">Animales</dt>
            <dd className="mt-1 text-brand-text">{currentRodeo.total_assets}</dd>
          </div>
          <div className="rounded-2xl bg-brand-surfaceSoft p-4">
            <dt className="font-medium text-brand-muted">Creado</dt>
            <dd className="mt-1 text-brand-text">{formatArgentinaDateTime(currentRodeo.created_at)}</dd>
          </div>
          <div className="rounded-2xl bg-brand-surfaceSoft p-4">
            <dt className="font-medium text-brand-muted">Actualizado</dt>
            <dd className="mt-1 text-brand-text">{formatArgentinaDateTime(currentRodeo.updated_at)}</dd>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <Card className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-brand-text">Editar rodeo</h2>
            <p className="mt-1 text-sm leading-6 text-brand-muted">
              Cambia nombre, descripcion y reemplaza la membresia completa cuando sea necesario.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleUpdate}>
            <label className="block text-sm font-semibold text-brand-text">
              Nombre
              <input
                className="mt-2 w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
                maxLength={255}
                onChange={(event) => setName(event.target.value)}
                value={name}
              />
            </label>

            <label className="block text-sm font-semibold text-brand-text">
              Descripcion
              <textarea
                className="mt-2 min-h-24 w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
                onChange={(event) => setDescription(event.target.value)}
                value={description}
              />
            </label>

            {assetOptions.isLoading ? <LoadingState message="Cargando assets disponibles..." /> : null}

            {assetOptions.isError ? (
              <ErrorState
                title="No pudimos cargar los assets"
                message={getRodeoErrorMessage(assetOptions.error, 'Intentalo nuevamente.')}
              />
            ) : null}

            {!assetOptions.isLoading && !assetOptions.isError ? (
              <RodeoAssetSelector
                empty_message="No encontramos assets con ese criterio."
                on_change={setEditAssetIds}
                options={assetOptions.data ?? []}
                selected_asset_ids={edit_asset_ids}
                title="Membresia completa"
              />
            ) : null}

            {edit_error_message ? (
              <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-brand-danger">
                {edit_error_message}
              </p>
            ) : null}

            <Button disabled={!name.trim() || updateRodeo.isPending} type="submit">
              {updateRodeo.isPending ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </form>
        </Card>

        <Card className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-brand-text">Miembros actuales</h2>
            <p className="mt-1 text-sm leading-6 text-brand-muted">
              Cada miembro muestra el asset y el device actual asociado, si existe.
            </p>
          </div>

          {currentRodeo.members.length === 0 ? (
            <EmptyState
              title="Sin miembros"
              message="Este rodeo todavia no tiene assets asociados."
            />
          ) : (
            <div className="space-y-3">
              {currentRodeo.members.map((member) => (
                <div
                  className="rounded-2xl border border-brand-border bg-brand-surfaceSoft p-4"
                  key={member.asset_id}
                >
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-brand-text">
                        {member.asset_name || member.asset_serial || 'Asset sin nombre'}
                      </p>
                      {member.asset_type ? <StatusBadge label={member.asset_type} /> : null}
                    </div>

                  {member.device_id ? (
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                      <Link
                        className="font-semibold text-brand-primary hover:underline"
                        to={`/app/devices/${member.device_id}`}
                      >
                        {member.device_serial || member.device_name || 'Sin serial'}
                      </Link>
                      <DeviceStateBadge state={member.device_state || 'unknown'} />
                      <StatusBadge
                        label={member.device_active ? 'Activo' : 'Inactivo'}
                        tone={member.device_active ? 'success' : 'default'}
                      />
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-brand-muted">Sin device actual asociado.</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-brand-text">Agregar miembros</h2>
            <p className="mt-1 text-sm leading-6 text-brand-muted">
              Selecciona assets que todavia no formen parte del rodeo.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleAddMembers}>
            {assetOptions.isLoading ? <LoadingState message="Cargando assets disponibles..." /> : null}

            {assetOptions.isError ? (
              <ErrorState
                title="No pudimos cargar los assets"
                message={getRodeoErrorMessage(assetOptions.error, 'Intentalo nuevamente.')}
              />
            ) : null}

            {!assetOptions.isLoading && !assetOptions.isError ? (
              <RodeoAssetSelector
                empty_message="No hay assets disponibles para agregar."
                on_change={setAssetsToAdd}
                options={availableAssetsToAdd}
                selected_asset_ids={assets_to_add}
                title="Assets disponibles"
              />
            ) : null}

            {add_error_message ? (
              <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-brand-danger">
                {add_error_message}
              </p>
            ) : null}

            <Button disabled={assets_to_add.length === 0 || addRodeoMembers.isPending} type="submit">
              {addRodeoMembers.isPending ? 'Agregando...' : 'Agregar seleccionados'}
            </Button>
          </form>
        </Card>

        <Card className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-brand-text">Quitar miembros</h2>
            <p className="mt-1 text-sm leading-6 text-brand-muted">
              Elimina miembros sin perder el resto de la configuracion del rodeo.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleRemoveMembers}>
            <RodeoAssetSelector
              empty_message="No hay miembros para quitar."
              on_change={setAssetsToRemove}
              options={memberOptions}
              selected_asset_ids={assets_to_remove}
              title="Miembros del rodeo"
            />

            {remove_error_message ? (
              <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-brand-danger">
                {remove_error_message}
              </p>
            ) : null}

            <Button disabled={assets_to_remove.length === 0 || removeRodeoMembers.isPending} type="submit" variant="secondary">
              {removeRodeoMembers.isPending ? 'Quitando...' : 'Quitar seleccionados'}
            </Button>
          </form>
        </Card>
      </div>
    </section>
  );
}
