import { Link } from 'react-router-dom';
import { Card, StatusBadge } from '../../../shared/components';
import { getDeviceAssetName, type Device } from '../types/device.types';
import { DeviceStateBadge } from './DeviceStateBadge';

type DeviceCardProps = {
  device: Device;
};

export function DeviceCard({ device }: DeviceCardProps) {
  const assetLabel = getDeviceAssetName(device, device.name);

  return (
    <Card className="space-y-3 p-4 transition hover:-translate-y-0.5 hover:shadow-md hover:shadow-brand-primary/10 xl:space-y-2 xl:p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <h2 className="truncate text-base font-semibold tracking-tight text-brand-text sm:text-lg xl:text-base">{assetLabel}</h2>
            <DeviceStateBadge state={device.state} />
          </div>
          <p className="mt-0.5 truncate text-xs font-medium text-brand-muted">{device.serial}</p>
        </div>

        <StatusBadge
          label={device.active ? 'Activo' : 'Inactivo'}
          tone={device.active ? 'success' : 'default'}
        />
      </div>

      <dl className="grid grid-cols-2 gap-2 text-xs sm:text-sm xl:text-xs">
        <div className="rounded-xl bg-brand-surfaceSoft p-2.5 xl:p-2">
          <dt className="font-medium text-brand-muted">Tipo</dt>
          <dd className="mt-0.5 truncate text-brand-text">{device.type}</dd>
        </div>
        <div className="rounded-xl bg-brand-surfaceSoft p-2.5 xl:p-2">
          <dt className="font-medium text-brand-muted">Protocolo</dt>
          <dd className="mt-0.5 truncate uppercase text-brand-text">{device.communicationProtocol}</dd>
        </div>
        <div className="rounded-xl bg-brand-surfaceSoft p-2.5 xl:p-2">
          <dt className="font-medium text-brand-muted">Client ID</dt>
          <dd className="mt-0.5 text-brand-text">{device.clientId ?? 'Sin client'}</dd>
        </div>
        <div className="rounded-xl bg-brand-surfaceSoft p-2.5 xl:p-2">
          <dt className="font-medium text-brand-muted">Asset</dt>
          <dd className="mt-0.5 text-brand-text">{assetLabel}</dd>
        </div>
      </dl>

      <div className="flex justify-end pt-1">
        <Link
          to={`/app/devices/${device.idDevice}`}
          className="inline-flex w-full items-center justify-center rounded-full bg-brand-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-primaryDark hover:shadow-md sm:w-auto xl:py-1.5 xl:text-xs"
        >
          Ver detalle
        </Link>
      </div>
    </Card>
  );
}
