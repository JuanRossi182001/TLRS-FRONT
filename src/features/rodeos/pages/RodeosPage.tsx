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
  const [mobile_view, setMobileView] = useState<'create' | 'list'>('create');
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
    <section className="flex min-h-0 flex-1 flex-col gap-4 xl:gap-4">
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

      <div className="flex min-h-0 flex-1 flex-col gap-4 md:hidden">
        <div className="grid grid-cols-2 rounded-2xl border border-brand-border bg-brand-surfaceSoft p-1">
          <button
            className={[
              'rounded-xl px-3 py-2 text-sm font-semibold transition',
              mobile_view === 'create'
                ? 'bg-white text-brand-primary shadow-sm'
                : 'text-brand-muted hover:text-brand-text',
            ].join(' ')}
            onClick={() => setMobileView('create')}
            type="button"
          >
            Nuevo rodeo
          </button>
          <button
            className={[
              'rounded-xl px-3 py-2 text-sm font-semibold transition',
              mobile_view === 'list'
                ? 'bg-white text-brand-primary shadow-sm'
                : 'text-brand-muted hover:text-brand-text',
            ].join(' ')}
            onClick={() => setMobileView('list')}
            type="button"
          >
            Rodeos ({orderedRodeos.length})
          </button>
        </div>

        {mobile_view === 'create' ? (
          <div className="rounded-3xl border border-brand-primary/20 bg-brand-surface/95 p-4 shadow-xl shadow-brand-primary/10">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-brand-text">Nuevo rodeo</h2>
              <p className="text-sm leading-5 text-brand-muted">
                Define el nombre, una descripcion opcional y selecciona los assets que forman el rodeo.
              </p>
            </div>

            <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
              <label className="block text-sm font-semibold text-brand-text">
                Nombre
                <input
                  className="mt-2 w-full rounded-2xl border border-brand-border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
                  maxLength={255}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Rodeo Norte"
                  value={name}
                />
              </label>

              <label className="block text-sm font-semibold text-brand-text">
                Descripcion
                <textarea
                  className="mt-2 min-h-20 w-full rounded-2xl border border-brand-border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
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
                  max_visible_items={6}
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
        ) : null}

        {mobile_view === 'list' ? (
          <div className="space-y-4 rounded-3xl border border-brand-border/70 bg-brand-surface/95 p-4 shadow-xl shadow-brand-primary/5">
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
              <div className="grid gap-3">
                {orderedRodeos.map((rodeo) => (
                  <RodeoCard key={rodeo.id_asset_group} rodeo={rodeo} />
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="hidden gap-4 md:grid md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] xl:gap-3">
        <div className="rounded-3xl border border-brand-primary/20 bg-brand-surface/95 p-3 shadow-xl shadow-brand-primary/10 xl:p-4">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-brand-text xl:text-xl">Nuevo rodeo</h2>
            <p className="text-sm leading-5 text-brand-muted xl:leading-6">
              Define el nombre, una descripcion opcional y selecciona los assets que forman el rodeo.
            </p>
          </div>

          <form className="mt-3 space-y-3 xl:mt-4 xl:space-y-3" onSubmit={handleSubmit}>
            <label className="block text-sm font-semibold text-brand-text xl:text-xs">
              Nombre
              <input
                className="mt-2 w-full rounded-2xl border border-brand-border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 xl:px-4 xl:py-3"
                maxLength={255}
                onChange={(event) => setName(event.target.value)}
                placeholder="Rodeo Norte"
                value={name}
              />
            </label>

            <label className="block text-sm font-semibold text-brand-text xl:text-xs">
              Descripcion
              <textarea
                className="mt-2 min-h-20 w-full rounded-2xl border border-brand-border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 xl:min-h-24 xl:px-4 xl:py-3"
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
                max_visible_items={4}
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

          <div className="space-y-3 xl:space-y-2">
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
              <div className="grid gap-3 xl:gap-3">
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
