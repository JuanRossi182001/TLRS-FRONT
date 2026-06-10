import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Button, Card } from '../../../shared/components';
import { useUpdateGeofence } from '../hooks/useUpdateGeofence';
import type { GeoFenceRead, Position } from '../types/geofence.types';
import { buildShapeFromDraftPoints } from '../utils/geofenceShape';

type EditGeofencePanelProps = {
  geofence: GeoFenceRead;
  draft_points: Position[];
  on_cancel: () => void;
  on_updated: () => void;
};

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'No pudimos actualizar la geocerca.';
}

export function EditGeofencePanel({
  geofence,
  draft_points,
  on_cancel,
  on_updated,
}: EditGeofencePanelProps) {
  const [name, setName] = useState(geofence.name);
  const [description, setDescription] = useState(geofence.description ?? '');
  const [error_message, setErrorMessage] = useState<string | null>(null);
  const updateGeofence = useUpdateGeofence();

  useEffect(() => {
    setName(geofence.name);
    setDescription(geofence.description ?? '');
    setErrorMessage(null);
  }, [geofence.description, geofence.name]);

  const can_save = name.trim().length > 0 && draft_points.length >= 3;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    if (!can_save) {
      setErrorMessage('Necesitas un nombre y al menos 3 puntos en el mapa.');
      return;
    }

    try {
      await updateGeofence.mutateAsync({
        geofence_id: geofence.id_geofence,
        payload: {
          name: name.trim(),
          description: description.trim() ? description.trim() : null,
          shape: buildShapeFromDraftPoints(draft_points),
        },
      });
      on_updated();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  }

  return (
    <Card className="border-brand-primary/20 bg-brand-surface/95 shadow-xl shadow-brand-primary/10">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-brand-text">Editar geocerca</h2>
        <p className="text-sm leading-6 text-brand-muted">
          Redibuja la geocerca desde el mapa moviendo, eliminando o agregando vertices.
        </p>
      </div>

      <form className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr_auto]" onSubmit={handleSubmit}>
        <label className="text-sm font-semibold text-brand-text">
          Nombre
          <input
            className="mt-2 w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
            maxLength={255}
            onChange={(event) => setName(event.target.value)}
            value={name}
          />
        </label>

        <label className="text-sm font-semibold text-brand-text lg:col-span-2">
          Descripcion
          <textarea
            className="mt-2 min-h-24 w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
            onChange={(event) => setDescription(event.target.value)}
            value={description}
          />
        </label>

        <div className="flex flex-col justify-end gap-2 sm:flex-row lg:flex-col">
          <Button disabled={!can_save || updateGeofence.isPending} type="submit">
            {updateGeofence.isPending ? 'Guardando...' : 'Guardar cambios'}
          </Button>
          <Button
            disabled={updateGeofence.isPending}
            onClick={on_cancel}
            type="button"
            variant="secondary"
          >
            Cancelar
          </Button>
        </div>
      </form>

      {error_message ? (
        <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-brand-danger">
          {error_message}
        </p>
      ) : null}
    </Card>
  );
}
