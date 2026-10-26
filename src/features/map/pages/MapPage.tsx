import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ErrorState, LoadingState, StatusBadge } from '../../../shared/components';
import { CreateGeofencePanel } from '../../geofences/components/CreateGeofencePanel';
import { EditGeofencePanel } from '../../geofences/components/EditGeofencePanel';
import { GeofenceDrawingControls } from '../../geofences/components/GeofenceDrawingControls';
import { useGeofenceStates } from '../../geofences/hooks/useGeofenceStates';
import { useMyGeofences } from '../../geofences/hooks/useMyGeofences';
import type { Position } from '../../geofences/types/geofence.types';
import { getDraftPointsFromShape } from '../../geofences/utils/geofenceShape';
import { MapGeofenceActivationControl } from '../components/MapGeofenceActivationControl';
import { useMyDevicesLatestLocations } from '../hooks/useMyDevicesLatestLocations';

const TrackingMap = lazy(async () => {
  const module = await import('../components/TrackingMap');
  return { default: module.TrackingMap };
});

export function MapPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: devices = [], isError, isLoading, error } = useMyDevicesLatestLocations();
  const {
    data: geofences = [],
    isError: isGeofencesError,
    isLoading: isGeofencesLoading,
    error: geofencesError,
  } = useMyGeofences();
  const { data: geofenceStates = [] } = useGeofenceStates({ refetch_interval: false });
  const previousEditGeofenceIdRef = useRef<number | null>(null);
  const [isDrawingGeofence, setIsDrawingGeofence] = useState(false);
  const [isCompletingNewGeofence, setIsCompletingNewGeofence] = useState(false);
  const [isEditingGeofenceDetails, setIsEditingGeofenceDetails] = useState(false);
  const [isGeofenceActivationOpen, setIsGeofenceActivationOpen] = useState(false);
  const [draftPoints, setDraftPoints] = useState<Position[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const editGeofenceId = Number(searchParams.get('editGeofence')) || null;
  const editingGeofence = editGeofenceId
    ? geofences.find((geofence) => geofence.id_geofence === editGeofenceId)
    : undefined;
  const totalDevices = devices.length;
  const activeDevices = devices.filter((device) => device.active).length;
  const inactiveDevices = devices.filter((device) => !device.active).length;
  const isCreateGeofenceMode = isDrawingGeofence && !editingGeofence;

  function renderTrackingMap(containerClassName: string, isMobileLayout = false) {
    if (isLoading || isError) {
      return null;
    }

    return (
      <div className={containerClassName}>
        <Suspense fallback={<LoadingState message="Cargando mapa interactivo..." />}>
          <TrackingMap
            devices={devices}
            draftPoints={draftPoints}
            editingGeofenceId={editingGeofence?.id_geofence}
            geofences={geofences}
            geofenceStates={geofenceStates}
            isMobileLayout={isMobileLayout}
            isDrawingGeofence={isDrawingGeofence}
            onAddDraftPoint={(point) => setDraftPoints((currentPoints) => [...currentPoints, point])}
            onMoveDraftPoint={(index, point) =>
              setDraftPoints((currentPoints) =>
                currentPoints.map((currentPoint, currentIndex) =>
                  currentIndex === index ? point : currentPoint,
                ),
              )
            }
            onRemoveDraftPoint={(index) =>
              setDraftPoints((currentPoints) =>
                currentPoints.filter((_, currentIndex) => currentIndex !== index),
              )
            }
          />
        </Suspense>
      </div>
    );
  }

  useEffect(() => {
    const previousEditGeofenceId = previousEditGeofenceIdRef.current;
    previousEditGeofenceIdRef.current = editGeofenceId;

    if (previousEditGeofenceId && !editGeofenceId) {
      setIsDrawingGeofence(false);
      setDraftPoints([]);
      setIsEditingGeofenceDetails(false);
      setSuccessMessage(null);
    }
  }, [editGeofenceId]);

  useEffect(() => {
    if (!editingGeofence) {
      return;
    }

    setIsDrawingGeofence(true);
    setIsEditingGeofenceDetails(false);
    setIsGeofenceActivationOpen(false);
    setDraftPoints(getDraftPointsFromShape(editingGeofence.shape));
    setSuccessMessage(null);
  }, [editingGeofence?.id_geofence]);

  function clearEditGeofenceParam() {
    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams);
      nextParams.delete('editGeofence');
      return nextParams;
    });
  }

  function handleCancelDrawing() {
    setIsDrawingGeofence(false);
    setIsCompletingNewGeofence(false);
    setIsEditingGeofenceDetails(false);
    setDraftPoints([]);
    clearEditGeofenceParam();
  }

  function handleCreatedGeofence() {
    setSuccessMessage('Geocerca creada correctamente.');
    handleCancelDrawing();
  }

  function handleUpdatedGeofence() {
    setSuccessMessage('Geocerca actualizada correctamente.');
    handleCancelDrawing();
  }

  return (
    <section className="fixed inset-0 z-0 min-w-0 lg:relative lg:flex lg:min-h-0 lg:flex-1 lg:flex-col lg:gap-5">
      <div className="absolute inset-0 lg:hidden">
        {!isLoading && !isError ? renderTrackingMap('flex h-full w-full flex-col', true) : null}

        <div className="pointer-events-none absolute inset-x-0 top-[calc(var(--app-header-height)+0.75rem)] z-10 px-4">
          <div className="flex items-start justify-between gap-2">
            <div className="pointer-events-auto rounded-2xl border border-brand-border/70 bg-brand-surface/90 px-3 py-2 shadow-lg shadow-brand-primary/10 backdrop-blur-xl">
              <h1 className="text-sm font-semibold text-brand-text">
                {editingGeofence ? 'Editar geocerca' : isDrawingGeofence ? 'Nueva geocerca' : 'Mapa en tiempo real'}
              </h1>
              {!isDrawingGeofence ? (
                <div className="mt-1 flex flex-wrap gap-1.5">
                  <StatusBadge label={`${geofences.length} geocercas`} />
                  <StatusBadge label={`${activeDevices} activos`} tone="success" />
                </div>
              ) : null}
            </div>

            <div className="pointer-events-auto flex max-w-[62%] justify-end">
              <div className="flex flex-wrap justify-end gap-2">
                {!isDrawingGeofence ? (
                  <MapGeofenceActivationControl
                    geofences={geofences}
                    isOpen={isGeofenceActivationOpen}
                    onOpenChange={setIsGeofenceActivationOpen}
                  />
                ) : null}
                <GeofenceDrawingControls
                  is_drawing={isDrawingGeofence}
                  on_cancel={handleCancelDrawing}
                  on_clear={() => {
                    setDraftPoints([]);
                    setIsCompletingNewGeofence(false);
                    setIsEditingGeofenceDetails(false);
                  }}
                  continue_label={editingGeofence ? 'Editar datos' : 'Continuar'}
                  on_continue={
                    isCreateGeofenceMode
                      ? () => setIsCompletingNewGeofence(true)
                      : editingGeofence
                      ? () => setIsEditingGeofenceDetails(true)
                      : undefined
                  }
                  on_start={() => {
                    setSuccessMessage(null);
                    clearEditGeofenceParam();
                    setIsGeofenceActivationOpen(false);
                    setIsCompletingNewGeofence(false);
                    setIsEditingGeofenceDetails(false);
                    setIsDrawingGeofence(true);
                  }}
                  points_count={draftPoints.length}
                />
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-brand-surface/90 px-4">
            <LoadingState message="Cargando ubicaciones..." />
          </div>
        ) : null}

        {isError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-brand-surface/90 px-4">
            <ErrorState
              title="No pudimos cargar el mapa"
              message={error instanceof Error ? error.message : 'Intentalo nuevamente.'}
            />
          </div>
        ) : null}

        {isGeofencesError ? (
          <div className="absolute inset-x-4 top-[calc(var(--app-header-height)+5.75rem)] z-10">
            <ErrorState
              title="No pudimos cargar las geocercas"
              message={geofencesError instanceof Error ? geofencesError.message : 'El mapa sigue disponible.'}
            />
          </div>
        ) : null}

        {successMessage ? (
          <div className="absolute inset-x-4 top-[calc(var(--app-header-height)+5.75rem)] z-10 rounded-3xl border border-emerald-200 bg-emerald-50/95 px-5 py-4 text-sm font-semibold text-brand-success shadow-lg shadow-brand-primary/10 backdrop-blur-xl">
            {successMessage}
          </div>
        ) : null}

        {editGeofenceId && !editingGeofence && !isGeofencesLoading && !isGeofencesError ? (
          <div className="absolute inset-x-4 top-[calc(var(--app-header-height)+5.75rem)] z-10">
            <ErrorState
              title="No pudimos encontrar la geocerca"
              message="Revisa que la geocerca exista y vuelve a intentarlo desde Geocercas."
            />
          </div>
        ) : null}

        {isDrawingGeofence && editingGeofence && isEditingGeofenceDetails ? (
          <div className="absolute inset-x-0 bottom-[var(--mobile-nav-clearance)] z-20 max-h-[calc(100dvh-var(--app-header-height)-var(--mobile-nav-clearance)-6rem)] overflow-y-auto px-4 pb-3">
            <EditGeofencePanel
              draft_points={draftPoints}
              geofence={editingGeofence}
              mode="mobile"
              on_cancel={handleCancelDrawing}
              on_updated={handleUpdatedGeofence}
            />
          </div>
        ) : null}

        {isCreateGeofenceMode && isCompletingNewGeofence ? (
          <div className="absolute inset-x-0 bottom-[var(--mobile-nav-clearance)] z-20 max-h-[calc(100dvh-var(--app-header-height)-var(--mobile-nav-clearance)-6rem)] overflow-y-auto px-4 pb-3">
            <CreateGeofencePanel
              draft_points={draftPoints}
              mode="mobile"
              on_created={handleCreatedGeofence}
            />
          </div>
        ) : null}
      </div>

      <div className="hidden min-h-0 flex-1 flex-col gap-5 lg:flex">
        <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-brand-text sm:text-3xl">
            {editingGeofence ? 'Editar geocerca' : 'Mapa en tiempo real'}
          </h1>
          <p className="hidden max-w-2xl text-sm leading-6 text-brand-muted sm:block">
            {editingGeofence
              ? 'Redibuja la geocerca desde el mapa y guarda los cambios.'
              : isDrawingGeofence
              ? 'Hace click en el mapa para agregar vertices de la geocerca.'
              : 'Ultimas ubicaciones reportadas por tus dispositivos GPS.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:items-end">
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            <div className="flex flex-wrap gap-2">
              <StatusBadge label={`${totalDevices} con ubicacion`} tone="success" />
              <StatusBadge label={`${geofences.length} geocercas`} />
              <StatusBadge label={`${activeDevices} activos`} />
              <StatusBadge label={`${inactiveDevices} inactivos`} />
            </div>
          </div>

          <div className="flex flex-wrap justify-start gap-2 sm:justify-end">
            {!isDrawingGeofence ? (
              <MapGeofenceActivationControl
                geofences={geofences}
                isOpen={isGeofenceActivationOpen}
                onOpenChange={setIsGeofenceActivationOpen}
              />
            ) : null}
            <GeofenceDrawingControls
              is_drawing={isDrawingGeofence}
              on_cancel={handleCancelDrawing}
              on_clear={() => setDraftPoints([])}
              on_start={() => {
                setSuccessMessage(null);
                clearEditGeofenceParam();
                setIsGeofenceActivationOpen(false);
                setIsDrawingGeofence(true);
              }}
              points_count={draftPoints.length}
            />
          </div>
        </div>
      </div>

        {isLoading ? <LoadingState message="Cargando ubicaciones..." /> : null}

        {isError ? (
        <ErrorState
          title="No pudimos cargar el mapa"
          message={error instanceof Error ? error.message : 'Intentalo nuevamente.'}
        />
        ) : null}

        {isGeofencesError ? (
        <ErrorState
          title="No pudimos cargar las geocercas"
          message={geofencesError instanceof Error ? geofencesError.message : 'El mapa sigue disponible.'}
        />
        ) : null}

        {successMessage ? (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-brand-success">
          {successMessage}
        </div>
        ) : null}

        {editGeofenceId && !editingGeofence && !isGeofencesLoading && !isGeofencesError ? (
        <ErrorState
          title="No pudimos encontrar la geocerca"
          message="Revisa que la geocerca exista y vuelve a intentarlo desde Geocercas."
        />
        ) : null}

        {isDrawingGeofence && editingGeofence ? (
          <div className="min-h-0 flex-1 gap-4 lg:grid lg:grid-cols-[360px_minmax(0,1fr)] lg:items-start">
            <div className="min-h-0 lg:sticky lg:top-4 lg:max-h-[calc(100dvh-12rem)] lg:overflow-y-auto lg:pr-1">
              <EditGeofencePanel
                draft_points={draftPoints}
                geofence={editingGeofence}
                mode="desktop"
                on_cancel={handleCancelDrawing}
                on_updated={handleUpdatedGeofence}
              />
            </div>

            {renderTrackingMap('flex min-h-[34rem] min-w-0 flex-1 flex-col lg:h-[calc(100dvh-12rem)] lg:min-h-0')}
          </div>
      ) : null}

        {isCreateGeofenceMode ? (
          <div className="min-h-0 flex-1 gap-4 lg:grid lg:grid-cols-[360px_minmax(0,1fr)] lg:items-start">
            <div className="min-h-0 lg:sticky lg:top-4 lg:max-h-[calc(100dvh-12rem)] lg:overflow-y-auto lg:pr-1">
              <CreateGeofencePanel draft_points={draftPoints} on_created={handleCreatedGeofence} />
            </div>

            {renderTrackingMap('flex min-h-[34rem] min-w-0 flex-1 flex-col lg:h-[calc(100dvh-12rem)] lg:min-h-0')}
          </div>
        ) : isDrawingGeofence && editingGeofence ? null : !isLoading && !isError ? (
        renderTrackingMap('flex min-h-0 min-w-0 flex-1 flex-col')
        ) : null}
      </div>
    </section>
  );
}
