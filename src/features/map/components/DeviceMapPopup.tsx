import { Link } from 'react-router-dom';
import { Popup } from 'react-map-gl/maplibre';
import { AssetBadge } from '../../devices/components/AssetBadge';
import { ClientBadge } from '../../devices/components/ClientBadge';
import { DeviceLastSeen } from '../../devices/components/DeviceLastSeen';
import { DeviceLocationPreview } from '../../devices/components/DeviceLocationPreview';
import { DeviceStateBadge } from '../../devices/components/DeviceStateBadge';
import type { LocatedDeviceTrackingItem } from '../types/map.types';

type DeviceMapPopupProps = {
  item: LocatedDeviceTrackingItem;
  onClose: () => void;
};

export function DeviceMapPopup({ item, onClose }: DeviceMapPopupProps) {
  const { device, asset, client, lastLocation } = item;

  return (
    <Popup
      latitude={lastLocation.latitude}
      longitude={lastLocation.longitude}
      anchor="top"
      closeButton
      closeOnClick={false}
      onClose={onClose}
      className="hidden md:block"
      maxWidth="320px"
    >
      <div className="space-y-3 p-1 text-sm">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h2 className="font-semibold text-slate-950">{device.name}</h2>
            <DeviceStateBadge state={device.state} />
          </div>
          <p className="mt-1 text-xs text-slate-500">{device.serial}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <ClientBadge client={client} />
          <AssetBadge asset={asset} />
        </div>

        <dl className="grid gap-2 text-xs">
          <div>
            <dt className="font-medium text-slate-500">Ubicacion</dt>
            <dd className="mt-0.5 text-slate-900">
              <DeviceLocationPreview location={lastLocation} />
            </dd>
          </div>
          <div>
            <dt className="font-medium text-slate-500">Ultima conexion</dt>
            <dd className="mt-0.5 text-slate-900">
              <DeviceLastSeen value={device.lastSeenAt} />
            </dd>
          </div>
        </dl>

        <Link
          to={`/app/devices/${device.idDevice}`}
          className="inline-flex w-full items-center justify-center rounded-md bg-slate-950 px-3 py-2 text-xs font-medium text-white transition hover:bg-slate-800"
        >
          Ver detalle
        </Link>
      </div>
    </Popup>
  );
}
