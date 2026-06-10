import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ErrorState, LoadingState, PageHeader, StatusBadge } from '../../../shared/components';
import { CreateGeofencePanel } from '../../geofences/components/CreateGeofencePanel';
import { EditGeofencePanel } from '../../geofences/components/EditGeofencePanel';
import { GeofenceDrawingControls } from '../../geofences/components/GeofenceDrawingControls';
import { useGeofenceAssignableDevices } from '../../geofences/hooks/useGeofenceAssignableDevices';
import { useGeofenceStates } from '../../geofences/hooks/useGeofenceStates';
import { useMyGeofences } from '../../geofences/hooks/useMyGeofences';
import type { Position } from '../../geofences/types/geofence.types';
import { getDraftPointsFromShape } from '../../geofences/utils/geofenceShape';
import { TrackingMap } from '../components/TrackingMap';
import { useMyDevicesLatestLocations } from '../hooks/useMyDevicesLatestLocations';

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
  const { data: assignableDevices = [] } = useGeofenceAssignableDevices();
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
      <PageHeader
        title={editingGeofence ? 'Editar geocerca' : 'Mapa en tiempo real'}
        description={
          editingGeofence
            ? 'Redibuja la geocerca desde el mapa y guarda los cambios.'
            : isDrawingGeofence
            ? 'Hace click en el mapa para agregar vertices de la geocerca.'
            : 'Ultimas ubicaciones reportadas por tus dispositivos GPS.'
        }
        actions={
          <div className="flex flex-wrap gap-2">
            <StatusBadge label={`${totalDevices} con ubicacion`} tone="success" />
            <StatusBadge label={`${geofences.length} geocercas`} />
            <StatusBadge label={`${activeDevices} activos`} />
            <StatusBadge label={`${inactiveDevices} inactivos`} />
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
        }
      />

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
        <EditGeofencePanel
          draft_points={draftPoints}
          geofence={editingGeofence}
          on_cancel={handleCancelDrawing}
          on_updated={handleUpdatedGeofence}
        />
      ) : null}

      {isDrawingGeofence && !editingGeofence ? (
        <CreateGeofencePanel
          devices={assignableDevices}
          draft_points={draftPoints}
          on_created={handleCreatedGeofence}
        />
      ) : null}

      {!isLoading && !isError ? (
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
      ) : null}
    </section>
  );
}
