import { Link } from 'react-router-dom';
import { EmptyState, ErrorState, LoadingState, PageHeader } from '../../../shared/components';
import { GeofenceList } from '../components/GeofenceList';
import { GeofenceStatesList } from '../components/GeofenceStatesList';
import { useMyGeofences } from '../hooks/useMyGeofences';

export function GeofencesPage() {
  const { data: geofences = [], isLoading, isError, error } = useMyGeofences();

  return (
    <section className="flex min-h-0 flex-1 flex-col gap-4 xl:gap-3">
      <PageHeader
        title="Geocercas"
        description="Administra areas de contencion para tus assets. La creacion visual se realiza desde el mapa."
        actions={
          <Link
            className="inline-flex rounded-full bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-primaryDark hover:shadow-md"
            to="/app/map"
          >
            Crear geocerca en el mapa
          </Link>
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
        <div className="grid min-h-0 flex-1 gap-4 xl:grid-rows-[minmax(0,0.95fr)_minmax(0,1.05fr)] xl:gap-3">
          <div className="min-h-0 space-y-3 xl:flex xl:min-h-0 xl:flex-col xl:space-y-2">
            {geofences.length === 0 ? (
              <EmptyState
                title="No hay geocercas registradas"
                message="Crea una geocerca desde el mapa marcando al menos tres puntos."
              />
            ) : (
              <GeofenceList geofences={geofences} />
            )}
          </div>

          <div className="min-h-0 space-y-3 xl:flex xl:min-h-0 xl:flex-col xl:space-y-2">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-brand-text xl:text-xl">
                Estados actuales
              </h2>
              <p className="mt-1 text-sm leading-6 text-brand-muted xl:text-xs">
                Estado de cada asset respecto de sus geocercas asignadas.
              </p>
            </div>
            <GeofenceStatesList />
          </div>
        </div>
      ) : null}
    </section>
  );
}
