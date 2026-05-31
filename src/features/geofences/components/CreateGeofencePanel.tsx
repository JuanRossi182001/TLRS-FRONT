import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Button, Card } from '../../../shared/components';
import type { DeviceApiResponse } from '../../devices/types/device.types';
import { useAssignAssetsToGeofence } from '../hooks/useAssignAssetsToGeofence';
import { useCreateGeofence } from '../hooks/useCreateGeofence';
import type { GeoFenceCreate, Position } from '../types/geofence.types';

type CreateGeofencePanelProps = {
  draft_points: Position[];
  devices: DeviceApiResponse[];
  on_created: () => void;
};

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    if (error.message.includes('409')) {
      return 'Ya existe una geocerca con ese nombre.';
    }

    if (error.message.includes('404')) {
      return 'No pudimos encontrar la geocerca o el asset seleccionado.';
    }

    return error.message;
  }

  return 'No pudimos guardar la geocerca.';
}

function buildGeofencePayload(
  name: string,
  description: string,
  active: boolean,
  draft_points: Position[],
): GeoFenceCreate {
  const closed_ring = [...draft_points, draft_points[0]];

  return {
    name: name.trim(),
    description: description.trim() ? description.trim() : null,
    active,
    shape: {
      type: 'MultiPolygon',
      coordinates: [[closed_ring]],
    },
  };
}

export function CreateGeofencePanel({
  draft_points,
  devices,
  on_created,
}: CreateGeofencePanelProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [active, setActive] = useState(true);
  const [selected_asset_id, setSelectedAssetId] = useState('');
  const [error_message, setErrorMessage] = useState<string | null>(null);
  const createGeofence = useCreateGeofence();
  const assignAssets = useAssignAssetsToGeofence();

  const assignable_devices = useMemo(
    () => devices.filter((device) => device.asset_id !== null),
    [devices],
  );

  const can_save = name.trim().length > 0 && draft_points.length >= 3;
  const is_saving = createGeofence.isPending || assignAssets.isPending;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    if (!can_save) {
      setErrorMessage('Necesitas un nombre y al menos 3 puntos en el mapa.');
      return;
    }

    try {
      const created = await createGeofence.mutateAsync(
        buildGeofencePayload(name, description, active, draft_points),
      );

      if (selected_asset_id) {
        await assignAssets.mutateAsync({
          geofence_id: created.id_geofence,
          payload: { asset_ids: [Number(selected_asset_id)] },
        });
      }

      on_created();
      setName('');
      setDescription('');
      setSelectedAssetId('');
      setActive(true);
    } catch (error) {
      const base_message = getErrorMessage(error);
      const assignment_failed = createGeofence.isSuccess && selected_asset_id;

      setErrorMessage(
        assignment_failed
          ? `La geocerca fue creada, pero fallo la asignacion: ${base_message}`
          : base_message,
      );
    }
  }

  return (
    <Card className="border-brand-primary/20 bg-brand-surface/95 shadow-xl shadow-brand-primary/10">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-brand-text">Nueva geocerca</h2>
        <p className="text-sm leading-6 text-brand-muted">
          Marca puntos sobre el mapa, completa los datos y asignala a un asset desde un collar.
        </p>
      </div>

      <form className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr_auto]" onSubmit={handleSubmit}>
        <label className="text-sm font-semibold text-brand-text">
          Nombre
          <input
            className="mt-2 w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
            onChange={(event) => setName(event.target.value)}
            placeholder="Potrero norte"
            value={name}
          />
        </label>

        <label className="text-sm font-semibold text-brand-text">
          Device con asset
          <select
            className="mt-2 w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
            onChange={(event) => setSelectedAssetId(event.target.value)}
            value={selected_asset_id}
          >
            <option value="">Sin asignar por ahora</option>
            {assignable_devices.map((device) => (
              <option key={device.id_device} value={device.asset_id ?? ''}>
                {device.name} - {device.serial} - Asset {device.asset_id}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-end gap-3 rounded-2xl border border-brand-border bg-brand-surfaceSoft px-4 py-3 text-sm font-semibold text-brand-text">
          <input
            checked={active}
            className="h-4 w-4 accent-brand-primary"
            onChange={(event) => setActive(event.target.checked)}
            type="checkbox"
          />
          Activa
        </label>

        <label className="text-sm font-semibold text-brand-text lg:col-span-2">
          Descripcion
          <textarea
            className="mt-2 min-h-24 w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Area de contencion para el lote principal"
            value={description}
          />
        </label>

        <div className="flex items-end">
          <Button disabled={!can_save || is_saving} type="submit">
            {is_saving ? 'Guardando...' : 'Guardar geocerca'}
          </Button>
        </div>
      </form>

      {assignable_devices.length === 0 ? (
        <p className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-brand-accentDark">
          No hay dispositivos con asset_id para asignar. La geocerca se puede crear sin asignacion.
        </p>
      ) : null}

      {error_message ? (
        <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-brand-danger">
          {error_message}
        </p>
      ) : null}
    </Card>
  );
}
