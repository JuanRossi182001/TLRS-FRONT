import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getDeviceAssetName } from '../../devices/types/device.types';
import { GeofenceStatusBadge } from '../../geofences/components/GeofenceStatusBadge';
import type { GeoFenceAssetState } from '../../geofences/types/geofenceState.types';
import type { DeviceLatestLocation } from '../types/map.types';

type MapDeviceBottomSheetProps = {
  device?: DeviceLatestLocation;
  geofenceState?: GeoFenceAssetState;
  onClose: () => void;
};

export function MapDeviceBottomSheet({
  device,
  geofenceState,
  onClose,
}: MapDeviceBottomSheetProps) {
  if (!device) {
    return null;
  }

  const assetLabel = getDeviceAssetName(device, device.serial);
  const locationLabel = `${device.latitude.toFixed(5)}, ${device.longitude.toFixed(5)}`;

  return (
    <div className="fixed inset-x-0 bottom-16 z-50 px-3 pb-[env(safe-area-inset-bottom)] md:hidden">
      <div className="rounded-[1.75rem] border border-brand-border/70 bg-brand-surface p-3.5 shadow-2xl shadow-brand-primary/20">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-brand-text">{assetLabel}</h2>
            <p className="mt-0.5 text-[11px] text-brand-muted">{device.serial}</p>
          </div>

          <button
            type="button"
            aria-label="Cerrar detalle"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-brand-muted transition hover:bg-brand-surfaceSoft hover:text-brand-text"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <dl className="mt-2.5 grid gap-1.5 text-xs">
          <div className="rounded-2xl bg-brand-surfaceSoft p-2.5">
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
          <div className="rounded-2xl bg-brand-surfaceSoft p-2.5">
            <dt className="font-medium text-brand-muted">Ubicacion</dt>
            <dd className="mt-0.5 whitespace-nowrap text-[11px] text-brand-text">{locationLabel}</dd>
          </div>
        </dl>

        <Link
          to={`/app/devices/${device.id_device}`}
          className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-brand-primary px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-brand-primaryDark"
        >
          Ver detalle
        </Link>
      </div>
    </div>
  );
}
