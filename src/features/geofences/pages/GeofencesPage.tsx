import { Link } from 'react-router-dom';
import { EmptyState, ErrorState, LoadingState, PageHeader } from '../../../shared/components';
import { GeofenceList } from '../components/GeofenceList';
import { useMyGeofences } from '../hooks/useMyGeofences';

export function GeofencesPage() {
  const { data: geofences = [], isLoading, isError, error } = useMyGeofences();

  return (
    <section className="space-y-6">
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

      {!isLoading && !isError && geofences.length === 0 ? (
        <EmptyState
          title="No hay geocercas registradas"
          message="Crea una geocerca desde el mapa marcando al menos tres puntos."
        />
      ) : null}

      {!isLoading && !isError && geofences.length > 0 ? (
        <GeofenceList geofences={geofences} />
      ) : null}
    </section>
  );
}
