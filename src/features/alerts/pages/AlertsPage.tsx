import { Button, ErrorState, LoadingState, PageHeader, StatusBadge } from '../../../shared/components';
import { getUtcTimestampTime } from '../../../shared/utils/dateTime';
import { AlertEmptyState } from '../components/AlertEmptyState';
import { AlertEventList } from '../components/AlertEventList';
import { AlertStats } from '../components/AlertStats';
import { useMyGeofenceEvents } from '../hooks/useMyGeofenceEvents';

export function AlertsPage() {
  const {
    data: events = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useMyGeofenceEvents({ skip: 0, limit: 100 });

  const sortedEvents = [...events].sort(
    (a, b) => getUtcTimestampTime(b.created_at) - getUtcTimestampTime(a.created_at),
  );

  return (
    <section className="space-y-6">
      <PageHeader
        title="Alertas"
        description="Eventos generados por tus geocercas, dispositivos y assets asociados."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge label="Actualizacion automatica cada 30s" />
            <Button disabled={isFetching} onClick={() => refetch()} type="button">
              {isFetching ? 'Actualizando...' : 'Actualizar'}
            </Button>
          </div>
        }
      />

      {isLoading ? <LoadingState message="Cargando eventos de geocercas..." /> : null}

      {isError ? (
        <ErrorState
          title="No pudimos cargar las alertas"
          message={error instanceof Error ? error.message : 'Intentalo nuevamente.'}
        />
      ) : null}

      {!isLoading && !isError && sortedEvents.length === 0 ? <AlertEmptyState /> : null}

      {!isLoading && !isError && sortedEvents.length > 0 ? (
        <>
          <AlertStats events={sortedEvents} />
          <AlertEventList events={sortedEvents} />
        </>
      ) : null}
    </section>
  );
}
