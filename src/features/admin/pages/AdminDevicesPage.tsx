import { Button, EmptyState, ErrorState, LoadingState, StatusBadge } from '../../../shared/components';
import { GeofenceStatusBadge } from '../../geofences/components/GeofenceStatusBadge';
import { AdminPageHeader } from '../components/AdminPageHeader';
import { AdminTablePlaceholder } from '../components/AdminTablePlaceholder';
import { useAdminDevices, useDeactivateAdminDevice } from '../hooks/useAdminDevices';
import type { AdminDeviceListItem } from '../types/admin.types';

export function AdminDevicesPage() {
  const { data: devices = [], isLoading, isError, error } = useAdminDevices();
  const deactivateDevice = useDeactivateAdminDevice();

  if (isLoading) {
    return <LoadingState message="Cargando dispositivos admin..." />;
  }

  if (isError) {
    return (
      <ErrorState
        title="No pudimos cargar los dispositivos"
        message={error instanceof Error ? error.message : 'Revisa la conexion con el backend.'}
      />
    );
  }

  return (
    <section className="space-y-6">
      <AdminPageHeader
        title="Gestion de dispositivos"
        description="Administra todos los dispositivos de la plataforma."
      />

      {devices.length === 0 ? (
        <EmptyState
          title="No hay dispositivos"
          message="Cuando existan dispositivos cargados, van a aparecer en esta tabla."
        />
      ) : (
        <AdminTablePlaceholder<AdminDeviceListItem>
        rows={devices}
        getRowId={(device) => device.id_device}
        columns={[
          { key: 'id_device', label: 'ID' },
          { key: 'serial', label: 'Serial' },
          { key: 'name', label: 'Nombre' },
          { key: 'client_name', label: 'Cliente' },
          { key: 'asset_name', label: 'Asset' },
          {
            key: 'active',
            label: 'Activo',
            render: (device) => (
              <StatusBadge
                label={device.active ? 'Activo' : 'Inactivo'}
                tone={device.active ? 'success' : 'default'}
              />
            ),
          },
          { key: 'state', label: 'Estado' },
          {
            key: 'status',
            label: 'Geocerca',
            render: (device) => <GeofenceStatusBadge current_status={device.status} />,
          },
        ]}
        renderActions={(device) => (
          <div className="flex flex-wrap gap-2">
            <Button
              className="px-3 py-1.5 text-xs"
              disabled
              variant="secondary"
            >
              Ver
            </Button>
            <Button
              className="px-3 py-1.5 text-xs"
              disabled
              variant="secondary"
            >
              Editar
            </Button>
            <Button
              className="px-3 py-1.5 text-xs"
              disabled={!device.active || deactivateDevice.isPending}
              onClick={() => deactivateDevice.mutate(device.id_device)}
            >
              Desactivar
            </Button>
          </div>
        )}
        note="La desactivacion ya usa el endpoint admin. Ver y editar quedan preparados para una proxima etapa."
      />
      )}
    </section>
  );
}
