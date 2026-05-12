import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AssetBadge } from '../../devices/components/AssetBadge';
import { ClientBadge } from '../../devices/components/ClientBadge';
import { DeviceLastSeen } from '../../devices/components/DeviceLastSeen';
import { DeviceStateBadge } from '../../devices/components/DeviceStateBadge';
import type { LocatedDeviceTrackingItem } from '../types/map.types';

type MapDeviceBottomSheetProps = {
  item?: LocatedDeviceTrackingItem;
  onClose: () => void;
};

export function MapDeviceBottomSheet({ item, onClose }: MapDeviceBottomSheetProps) {
  if (!item) {
    return null;
  }

  const { device, asset, client } = item;

  return (
    <div className="fixed inset-x-0 bottom-16 z-50 px-3 pb-[env(safe-area-inset-bottom)] md:hidden">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-950">{device.name}</h2>
            <p className="mt-1 text-xs text-slate-500">{device.serial}</p>
          </div>

          <button
            type="button"
            aria-label="Cerrar detalle"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <DeviceStateBadge state={device.state} />
          <ClientBadge client={client} />
          <AssetBadge asset={asset} />
        </div>

        <dl className="mt-3 text-sm">
          <dt className="font-medium text-slate-500">Ultima conexion</dt>
          <dd className="mt-1 text-slate-900">
            <DeviceLastSeen value={device.lastSeenAt} />
          </dd>
        </dl>

        <Link
          to={`/app/devices/${device.idDevice}`}
          className="mt-4 inline-flex w-full items-center justify-center rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Ver detalle
        </Link>
      </div>
    </div>
  );
}
