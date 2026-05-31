import { useState } from 'react';
import { ErrorState, LoadingState, PageHeader, StatusBadge } from '../../../shared/components';
import { CreateGeofencePanel } from '../../geofences/components/CreateGeofencePanel';
import { GeofenceDrawingControls } from '../../geofences/components/GeofenceDrawingControls';
import { useGeofenceAssignableDevices } from '../../geofences/hooks/useGeofenceAssignableDevices';
import { useMyGeofences } from '../../geofences/hooks/useMyGeofences';
import type { Position } from '../../geofences/types/geofence.types';
import { TrackingMap } from '../components/TrackingMap';
import { useMyDevicesLatestLocations } from '../hooks/useMyDevicesLatestLocations';

export function MapPage() {
  const { data: devices = [], isError, isLoading, error } = useMyDevicesLatestLocations();
  const { data: geofences = [], isError: isGeofencesError, error: geofencesError } = useMyGeofences();
  const { data: assignableDevices = [] } = useGeofenceAssignableDevices();
  const [isDrawingGeofence, setIsDrawingGeofence] = useState(false);
  const [draftPoints, setDraftPoints] = useState<Position[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const totalDevices = devices.length;
  const activeDevices = devices.filter((device) => device.active).length;
  const inactiveDevices = devices.filter((device) => !device.active).length;

  function handleCancelDrawing() {
    setIsDrawingGeofence(false);
    setDraftPoints([]);
  }

  function handleCreatedGeofence() {
    setSuccessMessage('Geocerca creada correctamente.');
    handleCancelDrawing();
  }

  return (
    <section className="flex min-h-[calc(100dvh-9rem)] flex-1 flex-col gap-6 lg:min-h-[calc(100dvh-7rem)]">
      <PageHeader
        title="Mapa en tiempo real"
        description={
          isDrawingGeofence
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

      {isDrawingGeofence ? (
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
