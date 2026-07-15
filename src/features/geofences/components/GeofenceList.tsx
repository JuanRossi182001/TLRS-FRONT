import { useEffect, useMemo, useState } from 'react';
import { Button } from '../../../shared/components';
import type { GeoFenceRead } from '../types/geofence.types';
import { GeofenceCard } from './GeofenceCard';

type GeofenceListProps = {
  geofences: GeoFenceRead[];
};

const geofencesPerPage = 2;
type PageTransitionDirection = 'next' | 'previous' | null;

export function GeofenceList({ geofences }: GeofenceListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [pageTransitionDirection, setPageTransitionDirection] = useState<PageTransitionDirection>(null);
  const totalPages = Math.max(1, Math.ceil(geofences.length / geofencesPerPage));
  const clampedCurrentPage = Math.min(currentPage, totalPages);
  const visibleGeofences = useMemo(() => {
    const start = (clampedCurrentPage - 1) * geofencesPerPage;
    return geofences.slice(start, start + geofencesPerPage);
  }, [clampedCurrentPage, geofences]);
  const firstVisibleGeofence = geofences.length === 0 ? 0 : (clampedCurrentPage - 1) * geofencesPerPage + 1;
  const lastVisibleGeofence = Math.min(clampedCurrentPage * geofencesPerPage, geofences.length);
  const canGoPrevious = clampedCurrentPage > 1;
  const canGoNext = clampedCurrentPage < totalPages;
  const isPageTransitioning = pageTransitionDirection !== null;
  const pageTransitionClass = !isPageTransitioning
    ? 'translate-x-0 opacity-100'
    : pageTransitionDirection === 'next'
      ? '-translate-x-4 opacity-60'
      : 'translate-x-4 opacity-60';

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  useEffect(() => {
    if (!isPageTransitioning) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setPageTransitionDirection(null);
    }, 180);

    return () => window.clearTimeout(timeoutId);
  }, [isPageTransitioning]);

  const goToPreviousPage = () => {
    setPageTransitionDirection('previous');
    setCurrentPage((page) => Math.max(1, page - 1));
  };

  const goToNextPage = () => {
    setPageTransitionDirection('next');
    setCurrentPage((page) => Math.min(totalPages, page + 1));
  };

  const handleTouchEnd = (clientX: number) => {
    if (touchStartX === null) {
      return;
    }

    const distance = touchStartX - clientX;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance && canGoNext) {
      goToNextPage();
    }

    if (distance < -minSwipeDistance && canGoPrevious) {
      goToPreviousPage();
    }

    setTouchStartX(null);
  };

  return (
    <div className="flex h-full min-h-0 flex-col space-y-2 xl:space-y-1.5">
      <div className="flex items-center justify-between gap-3 px-1 text-xs font-medium text-brand-muted">
        <span>
          Mostrando {firstVisibleGeofence}-{lastVisibleGeofence} de {geofences.length}
        </span>
        <span>
          Pagina {clampedCurrentPage} de {totalPages}
        </span>
      </div>

      <div
        className="flex min-h-0 flex-1 flex-col space-y-2 touch-pan-y"
        onTouchEnd={(event) => handleTouchEnd(event.changedTouches[0].clientX)}
        onTouchStart={(event) => setTouchStartX(event.touches[0].clientX)}
      >
        <div className="relative min-h-0 flex-1 overflow-hidden rounded-3xl">
          <div
            className={[
              'grid gap-3 transition duration-400 ease-out sm:grid-cols-2 xl:grid-cols-1 xl:gap-2',
              pageTransitionClass,
            ].join(' ')}
          >
            {visibleGeofences.map((geofence) => (
              <GeofenceCard geofence={geofence} key={geofence.id_geofence} />
            ))}
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
            disabled={!canGoPrevious}
            onClick={goToPreviousPage}
            type="button"
          >
            Anterior
          </Button>
          <Button
            className="h-10 px-3 py-2 text-xs"
            disabled={!canGoNext}
            onClick={goToNextPage}
            type="button"
          >
            Siguiente
          </Button>
        </div>
      ) : null}

      {totalPages > 1 ? (
        <p className="text-center text-xs font-medium text-brand-muted xl:hidden">
          Desliza las geocercas hacia la izquierda o derecha para cambiar de pagina.
        </p>
      ) : null}
    </div>
  );
}
