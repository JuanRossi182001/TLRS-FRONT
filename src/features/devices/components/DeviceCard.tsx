import { Link } from 'react-router-dom';
import { Card, StatusBadge } from '../../../shared/components';
import type { DeviceTrackingItem } from '../types/device.types';
import { AssetBadge } from './AssetBadge';
import { ClientBadge } from './ClientBadge';
import { DeviceLastSeen } from './DeviceLastSeen';
import { DeviceLocationPreview } from './DeviceLocationPreview';
import { DeviceStateBadge } from './DeviceStateBadge';

type DeviceCardProps = {
  item: DeviceTrackingItem;
};

export function DeviceCard({ item }: DeviceCardProps) {
  const { device, asset, client, lastLocation } = item;

  return (
    <Card className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold text-slate-950">{device.name}</h2>
            <DeviceStateBadge state={device.state} />
          </div>
          <p className="mt-1 text-sm text-slate-500">{device.serial}</p>
        </div>

        <StatusBadge label={device.active ? 'Activo' : 'Inactivo'} tone={device.active ? 'success' : 'default'} />
      </div>

      <div className="flex flex-wrap gap-2">
        <ClientBadge client={client} />
        <AssetBadge asset={asset} />
      </div>

      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="font-medium text-slate-500">Tipo</dt>
          <dd className="mt-1 text-slate-900">{device.type}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">Protocolo</dt>
          <dd className="mt-1 uppercase text-slate-900">{device.communicationProtocol}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">Ultimo visto</dt>
          <dd className="mt-1 text-slate-900">
            <DeviceLastSeen value={device.lastSeenAt} />
          </dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">Ultima ubicacion</dt>
          <dd className="mt-1 text-slate-900">
            <DeviceLocationPreview location={lastLocation} />
          </dd>
        </div>
      </dl>

      <div className="flex justify-end">
        <Link
          to={`/app/devices/${device.idDevice}`}
          className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Ver detalle
        </Link>
      </div>
    </Card>
  );
}
