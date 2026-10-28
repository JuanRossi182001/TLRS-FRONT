import { Button, ResponsiveDialog, StatusBadge } from '../../../shared/components';
import type { ReactNode } from 'react';
import { DeviceStateBadge } from '../../devices/components/DeviceStateBadge';
import { getDeviceAssetName } from '../../devices/types/device.types';
import { GeofenceStatusBadge } from '../../geofences/components/GeofenceStatusBadge';
import { AdminDeviceQrSection } from './AdminDeviceQrSection';
import type { AdminDeviceListItem } from '../types/admin.types';

type AdminDeviceDetailDialogProps = {
  device: AdminDeviceListItem | null;
  onAssign: (device: AdminDeviceListItem) => void;
  onClose: () => void;
  onReassign: (device: AdminDeviceListItem) => void;
  onRelease: (device: AdminDeviceListItem) => void;
};

function DetailItem({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-medium text-brand-muted">{label}</dt>
      <dd className="mt-1 break-words text-sm text-brand-text">{value}</dd>
    </div>
  );
}

export function AdminDeviceDetailDialog({
  device,
  onAssign,
  onClose,
  onReassign,
  onRelease,
}: AdminDeviceDetailDialogProps) {
  if (!device) {
    return null;
  }

  const isAssigned = device.asset_id !== null;

  return (
    <ResponsiveDialog isOpen onClose={onClose} subtitle={device.name} title={device.serial}>
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-2 border-b border-brand-border/60 pb-4">
          <StatusBadge label={device.active ? 'Dispositivo activo' : 'Dispositivo inactivo'} tone={device.active ? 'success' : 'default'} />
          <DeviceStateBadge state={device.state} />
        </div>

        <section aria-labelledby="device-assignment-heading">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-muted" id="device-assignment-heading">Asignacion</h3>
          <div className="mt-3 rounded-2xl border border-brand-border/60 bg-brand-surfaceSoft p-3">
            <p className="text-xs font-medium text-brand-muted">Asset actual</p>
            <p className="mt-1 text-base font-semibold text-brand-text">
              {isAssigned ? getDeviceAssetName(device, 'Asset sin nombre') : 'Sin asignar'}
            </p>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {isAssigned ? (
              <>
                <Button disabled={!device.client_id} onClick={() => onReassign(device)} variant="secondary">Reasignar asset</Button>
                <Button onClick={() => onRelease(device)}>Liberar asset</Button>
              </>
            ) : (
              <Button disabled={!device.client_id} onClick={() => onAssign(device)}>Asignar asset</Button>
            )}
          </div>
          {!device.client_id ? <p className="mt-2 text-xs text-brand-muted">Se necesita un cliente asociado para asignar o reasignar un asset.</p> : null}
        </section>

        <section aria-labelledby="device-operation-heading" className="border-t border-brand-border/60 pt-5">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-muted" id="device-operation-heading">Estado operativo</h3>
          <dl className="mt-3 grid gap-4 sm:grid-cols-2">
            <DetailItem label="Conexion" value={<DeviceStateBadge state={device.state} />} />
            <DetailItem label="Geocerca" value={<GeofenceStatusBadge current_status={device.status} />} />
          </dl>
        </section>

        <section aria-labelledby="device-information-heading" className="border-t border-brand-border/60 pt-5">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-muted" id="device-information-heading">Informacion del dispositivo</h3>
          <dl className="mt-3 grid gap-4 sm:grid-cols-2">
            <DetailItem label="ID" value={device.id_device} />
            <DetailItem label="Serial" value={device.serial} />
            <DetailItem label="Nombre" value={device.name} />
            <DetailItem label="Cliente" value={device.client_name ?? 'Sin cliente'} />
            <DetailItem label="Protocolo" value={device.communication_protocol?.toUpperCase() ?? 'Sin datos'} />
            <DetailItem label="DevEUI ChirpStack" value={device.chirpstack_dev_eui ?? 'Sin datos'} />
            <DetailItem label="Application ID ChirpStack" value={device.chirpstack_application_id ?? 'Sin datos'} />
            <DetailItem label="Device Profile ChirpStack" value={device.chirpstack_device_profile_id ?? 'Sin datos'} />
          </dl>
        </section>

        <AdminDeviceQrSection deviceId={device.id_device} serial={device.serial} />
      </div>
    </ResponsiveDialog>
  );
}
