import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { EmptyState, ErrorState, LoadingState, PageHeader, StatusBadge } from '../../../shared/components';
import { useCreateRodeo } from '../hooks/useCreateRodeo';
import { useMyRodeos } from '../hooks/useMyRodeos';
import { useRodeoAssetOptions } from '../hooks/useRodeoAssetOptions';
import { RodeoAssetSelector } from '../components/RodeoAssetSelector';
import { RodeoCard } from '../components/RodeoCard';

function getRodeoErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export function RodeosPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selected_asset_ids, setSelectedAssetIds] = useState<number[]>([]);
  const [error_message, setErrorMessage] = useState<string | null>(null);
  const { data: rodeos = [], isLoading, isError, error } = useMyRodeos();
  const assetOptions = useRodeoAssetOptions();
  const createRodeo = useCreateRodeo();

  const orderedRodeos = useMemo(
    () =>
      [...rodeos].sort((left, right) => {
        if (left.active !== right.active) {
          return Number(right.active) - Number(left.active);
        }

        return right.updated_at.localeCompare(left.updated_at);
      }),
    [rodeos],
  );
  const activeRodeos = orderedRodeos.filter((rodeo) => rodeo.active).length;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('El rodeo necesita un nombre.');
      return;
    }

    try {
      await createRodeo.mutateAsync({
        name: name.trim(),
        description: description.trim() ? description.trim() : null,
        asset_ids: selected_asset_ids,
      });
      setName('');
      setDescription('');
      setSelectedAssetIds([]);
    } catch (mutationError) {
      setErrorMessage(getRodeoErrorMessage(mutationError, 'No pudimos crear el rodeo.'));
    }
  }

  return (
    <section className="space-y-5 xl:space-y-4">
      <PageHeader
        title="Rodeos"
        description="Agrupa assets para asignarlos y gestionarlos como un rodeo dentro del cliente."
        actions={
          <>
            <StatusBadge label={`${orderedRodeos.length} rodeos`} />
            <StatusBadge label={`${activeRodeos} activos`} tone="success" />
          </>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="rounded-3xl border border-brand-primary/20 bg-brand-surface/95 p-6 shadow-xl shadow-brand-primary/10">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-brand-text">Nuevo rodeo</h2>
            <p className="text-sm leading-6 text-brand-muted">
              Define el nombre, una descripcion opcional y selecciona los assets que forman el rodeo.
            </p>
          </div>

          <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
            <label className="block text-sm font-semibold text-brand-text">
              Nombre
              <input
                className="mt-2 w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
                maxLength={255}
                onChange={(event) => setName(event.target.value)}
                placeholder="Rodeo Norte"
                value={name}
              />
            </label>

            <label className="block text-sm font-semibold text-brand-text">
              Descripcion
              <textarea
                className="mt-2 min-h-24 w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Lote principal"
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
                on_change={setSelectedAssetIds}
                options={assetOptions.data ?? []}
                selected_asset_ids={selected_asset_ids}
                title="Miembros del rodeo"
              />
            ) : null}

            {error_message ? (
              <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-brand-danger">
                {error_message}
              </p>
            ) : null}

            <button
              className="inline-flex items-center justify-center rounded-full bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-primaryDark hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              disabled={!name.trim() || createRodeo.isPending}
              type="submit"
            >
              {createRodeo.isPending ? 'Creando...' : 'Crear rodeo'}
            </button>
          </form>
        </div>

        <div className="space-y-4">
          {isLoading ? <LoadingState message="Cargando rodeos..." /> : null}

          {isError ? (
            <ErrorState
              title="No pudimos cargar los rodeos"
              message={getRodeoErrorMessage(error, 'Intentalo nuevamente.')}
            />
          ) : null}

          {!isLoading && !isError && orderedRodeos.length === 0 ? (
            <EmptyState
              title="Todavia no hay rodeos"
              message="Crea el primer rodeo para empezar a agrupar assets y asignarlos a geocercas."
            />
          ) : null}

          {!isLoading && !isError && orderedRodeos.length > 0 ? (
            <div className="grid gap-4">
              {orderedRodeos.map((rodeo) => (
                <RodeoCard key={rodeo.id_asset_group} rodeo={rodeo} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
