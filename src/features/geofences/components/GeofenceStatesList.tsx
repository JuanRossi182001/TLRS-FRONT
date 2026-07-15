import { useEffect, useState } from 'react';
import { Button, Card, EmptyState, ErrorState, LoadingState } from '../../../shared/components';
import { formatArgentinaDateTime, getUtcTimestampTime } from '../../../shared/utils/dateTime';
import { usePaginatedGeofenceStates } from '../hooks/useGeofenceStates';
import type { GeoFenceAssetState } from '../types/geofenceState.types';
import { getGeofenceStatusUi } from '../utils/geofenceStatusUi';
import { GeofenceStatusBadge } from './GeofenceStatusBadge';

const geofenceStatesPageLimit = 4;
type PageTransitionDirection = 'next' | 'previous' | null;

function sortStates(states: GeoFenceAssetState[]) {
  return [...states].sort(
    (a, b) =>
      getUtcTimestampTime(b.last_evaluated_at) - getUtcTimestampTime(a.last_evaluated_at),
  );
}

function getStateAssetLabel(state: GeoFenceAssetState) {
  return state.asset_name || state.asset_serial;
}

export function GeofenceStatesList() {
  const [skip, setSkip] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [pageTransitionDirection, setPageTransitionDirection] = useState<PageTransitionDirection>(null);
  const { data, isLoading, isError, isFetching, error } = usePaginatedGeofenceStates({
    skip,
    limit: geofenceStatesPageLimit,
  });
  const states = data?.items ?? [];
  const sortedStates = sortStates(states);
  const totalStates = data?.total ?? 0;
  const currentSkip = data?.skip ?? skip;
  const currentLimit = data?.limit ?? geofenceStatesPageLimit;
  const currentPage = Math.floor(currentSkip / currentLimit) + 1;
  const totalPages = Math.max(1, Math.ceil(totalStates / currentLimit));
  const firstVisibleState = totalStates === 0 ? 0 : currentSkip + 1;
  const lastVisibleState = Math.min(currentSkip + states.length, totalStates);
  const shouldCenterCards = sortedStates.length < geofenceStatesPageLimit;
  const canGoPrevious = currentSkip > 0;
  const canGoNext = currentSkip + currentLimit < totalStates;
  const isPageTransitioning = pageTransitionDirection !== null;
  const pageTransitionClass = !isPageTransitioning
    ? 'translate-x-0 opacity-100'
    : pageTransitionDirection === 'next'
      ? '-translate-x-4 opacity-60'
      : 'translate-x-4 opacity-60';

  useEffect(() => {
    if (!isPageTransitioning || isFetching) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setPageTransitionDirection(null);
    }, 180);

    return () => window.clearTimeout(timeoutId);
  }, [isFetching, isPageTransitioning]);

  const goToPreviousPage = () => {
    setPageTransitionDirection('previous');
    setSkip((value) => Math.max(0, value - geofenceStatesPageLimit));
  };

  const goToNextPage = () => {
    setPageTransitionDirection('next');
    setSkip((value) => value + geofenceStatesPageLimit);
  };

  const handleTouchEnd = (clientX: number) => {
    if (touchStartX === null) {
      return;
    }

    const distance = touchStartX - clientX;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance && canGoNext && !isFetching) {
      goToNextPage();
    }

    if (distance < -minSwipeDistance && canGoPrevious && !isFetching) {
      goToPreviousPage();
    }

    setTouchStartX(null);
  };

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

  if (totalStates === 0) {
    return (
      <EmptyState
        title="Sin estados actuales"
        message="Cuando tus assets sean evaluados contra geocercas, sus estados apareceran aca."
      />
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div
        className="flex min-h-0 flex-1 flex-col space-y-2 touch-pan-y"
        onTouchEnd={(event) => handleTouchEnd(event.changedTouches[0].clientX)}
        onTouchStart={(event) => setTouchStartX(event.touches[0].clientX)}
      >
        <div className="flex items-center justify-between gap-3 px-1 text-xs font-medium text-brand-muted">
          <span>
            Mostrando {firstVisibleState}-{lastVisibleState} de {totalStates}
          </span>
          <span>
            Pagina {currentPage} de {totalPages}
          </span>
        </div>

        <div className="relative min-h-0 flex-1 overflow-hidden rounded-3xl">
          <div
            className={[
              'grid gap-3 transition duration-400 ease-out sm:grid-cols-2 xl:grid-cols-2 xl:gap-2',
              shouldCenterCards ? 'justify-items-center' : '',
              pageTransitionClass,
            ].join(' ')}
          >
            {sortedStates.map((state) => {
              const ui = getGeofenceStatusUi(state.current_status);

              return (
                <Card
                  className="w-full max-w-[34rem] space-y-2.5 p-3.5 transition hover:-translate-y-0.5 hover:shadow-md hover:shadow-brand-primary/10 xl:space-y-2 xl:p-3"
                  key={`${state.asset_id}-${state.fence_id}`}
                >
                  <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate text-base font-semibold tracking-tight text-brand-text sm:text-lg xl:text-base">
                          {getStateAssetLabel(state)}
                        </h3>
                        <GeofenceStatusBadge current_status={state.current_status} />
                      </div>
                      <p className="mt-1 text-sm leading-5 text-brand-muted xl:text-xs">
                        {ui.description}
                      </p>
                    </div>
                    <time
                      className="text-xs font-medium text-brand-muted sm:text-right"
                      dateTime={state.last_evaluated_at ?? undefined}
                    >
                      {formatArgentinaDateTime(state.last_evaluated_at)}
                    </time>
                  </div>

                  <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2 sm:text-sm xl:text-xs">
                    <div className="rounded-xl bg-brand-surfaceSoft p-2 xl:p-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">Device</p>
                      <p className="mt-0.5 truncate font-semibold text-brand-text">{state.device_serial}</p>
                    </div>
                    <div className="rounded-xl bg-brand-surfaceSoft p-2 xl:p-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">Geocerca</p>
                      <p className="mt-0.5 truncate font-semibold text-brand-text">{state.geofence_name}</p>
                      <p className="mt-0.5 text-brand-muted">Fence #{state.fence_id}</p>
                    </div>
                  </div>
                </Card>
                );
              })}
          </div>

          {isPageTransitioning ? (
            <div className="pointer-events-none absolute inset-x-0 top-3 flex justify-center xl:hidden">
              <span className="rounded-full bg-brand-primary/90 px-3 py-1 text-xs font-semibold text-white shadow-lg shadow-brand-primary/20">
                Cambiando pagina...
              </span>
            </div>
          ) : null}
        </div>
      </div>

      {totalPages > 1 ? (
        <div className="mt-auto flex min-h-11 items-center justify-between gap-2">
          <Button
            className="h-10 px-3 py-2 text-xs"
            disabled={!canGoPrevious || isFetching}
            onClick={goToPreviousPage}
            type="button"
          >
            Anterior
          </Button>
          <Button
            className="h-10 px-3 py-2 text-xs"
            disabled={!canGoNext || isFetching}
            onClick={goToNextPage}
            type="button"
          >
            Siguiente
          </Button>
        </div>
      ) : null}

      {totalPages > 1 ? (
        <p className="text-center text-xs font-medium text-brand-muted xl:hidden">
          Desliza las cards hacia la izquierda o derecha para cambiar de pagina.
        </p>
      ) : null}
    </div>
  );
}
