import { useEffect, useState } from 'react';
import { Button, Card, EmptyState, ErrorState, LoadingState, PageHeader } from '../../../shared/components';
import { DeviceList } from '../components/DeviceList';
import { useMyDevices } from '../hooks/useMyDevices';

const devicesPageLimit = 6;
type PageTransitionDirection = 'next' | 'previous' | null;

export function DevicesPage() {
  const [skip, setSkip] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [pageTransitionDirection, setPageTransitionDirection] = useState<PageTransitionDirection>(null);
  const { data, isError, isLoading, isFetching, error } = useMyDevices({
    skip,
    limit: devicesPageLimit,
  });
  const devices = data?.items ?? [];
  const totalDevices = data?.total ?? 0;
  const currentSkip = data?.skip ?? skip;
  const currentLimit = data?.limit ?? devicesPageLimit;
  const currentPage = Math.floor(currentSkip / currentLimit) + 1;
  const totalPages = Math.max(1, Math.ceil(totalDevices / currentLimit));
  const firstVisibleDevice = totalDevices === 0 ? 0 : currentSkip + 1;
  const lastVisibleDevice = Math.min(currentSkip + devices.length, totalDevices);
  const canGoPrevious = currentSkip > 0;
  const canGoNext = currentSkip + currentLimit < totalDevices;
  const stats = data?.stats;
  const online = stats?.onlineDevices ?? 0;
  const offline = stats?.offlineDevices ?? 0;
  const activeDevices = stats?.activeDevices ?? 0;
  const inactiveDevices = stats?.inactiveDevices ?? 0;
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
    setSkip((value) => Math.max(0, value - devicesPageLimit));
  };

  const goToNextPage = () => {
    setPageTransitionDirection('next');
    setSkip((value) => value + devicesPageLimit);
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

  return (
    <section className="space-y-5 xl:space-y-3">
      <PageHeader
        title="Dispositivos"
        description="Rastreadores GPS asociados a tu client y, cuando corresponda, a un asset."
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <Card className="bg-brand-primary p-4 text-center text-white xl:p-3">
          <p className="text-xs font-medium text-brand-primary/70 xl:text-[11px]">Total devices</p>
          <p className="mt-2 text-2xl font-semibold text-brand-primary xl:text-xl">{stats?.totalDevices ?? totalDevices}</p>
        </Card>
        <Card className="bg-brand-surface p-4 text-center xl:p-3">
          <p className="text-xs font-medium text-brand-muted xl:text-[11px]">Online</p>
          <p className="mt-2 text-2xl font-semibold text-brand-success xl:text-xl">{online}</p>
        </Card>
        <Card className="p-4 text-center xl:p-3">
          <p className="text-xs font-medium text-brand-muted xl:text-[11px]">Offline</p>
          <p className="mt-2 text-2xl font-semibold text-brand-danger xl:text-xl">{offline}</p>
        </Card>
        <Card className="bg-brand-accent p-4 text-center text-brand-primary xl:p-3">
          <p className="text-xs font-medium text-brand-primary/70 xl:text-[11px]">Activos</p>
          <p className="mt-2 text-2xl font-semibold text-brand-primary xl:text-xl">{activeDevices}</p>
        </Card>
        <Card className="p-4 text-center xl:p-3">
          <p className="text-xs font-medium text-brand-muted xl:text-[11px]">Inactivos</p>
          <p className="mt-2 text-2xl font-semibold text-brand-muted xl:text-xl">{inactiveDevices}</p>
        </Card>
      </div>

      {isLoading ? <LoadingState message="Cargando dispositivos..." /> : null}

      {isError ? (
        <ErrorState
          title="No pudimos cargar los dispositivos"
          message={error instanceof Error ? error.message : 'Intentalo nuevamente.'}
        />
      ) : null}

      {!isLoading && !isError && devices.length > 0 ? (
        <>
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
                  Mostrando {firstVisibleDevice}-{lastVisibleDevice} de {totalDevices}
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
                  <DeviceList devices={devices} />
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
            Desliza las cards hacia la izquierda o derecha para cambiar de pagina.
          </p>
        </>
      ) : null}

      {!isLoading && !isError && devices.length === 0 ? (
        <EmptyState
          title="No hay devices cargados"
          message="Cuando existan rastreadores registrados, apareceran en este listado."
        />
      ) : null}
    </section>
  );
}
