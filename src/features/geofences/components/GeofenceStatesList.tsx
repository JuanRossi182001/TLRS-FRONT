import { Card, EmptyState, ErrorState, LoadingState } from '../../../shared/components';
import { useGeofenceStates } from '../hooks/useGeofenceStates';
import type { GeoFenceAssetState } from '../types/geofenceState.types';
import { getGeofenceStatusUi } from '../utils/geofenceStatusUi';
import { GeofenceStatusBadge } from './GeofenceStatusBadge';

function formatDateTime(value: string | null) {
  if (!value) {
    return 'Sin datos';
  }

  return new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}

function formatMeters(value: number | null) {
  if (value === null) {
    return 'Sin datos';
  }

  return `${value.toFixed(1)} m`;
}

function sortStates(states: GeoFenceAssetState[]) {
  return [...states].sort(
    (a, b) =>
      new Date(b.last_evaluated_at ?? 0).getTime() -
      new Date(a.last_evaluated_at ?? 0).getTime(),
  );
}

export function GeofenceStatesList() {
  const { data: states = [], isLoading, isError, error } = useGeofenceStates();
  const sortedStates = sortStates(states);

  if (isLoading) {
    return <LoadingState message="Cargando estados actuales de geocercas..." />;
  }

  if (isError) {
    return (
      <ErrorState
        title="No pudimos cargar los estados actuales"
        message={error instanceof Error ? error.message : 'Intentalo nuevamente.'}
      />
    );
  }

  if (sortedStates.length === 0) {
    return (
      <EmptyState
        title="Sin estados actuales"
        message="Cuando tus assets sean evaluados contra geocercas, sus estados apareceran aca."
      />
    );
  }

  return (
    <div className="grid gap-4">
      {sortedStates.map((state) => {
        const ui = getGeofenceStatusUi(state.current_status);

        return (
          <Card
            className="space-y-4 transition hover:-translate-y-0.5 hover:shadow-md hover:shadow-brand-primary/10"
            key={`${state.asset_id}-${state.fence_id}`}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-semibold text-brand-text">
                    {state.asset_serial}
                  </h3>
                  <GeofenceStatusBadge current_status={state.current_status} />
                </div>
                <p className="mt-2 text-sm leading-6 text-brand-muted">{ui.description}</p>
              </div>
              <time
                className="text-sm font-medium text-brand-muted"
                dateTime={state.last_evaluated_at ?? undefined}
              >
                {formatDateTime(state.last_evaluated_at)}
              </time>
            </div>

            <div className="grid gap-3 text-sm sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl bg-brand-surfaceSoft p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">Device</p>
                <p className="mt-1 font-semibold text-brand-text">{state.device_name}</p>
                <p className="mt-1 text-brand-muted">{state.device_serial}</p>
              </div>
              <div className="rounded-2xl bg-brand-surfaceSoft p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">Geocerca</p>
                <p className="mt-1 font-semibold text-brand-text">{state.geofence_name}</p>
                <p className="mt-1 text-brand-muted">Fence #{state.fence_id}</p>
              </div>
              <div className="rounded-2xl bg-brand-surfaceSoft p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">Distancia</p>
                <p className="mt-1 font-semibold text-brand-text">
                  {formatMeters(state.last_distance_to_boundary_meters)}
                </p>
              </div>
              <div className="rounded-2xl bg-brand-surfaceSoft p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">Accuracy</p>
                <p className="mt-1 font-semibold text-brand-text">
                  {formatMeters(state.last_accuracy)}
                </p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
