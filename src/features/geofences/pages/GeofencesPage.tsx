import { useState } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState, ErrorState, LoadingState, PageHeader, StatusBadge } from '../../../shared/components';
import { GeofenceList } from '../components/GeofenceList';
import { GeofenceStatesList } from '../components/GeofenceStatesList';
import { useMyGeofences } from '../hooks/useMyGeofences';

export function GeofencesPage() {
  const { data: geofences = [], isLoading, isError, error } = useMyGeofences();
  const [mobile_view, setMobileView] = useState<'geofences' | 'states'>('geofences');

  const geofenceCount = geofences.length;

  return (
    <section className="flex min-h-0 flex-1 flex-col gap-4 xl:gap-4">
      <PageHeader
        title="Geocercas"
        description="Administra areas de contencion para tus assets y rodeos. La creacion visual se realiza desde el mapa."
        actions={
          <>
            <StatusBadge label={`${geofenceCount} geocercas`} />
            <Link
              className="inline-flex rounded-full bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-primaryDark hover:shadow-md"
              to="/app/map"
            >
              Crear geocerca en el mapa
            </Link>
          </>
        }
      />

      {isLoading ? <LoadingState message="Cargando geocercas..." /> : null}

      {isError ? (
        <ErrorState
          title="No pudimos cargar las geocercas"
          message={error instanceof Error ? error.message : 'Intentalo nuevamente.'}
        />
      ) : null}

      {!isLoading && !isError ? (
        <>
          <div className="flex min-h-0 flex-1 flex-col gap-4 md:hidden">
            <div className="grid grid-cols-2 rounded-2xl border border-brand-border bg-brand-surfaceSoft p-1">
              <button
                className={[
                  'rounded-xl px-3 py-2 text-sm font-semibold transition',
                  mobile_view === 'geofences'
                    ? 'bg-white text-brand-primary shadow-sm'
                    : 'text-brand-muted hover:text-brand-text',
                ].join(' ')}
                onClick={() => setMobileView('geofences')}
                type="button"
              >
                Geocercas
              </button>
              <button
                className={[
                  'rounded-xl px-3 py-2 text-sm font-semibold transition',
                  mobile_view === 'states'
                    ? 'bg-white text-brand-primary shadow-sm'
                    : 'text-brand-muted hover:text-brand-text',
                ].join(' ')}
                onClick={() => setMobileView('states')}
                type="button"
              >
                Estados
              </button>
            </div>

            {mobile_view === 'geofences' ? (
              <div className="space-y-4 rounded-3xl border border-brand-primary/20 bg-brand-surface/95 p-4 shadow-xl shadow-brand-primary/10">
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold text-brand-text">Geocercas</h2>
                  <p className="text-sm leading-6 text-brand-muted">
                    Administra tus areas de contencion y accede rapido a editar o ver cada una.
                  </p>
                </div>

                {geofences.length === 0 ? (
                  <EmptyState
                    title="No hay geocercas registradas"
                    message="Crea una geocerca desde el mapa marcando al menos tres puntos."
                  />
                ) : (
                  <GeofenceList geofences={geofences} />
                )}
              </div>
            ) : null}

            {mobile_view === 'states' ? (
              <div className="space-y-4 rounded-3xl border border-brand-border/70 bg-brand-surface/95 p-4 shadow-xl shadow-brand-primary/5">
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold text-brand-text">Estados actuales</h2>
                  <p className="text-sm leading-6 text-brand-muted">
                    Estado de cada asset respecto de sus geocercas asignadas.
                  </p>
                </div>

                <GeofenceStatesList />
              </div>
            ) : null}
          </div>

          <div className="hidden min-h-0 gap-4 md:grid md:h-[calc(100dvh-12rem)] md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] xl:gap-4 xl:h-[calc(100dvh-12rem)]">
            <div className="flex min-h-0 flex-col rounded-3xl border border-brand-primary/20 bg-brand-surface/95 p-4 shadow-xl shadow-brand-primary/10 xl:p-5">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold tracking-tight text-brand-text xl:text-lg">
                  Geocercas
                </h2>
                <p className="text-sm leading-6 text-brand-muted xl:text-xs">
                  Administra tus areas de contencion y accede rapido a editar o ver cada una.
                </p>
              </div>

              <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1">
                {geofences.length === 0 ? (
                  <EmptyState
                    title="No hay geocercas registradas"
                    message="Crea una geocerca desde el mapa marcando al menos tres puntos."
                  />
                ) : (
                  <GeofenceList geofences={geofences} />
                )}
              </div>
            </div>

            <div className="flex min-h-0 flex-col rounded-3xl border border-brand-border/70 bg-brand-surface/95 p-4 shadow-xl shadow-brand-primary/5 xl:p-5">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold tracking-tight text-brand-text xl:text-lg">
                  Estados actuales
                </h2>
                <p className="text-sm leading-6 text-brand-muted xl:text-xs">
                  Estado de cada asset respecto de sus geocercas asignadas.
                </p>
              </div>

              <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1">
                <GeofenceStatesList />
              </div>
            </div>
          </div>
        </>
      ) : null}
    </section>
  );
}
