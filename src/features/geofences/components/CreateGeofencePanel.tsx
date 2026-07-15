import { useDeferredValue, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Button, Card } from '../../../shared/components';
import { useAssignAssetGroupsToGeofence } from '../hooks/useAssignAssetGroupsToGeofence';
import { useCreateGeofence } from '../hooks/useCreateGeofence';
import { GeofencePanelHeader } from './GeofencePanelHeader';
import { useMyRodeos } from '../../rodeos/hooks/useMyRodeos';
import type { RodeoSummary } from '../../rodeos/types/rodeo.types';
import type { GeoFenceCreate, Position } from '../types/geofence.types';
import { buildShapeFromDraftPoints } from '../utils/geofenceShape';

type CreateGeofencePanelProps = {
  draft_points: Position[];
  on_created: () => void;
  mode?: 'desktop' | 'mobile';
};

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    if (error.message.includes('409')) {
      return 'Ya existe una geocerca con ese nombre.';
    }

    if (error.message.includes('404')) {
      return 'No pudimos encontrar la geocerca o el rodeo seleccionado.';
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
  return {
    name: name.trim(),
    description: description.trim() ? description.trim() : null,
    active,
    shape: buildShapeFromDraftPoints(draft_points),
  };
}

type RodeoSelectorProps = {
  rodeos: RodeoSummary[];
  selected_rodeo_ids: number[];
  on_change: (rodeo_ids: number[]) => void;
  empty_message: string;
};

function RodeoSelector({
  rodeos,
  selected_rodeo_ids,
  on_change,
  empty_message,
}: RodeoSelectorProps) {
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);

  const filtered_rodeos = useMemo(() => {
    const normalized_search = deferredSearch.trim().toLowerCase();

    if (!normalized_search) {
      return rodeos;
    }

    return rodeos.filter((rodeo) =>
      [rodeo.name, rodeo.description, rodeo.id_asset_group]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(normalized_search),
    );
  }, [deferredSearch, rodeos]);

  function handleToggle(id_asset_group: number, checked: boolean) {
    if (checked) {
      on_change([...selected_rodeo_ids, id_asset_group]);
      return;
    }

    on_change(selected_rodeo_ids.filter((selected_id) => selected_id !== id_asset_group));
  }

  return (
    <details className="rounded-2xl border border-brand-border bg-white px-4 py-3">
      <summary className="cursor-pointer list-none text-sm font-semibold text-brand-text">
        <span className="flex items-center justify-between gap-3">
          <span>Asignar rodeos (opcional)</span>
          <span className="text-xs font-medium text-brand-muted">
            {selected_rodeo_ids.length} seleccionados
          </span>
        </span>
      </summary>

      <p className="mt-2 text-sm text-brand-muted">
        Para crear la geocerca solo puedes sumar rodeos. La asignacion directa de assets se hace despues.
      </p>

      <input
        className="mt-3 w-full rounded-xl border border-brand-border bg-white px-3 py-2 text-sm outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Buscar rodeos"
        value={search}
      />

      {filtered_rodeos.length === 0 ? (
        <p className="mt-3 rounded-xl bg-brand-surfaceSoft px-3 py-2 text-sm text-brand-muted">
          {empty_message}
        </p>
      ) : (
        <div className="mt-3 grid max-h-56 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
          {filtered_rodeos.map((rodeo) => (
            <label
              className="flex items-start gap-3 rounded-xl border border-brand-border bg-brand-surfaceSoft p-3 text-sm text-brand-text"
              key={rodeo.id_asset_group}
            >
              <input
                checked={selected_rodeo_ids.includes(rodeo.id_asset_group)}
                className="mt-1 h-4 w-4 accent-brand-primary"
                onChange={(event) => handleToggle(rodeo.id_asset_group, event.target.checked)}
                type="checkbox"
              />
              <span>
                <span className="block font-semibold">{rodeo.name}</span>
                <span className="block text-brand-muted">{rodeo.description || 'Sin descripcion'}</span>
                <span className="block text-xs text-brand-muted">
                  {rodeo.total_assets ?? 0} animales
                </span>
              </span>
            </label>
          ))}
        </div>
      )}
    </details>
  );
}

export function CreateGeofencePanel({
  draft_points,
  on_created,
  mode = 'desktop',
}: CreateGeofencePanelProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [active, setActive] = useState(true);
  const [selected_rodeo_ids, setSelectedRodeoIds] = useState<number[]>([]);
  const [error_message, setErrorMessage] = useState<string | null>(null);
  const createGeofence = useCreateGeofence();
  const assignAssetGroups = useAssignAssetGroupsToGeofence();
  const rodeos = useMyRodeos();

  const assignable_rodeos = useMemo(
    () => (rodeos.data ?? []).filter((rodeo) => rodeo.active),
    [rodeos.data],
  );

  const can_save = name.trim().length > 0 && draft_points.length >= 3;
  const is_saving = createGeofence.isPending || assignAssetGroups.isPending;
  const is_mobile = mode === 'mobile';
  const show_form = !is_mobile || draft_points.length >= 3;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    if (!can_save) {
      setErrorMessage('Necesitas un nombre y al menos 3 puntos en el mapa.');
      return;
    }

    let geofence_created = false;

    try {
      const created = await createGeofence.mutateAsync(
        buildGeofencePayload(name, description, active, draft_points),
      );
      geofence_created = true;

      if (selected_rodeo_ids.length > 0) {
        await assignAssetGroups.mutateAsync({
          geofence_id: created.id_geofence,
          payload: { asset_group_ids: selected_rodeo_ids },
        });
      }

      on_created();
      setName('');
      setDescription('');
      setSelectedRodeoIds([]);
      setActive(true);
    } catch (error) {
      const base_message = getErrorMessage(error);
      const assignment_failed = geofence_created && selected_rodeo_ids.length > 0;

      setErrorMessage(
        assignment_failed
          ? `La geocerca fue creada, pero fallo la asignacion de rodeos: ${base_message}`
          : base_message,
      );
    }
  }

  return (
    <Card className="border-brand-primary/20 bg-brand-surface/95 shadow-xl shadow-brand-primary/10">
      <GeofencePanelHeader
        description={
          is_mobile
            ? 'Primero dibuja la forma sobre el mapa. Luego completa los datos para guardarla.'
            : 'Marca puntos sobre el mapa, completa los datos y, si quieres, vincula rodeos para ampliar su alcance.'
        }
        mode={mode}
        points_count={draft_points.length}
        title="Nueva geocerca"
      />

      {show_form ? (
        <form className="mt-5 grid gap-4" onSubmit={handleSubmit}>
        <label className="text-sm font-semibold text-brand-text">
          Nombre
          <input
            className="mt-2 w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
            onChange={(event) => setName(event.target.value)}
            placeholder="Potrero norte"
            value={name}
          />
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

        <label className="text-sm font-semibold text-brand-text">
          Descripcion
          <textarea
            className="mt-2 min-h-24 w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Area de contencion para el lote principal"
            value={description}
          />
        </label>

        <RodeoSelector
          empty_message="No hay rodeos activos disponibles para asignar."
          on_change={setSelectedRodeoIds}
          rodeos={assignable_rodeos}
          selected_rodeo_ids={selected_rodeo_ids}
        />

        {rodeos.isError ? (
          <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-brand-danger">
            No pudimos cargar los rodeos.
          </p>
        ) : null}

        <div className="flex items-end justify-end">
          <Button className="w-full sm:w-auto" disabled={!can_save || is_saving} type="submit">
            {is_saving ? 'Guardando...' : 'Guardar geocerca'}
          </Button>
        </div>
      </form>
      ) : null}

      {show_form ? (
        <p className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-brand-accentDark">
          La asignacion directa de assets no se hace aqui para mantener la creacion simple.
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
