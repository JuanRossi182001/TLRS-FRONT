import { Link } from 'react-router-dom';
import { Popup } from 'react-map-gl/maplibre';
import { getDeviceAssetName } from '../../devices/types/device.types';
import { GeofenceStatusBadge } from '../../geofences/components/GeofenceStatusBadge';
import type { GeoFenceAssetState } from '../../geofences/types/geofenceState.types';
import type { DeviceLatestLocation } from '../types/map.types';

type DeviceMapPopupProps = {
  device: DeviceLatestLocation;
  geofenceState?: GeoFenceAssetState;
  onClose: () => void;
};

function formatCoordinate(value: number) {
  return value.toFixed(5);
}

export function DeviceMapPopup({ device, geofenceState, onClose }: DeviceMapPopupProps) {
  const assetLabel = getDeviceAssetName(device, device.serial);
  const locationLabel = `${formatCoordinate(device.latitude)}, ${formatCoordinate(device.longitude)}`;

  return (
    <Popup
      latitude={device.latitude}
      longitude={device.longitude}
      anchor="top"
      closeButton
      closeOnClick={false}
      onClose={onClose}
      className="hidden md:block"
      maxWidth="280px"
    >
      <div className="space-y-2 rounded-3xl bg-brand-surface p-0.5 text-sm">
        <div>
          <h2 className="text-sm font-semibold leading-5 text-brand-text">{assetLabel}</h2>
          <p className="mt-0.5 text-[11px] text-brand-muted">{device.serial}</p>
        </div>

        <dl className="grid gap-1.5 text-[11px]">
          <div className="rounded-2xl bg-brand-surfaceSoft p-2">
            <dt className="font-medium text-brand-muted">Estado geocerca</dt>
            {geofenceState ? (
              <dd className="mt-1.5 flex flex-wrap gap-1.5 text-brand-text">
                <GeofenceStatusBadge current_status={geofenceState.current_status} />
                <span>{geofenceState.geofence_name}</span>
              </dd>
            ) : (
              <dd className="mt-1 text-brand-muted">Sin datos</dd>
            )}
          </div>
          <div className="rounded-2xl bg-brand-surfaceSoft p-2">
            <dt className="font-medium text-brand-muted">Ubicacion</dt>
            <dd className="mt-0.5 whitespace-nowrap text-[11px] text-brand-text">{locationLabel}</dd>
          </div>
        </dl>

        <Link
          to={`/app/devices/${device.id_device}`}
          className="inline-flex w-full items-center justify-center rounded-full bg-brand-primary px-3 py-2 text-[11px] font-semibold text-white transition hover:bg-brand-primaryDark"
        >
          Ver detalle
        </Link>
      </div>
    </Popup>
  );
}
