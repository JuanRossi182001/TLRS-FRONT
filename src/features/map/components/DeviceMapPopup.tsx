import { Link } from 'react-router-dom';
import { Popup } from 'react-map-gl/maplibre';
import { StatusBadge } from '../../../shared/components';
import { formatArgentinaDateTime } from '../../../shared/utils/dateTime';
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

  return (
    <Popup
      latitude={device.latitude}
      longitude={device.longitude}
      anchor="top"
      closeButton
      closeOnClick={false}
      onClose={onClose}
      className="hidden md:block"
      maxWidth="340px"
    >
      <div className="space-y-4 rounded-3xl bg-brand-surface p-2 text-sm">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h2 className="font-semibold text-brand-text">{assetLabel}</h2>
            <StatusBadge
              label={device.active ? 'Activo' : 'Inactivo'}
              tone={device.active ? 'success' : 'default'}
            />
          </div>
          <p className="mt-1 text-xs text-brand-muted">{device.serial}</p>
        </div>

        <dl className="grid gap-2 text-xs">
          {geofenceState ? (
            <div className="rounded-2xl bg-brand-surfaceSoft p-2">
              <dt className="font-medium text-brand-muted">Estado geocerca</dt>
              <dd className="mt-2 flex flex-wrap gap-2 text-brand-text">
                <GeofenceStatusBadge current_status={geofenceState.current_status} />
                <span>{geofenceState.geofence_name}</span>
              </dd>
              <dd className="mt-1 text-brand-muted">
                Distancia: {geofenceState.last_distance_to_boundary_meters !== null
                  ? `${geofenceState.last_distance_to_boundary_meters.toFixed(1)} m`
                  : 'Sin datos'}
              </dd>
            </div>
          ) : null}
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-2xl bg-brand-surfaceSoft p-2">
              <dt className="font-medium text-brand-muted">Tipo</dt>
              <dd className="mt-0.5 text-brand-text">{device.type}</dd>
            </div>
            <div className="rounded-2xl bg-brand-surfaceSoft p-2">
              <dt className="font-medium text-brand-muted">Asset</dt>
              <dd className="mt-0.5 text-brand-text">{assetLabel}</dd>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-2xl bg-brand-surfaceSoft p-2">
              <dt className="font-medium text-brand-muted">Client ID</dt>
              <dd className="mt-0.5 text-brand-text">{device.client_id ?? 'Sin client'}</dd>
            </div>
            <div className="rounded-2xl bg-brand-surfaceSoft p-2">
              <dt className="font-medium text-brand-muted">Accuracy</dt>
              <dd className="mt-0.5 text-brand-text">
                {device.accuracy !== null ? `${device.accuracy} m` : 'Sin datos'}
              </dd>
            </div>
          </div>
          <div className="rounded-2xl bg-brand-surfaceSoft p-2">
            <dt className="font-medium text-brand-muted">Ubicacion</dt>
            <dd className="mt-0.5 text-brand-text">
              {formatCoordinate(device.latitude)}, {formatCoordinate(device.longitude)}
            </dd>
          </div>
          <div className="rounded-2xl bg-brand-surfaceSoft p-2">
            <dt className="font-medium text-brand-muted">Altitud</dt>
            <dd className="mt-0.5 text-brand-text">
              {device.altitude !== null ? `${device.altitude} m` : 'Sin datos'}
            </dd>
          </div>
          <div className="rounded-2xl bg-brand-surfaceSoft p-2">
            <dt className="font-medium text-brand-muted">Device timestamp</dt>
            <dd className="mt-0.5 text-brand-text">
              {formatArgentinaDateTime(device.device_timestamp)}
            </dd>
          </div>
          <div className="rounded-2xl bg-brand-surfaceSoft p-2">
            <dt className="font-medium text-brand-muted">Received at</dt>
            <dd className="mt-0.5 text-brand-text">{formatArgentinaDateTime(device.received_at)}</dd>
          </div>
        </dl>

        <Link
          to={`/app/devices/${device.id_device}`}
          className="inline-flex w-full items-center justify-center rounded-full bg-brand-primary px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-brand-primaryDark"
        >
          Ver detalle
        </Link>
      </div>
    </Popup>
  );
}
