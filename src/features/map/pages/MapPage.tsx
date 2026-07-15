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
  const { data: geofenceStates = [] } = useGeofenceStates();
  const previousEditGeofenceIdRef = useRef<number | null>(null);
  const [isDrawingGeofence, setIsDrawingGeofence] = useState(false);
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

  function renderTrackingMap(containerClassName: string) {
    if (isLoading || isError) {
      return null;
    }

    return (
      <div className={containerClassName}>
        <Suspense fallback={<LoadingState message="Cargando mapa interactivo..." />}>
          <TrackingMap
            devices={devices}
            draftPoints={draftPoints}
            geofences={geofences}
            geofenceStates={geofenceStates}
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
      setSuccessMessage(null);
    }
  }, [editGeofenceId]);

  useEffect(() => {
    if (!editingGeofence) {
      return;
    }

    setIsDrawingGeofence(true);
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
    <section className="flex min-h-0 flex-1 flex-col gap-4 lg:gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between lg:gap-4">
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

        <div className="flex flex-col gap-2 sm:items-end">
          <div className="flex flex-wrap gap-2">
            <div className="flex flex-wrap gap-2 sm:hidden">
              <StatusBadge label={`${geofences.length} geocercas`} />
              <StatusBadge label={`${activeDevices} activos`} />
            </div>

            <div className="hidden flex-wrap gap-2 sm:flex">
              <StatusBadge label={`${totalDevices} con ubicacion`} tone="success" />
              <StatusBadge label={`${geofences.length} geocercas`} />
              <StatusBadge label={`${activeDevices} activos`} />
              <StatusBadge label={`${inactiveDevices} inactivos`} />
            </div>
          </div>

          <div className="flex justify-start sm:justify-end">
            <GeofenceDrawingControls
              is_drawing={isDrawingGeofence}
              on_cancel={handleCancelDrawing}
              on_clear={() => setDraftPoints([])}
              on_start={() => {
                setSuccessMessage(null);
                clearEditGeofenceParam();
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
        <>
          <div className="flex min-h-0 flex-1 flex-col gap-4 lg:hidden">
            {renderTrackingMap('flex min-h-0 min-w-0 flex-1 flex-col')}
            <EditGeofencePanel
              draft_points={draftPoints}
              geofence={editingGeofence}
              mode="mobile"
              on_cancel={handleCancelDrawing}
              on_updated={handleUpdatedGeofence}
            />
          </div>

          <div className="hidden min-h-0 flex-1 gap-4 lg:grid lg:grid-cols-[360px_minmax(0,1fr)] lg:items-start">
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
        </>
      ) : null}

      {isCreateGeofenceMode ? (
        <>
          <div className="flex min-h-0 flex-1 flex-col gap-4 lg:hidden">
            {renderTrackingMap('flex min-h-0 min-w-0 flex-1 flex-col')}
            <CreateGeofencePanel
              draft_points={draftPoints}
              mode="mobile"
              on_created={handleCreatedGeofence}
            />
          </div>

          <div className="hidden min-h-0 flex-1 gap-4 lg:grid lg:grid-cols-[360px_minmax(0,1fr)] lg:items-start">
            <div className="min-h-0 lg:sticky lg:top-4 lg:max-h-[calc(100dvh-12rem)] lg:overflow-y-auto lg:pr-1">
              <CreateGeofencePanel draft_points={draftPoints} on_created={handleCreatedGeofence} />
            </div>

            {renderTrackingMap('flex min-h-[34rem] min-w-0 flex-1 flex-col lg:h-[calc(100dvh-12rem)] lg:min-h-0')}
          </div>
        </>
      ) : isDrawingGeofence && editingGeofence ? null : !isLoading && !isError ? (
        renderTrackingMap('flex min-h-0 min-w-0 flex-1 flex-col')
      ) : null}
    </section>
  );
}
