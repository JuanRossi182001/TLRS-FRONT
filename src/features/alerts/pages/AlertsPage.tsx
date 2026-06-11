import { useEffect, useState } from 'react';
import { Button, ErrorState, LoadingState, PageHeader, StatusBadge } from '../../../shared/components';
import { getUtcTimestampTime } from '../../../shared/utils/dateTime';
import { AlertEmptyState } from '../components/AlertEmptyState';
import { AlertEventList } from '../components/AlertEventList';
import { AlertStats } from '../components/AlertStats';
import { useMyGeofenceEvents } from '../hooks/useMyGeofenceEvents';
import type { AlertEventTypeFilter, AlertRelevanceFilter, AlertTimeFilter } from '../types/alert.types';

const alertsPageLimit = 6;
type PageTransitionDirection = 'next' | 'previous' | null;
type EventTypeFilterValue = AlertEventTypeFilter | 'all';

const timeFilterOptions: Array<{ label: string; value: AlertTimeFilter }> = [
  { label: 'Hoy', value: 'today' },
  { label: '7 dias', value: '7_days' },
  { label: 'Todo', value: 'all' },
];

const relevanceFilterOptions: Array<{ label: string; value: AlertRelevanceFilter }> = [
  { label: 'Todas', value: 'all' },
  { label: 'Importantes', value: 'important_only' },
];

const eventTypeOptions: Array<{ label: string; value: EventTypeFilterValue }> = [
  { label: 'Todos los tipos', value: 'all' },
  { label: 'Salida', value: 'EXITED' },
  { label: 'Cerca del limite', value: 'NEAR_LIMIT' },
  { label: 'Retorno', value: 'RETURNED' },
  { label: 'GPS incierto', value: 'GPS_UNCERTAIN' },
];

const importantEventTypeOptions: Array<{ label: string; value: EventTypeFilterValue }> = [
  { label: 'Todos los tipos', value: 'all' },
  { label: 'Salida', value: 'EXITED' },
  { label: 'Cerca del limite', value: 'NEAR_LIMIT' },
];

export function AlertsPage() {
  const [skip, setSkip] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [pageTransitionDirection, setPageTransitionDirection] = useState<PageTransitionDirection>(null);
  const [timeFilter, setTimeFilter] = useState<AlertTimeFilter>('today');
  const [relevanceFilter, setRelevanceFilter] = useState<AlertRelevanceFilter>('all');
  const [eventTypeFilter, setEventTypeFilter] = useState<EventTypeFilterValue>('all');
  const visibleEventTypeOptions = relevanceFilter === 'important_only'
    ? importantEventTypeOptions
    : eventTypeOptions;
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useMyGeofenceEvents({
    skip,
    limit: alertsPageLimit,
    time_filter: timeFilter,
    relevance_filter: relevanceFilter,
    event_type: eventTypeFilter === 'all' ? undefined : eventTypeFilter,
  });

  const events = data?.items ?? [];
  const stats = data?.stats;
  const totalEvents = data?.total ?? 0;
  const currentSkip = data?.skip ?? skip;
  const currentLimit = data?.limit ?? alertsPageLimit;
  const currentPage = Math.floor(currentSkip / currentLimit) + 1;
  const totalPages = Math.max(1, Math.ceil(totalEvents / currentLimit));
  const firstVisibleEventIndex = totalEvents === 0 ? 0 : currentSkip + 1;
  const lastVisibleEventIndex = Math.min(currentSkip + events.length, totalEvents);
  const canGoPrevious = currentSkip > 0;
  const canGoNext = currentSkip + currentLimit < totalEvents;
  const sortedEvents = [...events].sort(
    (a, b) => getUtcTimestampTime(b.created_at) - getUtcTimestampTime(a.created_at),
  );
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

  useEffect(() => {
    if (relevanceFilter !== 'important_only') {
      return;
    }

    if (eventTypeFilter === 'RETURNED' || eventTypeFilter === 'GPS_UNCERTAIN') {
      setEventTypeFilter('all');
      setSkip(0);
      setPageTransitionDirection(null);
    }
  }, [eventTypeFilter, relevanceFilter]);

  const goToPreviousPage = () => {
    setPageTransitionDirection('previous');
    setSkip((value) => Math.max(0, value - currentLimit));
  };

  const goToNextPage = () => {
    setPageTransitionDirection('next');
    setSkip((value) => value + currentLimit);
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

  const handleTimeFilterChange = (value: AlertTimeFilter) => {
    setTimeFilter(value);
    setSkip(0);
    setPageTransitionDirection(null);
  };

  const handleRelevanceFilterChange = (value: AlertRelevanceFilter) => {
    setRelevanceFilter(value);
    setSkip(0);
    setPageTransitionDirection(null);
  };

  const handleEventTypeFilterChange = (value: EventTypeFilterValue) => {
    setEventTypeFilter(value);
    setSkip(0);
    setPageTransitionDirection(null);
  };

  return (
    <section className="space-y-5 xl:space-y-3">
      <PageHeader
        title={(
          <span className="flex items-center gap-2">
            <span>Alertas</span>
            <span className="group relative inline-flex">
              <button
                aria-label="Explicacion de los tipos de alerta"
                className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-brand-border/70 bg-white text-xs font-semibold text-brand-muted transition hover:border-brand-primary hover:text-brand-primary focus:border-brand-primary focus:text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/15"
                type="button"
              >
                i
              </button>
              <span className="pointer-events-none absolute left-0 top-8 z-10 w-72 rounded-2xl bg-brand-text px-3 py-3 text-[11px] font-medium leading-4 text-white opacity-0 shadow-lg shadow-brand-text/15 transition group-hover:opacity-100 group-focus-within:opacity-100 sm:w-80">
                <span className="block">Salida: el dispositivo salio de la geocerca.</span>
                <span className="mt-1 block">Cerca del limite: el dispositivo esta proximo al borde.</span>
                <span className="mt-1 block">Retorno: el dispositivo regreso a la geocerca.</span>
                <span className="mt-1 block">GPS incierto: la precision GPS no es confiable.</span>
                <span className="mt-1 block">Entrada: el dispositivo ingreso a la geocerca.</span>
              </span>
            </span>
          </span>
        )}
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

      <div className="grid gap-3 rounded-3xl border border-brand-border/60 bg-brand-surface p-4 shadow-sm shadow-brand-primary/5 xl:grid-cols-[1fr_1fr_16rem] xl:items-end xl:gap-4 xl:p-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">Periodo</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {timeFilterOptions.map((option) => (
              <Button
                className="px-3 py-1.5 text-xs"
                key={option.value}
                onClick={() => handleTimeFilterChange(option.value)}
                variant={timeFilter === option.value ? 'primary' : 'secondary'}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">Relevancia</p>
            <div className="group relative">
              <button
                aria-label="Explicacion del filtro importantes"
                className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-brand-border/70 bg-white text-[11px] font-semibold text-brand-muted transition hover:border-brand-primary hover:text-brand-primary focus:border-brand-primary focus:text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/15"
                type="button"
              >
                i
              </button>
              <div className="pointer-events-none absolute left-0 top-7 z-10 w-56 rounded-2xl bg-brand-text px-3 py-2 text-[11px] font-medium leading-4 text-white opacity-0 shadow-lg shadow-brand-text/15 transition group-hover:opacity-100 group-focus-within:opacity-100">
                Importantes muestra solo las alertas de salida y cerca del limite.
              </div>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {relevanceFilterOptions.map((option) => (
              <Button
                className="px-3 py-1.5 text-xs"
                key={option.value}
                onClick={() => handleRelevanceFilterChange(option.value)}
                variant={relevanceFilter === option.value ? 'primary' : 'secondary'}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        <label className="text-sm font-semibold text-brand-text" htmlFor="alerts-event-type-filter">
          Tipo de evento
          <select
            className="mt-2 w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-text outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
            id="alerts-event-type-filter"
            onChange={(event) => handleEventTypeFilterChange(event.target.value as EventTypeFilterValue)}
            value={eventTypeFilter}
          >
            {visibleEventTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {isLoading ? <LoadingState message="Cargando eventos de geocercas..." /> : null}

      {isError ? (
        <ErrorState
          title="No pudimos cargar las alertas"
          message={error instanceof Error ? error.message : 'Intentalo nuevamente.'}
        />
      ) : null}

      {!isLoading && !isError && totalEvents === 0 ? <AlertEmptyState /> : null}

      {!isLoading && !isError && totalEvents > 0 ? (
        <>
          {stats ? <AlertStats relevanceFilter={relevanceFilter} stats={stats} /> : null}

          <div className="grid items-center gap-3 xl:grid-cols-[3rem_1fr_3rem]">
            <Button
              aria-label="Pagina anterior"
              className="hidden h-24 w-12 rounded-2xl px-0 text-2xl xl:inline-flex"
              disabled={!canGoPrevious || isFetching}
              onClick={goToPreviousPage}
              variant="primary"
            >
              {'<'}
            </Button>

            <div
              className="space-y-2 touch-pan-y"
              onTouchEnd={(event) => handleTouchEnd(event.changedTouches[0].clientX)}
              onTouchStart={(event) => setTouchStartX(event.touches[0].clientX)}
            >
              <div className="flex items-center justify-between gap-3 px-1 text-xs font-medium text-brand-muted">
                <span>
                  Mostrando {firstVisibleEventIndex}-{lastVisibleEventIndex} de {totalEvents}
                </span>
                <span>
                  Pagina {currentPage} de {totalPages}
                </span>
              </div>

              <div className="relative overflow-hidden rounded-3xl">
                <div
                  className={[
                    'transition duration-400 ease-out',
                    pageTransitionClass,
                  ].join(' ')}
                >
                  <AlertEventList events={sortedEvents} />
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

            <Button
              aria-label="Pagina siguiente"
              className="hidden h-24 w-12 rounded-2xl px-0 text-2xl xl:inline-flex"
              disabled={!canGoNext || isFetching}
              onClick={goToNextPage}
            >
              {'>'}
            </Button>
          </div>

          <p className="text-center text-xs font-medium text-brand-muted xl:hidden">
            Desliza las alertas hacia la izquierda o derecha para cambiar de pagina.
          </p>
        </>
      ) : null}
    </section>
  );
}
