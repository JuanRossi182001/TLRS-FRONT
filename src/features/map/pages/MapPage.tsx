import { PageHeader, StatusBadge } from '../../../shared/components';
import { useVisibleDevices } from '../../devices/hooks/useVisibleDevices';
import { TrackingMap } from '../components/TrackingMap';
import { useMapDevices } from '../hooks/useMapDevices';

export function MapPage() {
  const { currentUser, visibleDevices, totalVisible, online, offline } = useVisibleDevices();
  const { devicesWithLocation, totalWithLocation, totalWithoutLocation } =
    useMapDevices(visibleDevices);
  const viewTitle = currentUser.role === 'admin' ? 'Vista administrador' : 'Mis dispositivos';

  return (
    <section className="flex min-h-[calc(100dvh-9rem)] flex-1 flex-col gap-4 lg:min-h-[calc(100dvh-7rem)]">
      <PageHeader
        title="Mapa en tiempo real"
        description="Ubicaciones mock de devices con ultima location registrada, listas para conectar al backend mas adelante."
        actions={
          <div className="flex flex-wrap gap-2">
            <StatusBadge label={viewTitle} />
            <StatusBadge label={`${totalVisible} visibles`} />
            <StatusBadge label={`${online} online`} tone="success" />
            <StatusBadge label={`${offline} offline`} tone="danger" />
            <StatusBadge label={`${totalWithLocation} con ubicacion`} tone="success" />
            <StatusBadge label={`${totalWithoutLocation} sin ubicacion`} />
          </div>
        }
      />

      <TrackingMap devices={devicesWithLocation} />
    </section>
  );
}
