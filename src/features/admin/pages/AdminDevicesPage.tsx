import { useDeferredValue, useState } from 'react';
import { EmptyState, ErrorState, LoadingState } from '../../../shared/components';
import { AdminDeviceDetailDialog } from '../components/AdminDeviceDetailDialog';
import { AdminDeviceList } from '../components/AdminDeviceList';
import { CreateAssetPanel } from '../components/CreateAssetPanel';
import { ReassignAssetDialog, ReleaseAssetDialog } from '../components/DeviceAssetDialogs';
import { AdminPageHeader } from '../components/AdminPageHeader';
import { ProvisionDevicePanel } from '../components/ProvisionDevicePanel';
import { useAdminClients } from '../hooks/useAdminClients';
import { useAdminDevices } from '../hooks/useAdminDevices';
import type { AdminDeviceListItem } from '../types/admin.types';

type AssignmentFilter = 'all' | 'assigned' | 'unassigned';

export function AdminDevicesPage() {
  const { data: devices = [], isLoading, isError, error } = useAdminDevices();
  const clients = useAdminClients();
  const [search, setSearch] = useState('');
  const [assignmentFilter, setAssignmentFilter] = useState<AssignmentFilter>('all');
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null);
  const [reassigningDevice, setReassigningDevice] = useState<AdminDeviceListItem | null>(null);
  const [assignmentAction, setAssignmentAction] = useState<'assign' | 'reassign'>('reassign');
  const [releasingDevice, setReleasingDevice] = useState<AdminDeviceListItem | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const deferredSearch = useDeferredValue(search);
  const normalizedSearch = deferredSearch.trim().toLowerCase();
  const searchedDevices = normalizedSearch
    ? devices.filter((device) =>
        [device.serial, device.name, device.client_name, device.asset_name]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(normalizedSearch),
      )
    : devices;
  const filteredDevices = searchedDevices.filter((device) => {
    if (assignmentFilter === 'assigned') {
      return device.asset_id !== null;
    }

    if (assignmentFilter === 'unassigned') {
      return device.asset_id === null;
    }

    return true;
  });
  const selectedDevice = devices.find((device) => device.id_device === selectedDeviceId) ?? null;

  function openAssignmentDialog(device: AdminDeviceListItem, action: 'assign' | 'reassign') {
    setAssignmentAction(action);
    setReassigningDevice(device);
  }

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
        <div className="grid items-start gap-3 lg:gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(18rem,0.7fr)] xl:gap-5">
          <ProvisionDevicePanel clients={clients.data ?? []} />
          <CreateAssetPanel clients={clients.data ?? []} />
        </div>
      ) : null}

      <div className="flex flex-wrap items-end justify-between gap-3 border-t border-brand-border/60 pt-5 lg:pt-6">
        <div>
          <h2 className="text-xl font-semibold text-brand-text">Dispositivos</h2>
          <p className="mt-1 text-sm text-brand-muted">
            {filteredDevices.length === devices.length ? `${devices.length} dispositivos` : `${filteredDevices.length} de ${devices.length} dispositivos`}
          </p>
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

      <div aria-label="Filtrar dispositivos por asignacion" className="flex flex-wrap gap-1.5" role="group">
        {[
          ['all', 'Todos'],
          ['assigned', 'Asignados'],
          ['unassigned', 'Sin asignar'],
        ].map(([value, label]) => {
          const isSelected = assignmentFilter === value;

          return (
            <button
              aria-pressed={isSelected}
              className={[
                'rounded-full px-3 py-1.5 text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-brand-primary/30',
                isSelected
                  ? 'bg-brand-primary text-white'
                  : 'bg-brand-surfaceSoft text-brand-muted hover:bg-brand-border/50 hover:text-brand-text',
              ].join(' ')}
              key={value}
              onClick={() => setAssignmentFilter(value as AssignmentFilter)}
              type="button"
            >
              {label}
            </button>
          );
        })}
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
          message="Prueba con otro serial, nombre, cliente, asset o filtro de asignacion."
        />
      ) : (
        <AdminDeviceList devices={filteredDevices} onSelect={(device) => setSelectedDeviceId(device.id_device)} />
      )}

      <AdminDeviceDetailDialog
        device={selectedDevice}
        onAssign={(device) => openAssignmentDialog(device, 'assign')}
        onClose={() => setSelectedDeviceId(null)}
        onReassign={(device) => openAssignmentDialog(device, 'reassign')}
        onRelease={setReleasingDevice}
      />

      <ReassignAssetDialog
        action={assignmentAction}
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
