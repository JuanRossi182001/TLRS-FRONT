import { ErrorState, LoadingState, PageHeader, StatusBadge } from '../../../shared/components';
import { TrackingMap } from '../components/TrackingMap';
import { MapEmptyState } from '../components/MapEmptyState';
import { useMyDevicesLatestLocations } from '../hooks/useMyDevicesLatestLocations';

export function MapPage() {
  const { data: devices = [], isError, isLoading, error } = useMyDevicesLatestLocations();
  const totalDevices = devices.length;
  const activeDevices = devices.filter((device) => device.active).length;
  const inactiveDevices = devices.filter((device) => !device.active).length;

  return (
    <section className="flex min-h-[calc(100dvh-9rem)] flex-1 flex-col gap-6 lg:min-h-[calc(100dvh-7rem)]">
      <PageHeader
        title="Mapa en tiempo real"
        description="Ultimas ubicaciones reportadas por tus dispositivos GPS."
        actions={
          <div className="flex flex-wrap gap-2">
            <StatusBadge label={`${totalDevices} con ubicacion`} tone="success" />
            <StatusBadge label={`${activeDevices} activos`} />
            <StatusBadge label={`${inactiveDevices} inactivos`} />
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

      {!isLoading && !isError && devices.length === 0 ? <MapEmptyState /> : null}

      {!isLoading && !isError && devices.length > 0 ? <TrackingMap devices={devices} /> : null}
    </section>
  );
}
