import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatusBadge } from '../../../shared/components';
import { getDeviceAssetName, type Device } from '../types/device.types';
import { DeviceStateBadge } from './DeviceStateBadge';

type DeviceCardProps = {
  device: Device;
};

export function DeviceCard({ device }: DeviceCardProps) {
  const assetLabel = getDeviceAssetName(device, device.name);

  return (
    <Link
      to={`/app/devices/${device.idDevice}`}
      className="block rounded-2xl border border-brand-border/60 bg-brand-surface p-3 shadow-sm shadow-brand-primary/5 transition hover:-translate-y-0.5 hover:shadow-md hover:shadow-brand-primary/10 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 lg:rounded-3xl lg:p-4 xl:p-3"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <h2 className="truncate text-base font-semibold tracking-tight text-brand-text sm:text-lg xl:text-base">{device.name}</h2>
            <DeviceStateBadge state={device.state} />
          </div>
          <p className="mt-1 truncate text-xs font-medium text-brand-muted">
            {device.serial} <span aria-hidden="true">·</span> {device.communicationProtocol.toUpperCase()}
          </p>
        </div>

        <StatusBadge
          label={device.active ? 'Activo' : 'Inactivo'}
          tone={device.active ? 'success' : 'default'}
        />
      </div>

      <p className="mt-2 truncate text-sm text-brand-muted">
        <span className="font-medium text-brand-text">Asset:</span> {assetLabel}
      </p>

      <dl className="mt-2 hidden grid-cols-3 gap-2 border-t border-brand-border/60 pt-2 text-xs lg:grid">
        <div><dt className="text-brand-muted">Tipo</dt><dd className="truncate text-brand-text">{device.type}</dd></div>
        <div><dt className="text-brand-muted">Client ID</dt><dd className="truncate text-brand-text">{device.clientId ?? 'Sin client'}</dd></div>
        <div><dt className="text-brand-muted">Protocolo</dt><dd className="truncate uppercase text-brand-text">{device.communicationProtocol}</dd></div>
      </dl>

      <div className="mt-2 flex items-center justify-end gap-1 text-xs font-semibold text-brand-primary">
        Ver detalle <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </div>
    </Link>
  );
}
