import { useDeferredValue, useState } from 'react';
import { Button, EmptyState, ErrorState, LoadingState, StatusBadge } from '../../../shared/components';
import { GeofenceStatusBadge } from '../../geofences/components/GeofenceStatusBadge';
import { CreateAssetPanel } from '../components/CreateAssetPanel';
import { ReassignAssetDialog, ReleaseAssetDialog } from '../components/DeviceAssetDialogs';
import { AdminPageHeader } from '../components/AdminPageHeader';
import { AdminTablePlaceholder } from '../components/AdminTablePlaceholder';
import { ProvisionDevicePanel } from '../components/ProvisionDevicePanel';
import { useAdminClients } from '../hooks/useAdminClients';
import { useAdminDevices, useReassignDeviceAsset, useReleaseDeviceAsset } from '../hooks/useAdminDevices';
import type { AdminDeviceListItem } from '../types/admin.types';

export function AdminDevicesPage() {
  const { data: devices = [], isLoading, isError, error } = useAdminDevices();
  const clients = useAdminClients();
  const reassignAsset = useReassignDeviceAsset();
  const releaseAsset = useReleaseDeviceAsset();
  const [search, setSearch] = useState('');
  const [reassigningDevice, setReassigningDevice] = useState<AdminDeviceListItem | null>(null);
  const [releasingDevice, setReleasingDevice] = useState<AdminDeviceListItem | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const deferredSearch = useDeferredValue(search);
  const normalizedSearch = deferredSearch.trim().toLowerCase();
  const filteredDevices = normalizedSearch
    ? devices.filter((device) =>
        [device.serial, device.name, device.client_name, device.asset_name]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(normalizedSearch),
      )
    : devices;

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
    <section className="space-y-4 lg:space-y-6">
      <AdminPageHeader
        title="Gestion de dispositivos"
        description="Provisiona dispositivos ChirpStack y administra la asignacion de activos."
      />

      {clients.isLoading ? <LoadingState message="Cargando clientes para provisioning..." /> : null}
      {clients.isError ? (
        <ErrorState
          title="No pudimos cargar los clientes"
          message={clients.error instanceof Error ? clients.error.message : 'Revisa la conexion con el backend.'}
        />
      ) : null}
      {!clients.isLoading && !clients.isError ? (
        <div className="grid gap-3 lg:gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(18rem,0.7fr)] xl:gap-6">
          <ProvisionDevicePanel clients={clients.data ?? []} />
          <CreateAssetPanel clients={clients.data ?? []} />
        </div>
      ) : null}

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-brand-text">Dispositivos</h2>
          <p className="mt-1 text-sm text-brand-muted">{filteredDevices.length} de {devices.length} dispositivos</p>
        </div>
        <label className="w-full sm:w-80">
          <span className="sr-only">Buscar dispositivos</span>
          <input
            className="min-h-10 w-full rounded-2xl border border-brand-border bg-white px-3 py-2 text-sm outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por serial, nombre, cliente o activo"
            value={search}
          />
        </label>
      </div>

      {actionMessage ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{actionMessage}</p> : null}

      {devices.length === 0 ? (
        <EmptyState
          title="No hay dispositivos"
          message="Cuando existan dispositivos cargados, van a aparecer en esta tabla."
        />
      ) : filteredDevices.length === 0 ? (
        <EmptyState
          title="No encontramos dispositivos"
          message="Prueba con otro serial, nombre, cliente o activo."
        />
      ) : (
        <AdminTablePlaceholder<AdminDeviceListItem>
        rows={filteredDevices}
        getRowId={(device) => device.id_device}
        columns={[
          { key: 'id_device', label: 'ID' },
          { key: 'serial', label: 'Serial' },
          { key: 'name', label: 'Nombre' },
          { key: 'client_name', label: 'Cliente', render: (device) => device.client_name ?? 'Sin cliente' },
          { key: 'asset_name', label: 'Activo', render: (device) => device.asset_name ?? 'Sin activo' },
          {
            key: 'active',
            label: 'Activo',
            render: (device) => {
              const isActive = device.asset_id !== null && device.active;

              return (
              <StatusBadge
                label={isActive ? 'Activo' : 'Inactivo'}
                tone={isActive ? 'success' : 'default'}
              />
              );
            },
          },
          { key: 'state', label: 'Estado', render: (device) => device.asset_id === null ? 'OFF' : device.state },
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
              disabled={!device.client_id || reassignAsset.isPending}
              onClick={() => setReassigningDevice(device)}
              variant="secondary"
            >
              Reasignar activo
            </Button>
            <Button
              className="px-3 py-1.5 text-xs"
              disabled={!device.asset_id || releaseAsset.isPending}
              onClick={() => setReleasingDevice(device)}
            >
              Liberar activo
            </Button>
          </div>
        )}
        note="La liberacion desasigna el activo y desactiva el dispositivo."
      />
      )}

      <ReassignAssetDialog
        device={reassigningDevice}
        onClose={() => setReassigningDevice(null)}
        onCompleted={setActionMessage}
      />
      <ReleaseAssetDialog
        device={releasingDevice}
        onClose={() => setReleasingDevice(null)}
        onCompleted={setActionMessage}
      />
    </section>
  );
}
