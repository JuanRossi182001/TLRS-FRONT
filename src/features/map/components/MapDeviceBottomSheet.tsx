import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getDeviceAssetName } from '../../devices/types/device.types';
import { GeofenceStatusBadge } from '../../geofences/components/GeofenceStatusBadge';
import type { GeoFenceAssetState } from '../../geofences/types/geofenceState.types';
import type { DeviceLatestLocation } from '../types/map.types';

type MapDeviceBottomSheetProps = {
  device?: DeviceLatestLocation;
  geofenceStates: GeoFenceAssetState[];
  onClose: () => void;
};

export function MapDeviceBottomSheet({
  device,
  geofenceStates,
  onClose,
}: MapDeviceBottomSheetProps) {
  if (!device) {
    return null;
  }

  const assetLabel = getDeviceAssetName(device, device.serial);
  const locationLabel = `${device.latitude.toFixed(5)}, ${device.longitude.toFixed(5)}`;

  return (
    <div className="fixed inset-x-0 bottom-[var(--mobile-nav-clearance)] z-50 px-3 md:hidden">
      <div className="rounded-2xl border border-brand-border/70 bg-brand-surface p-3 shadow-xl shadow-brand-primary/20">
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

        <dl className="mt-2 grid gap-1.5 text-xs">
          <div className="rounded-xl bg-brand-surfaceSoft p-2">
            <dt className="font-medium text-brand-muted">Estado geocerca</dt>
            {geofenceStates.length > 0 ? (
              <dd className="mt-1.5 space-y-1.5 text-brand-text">
                {geofenceStates.map((state) => (
                  <div className="flex flex-wrap items-center gap-1.5" key={state.fence_id}>
                    <GeofenceStatusBadge current_status={state.current_status} />
                    <span>{state.geofence_name}</span>
                  </div>
                ))}
              </dd>
            ) : (
              <dd className="mt-1 text-brand-muted">Sin datos</dd>
            )}
          </div>
          <div className="rounded-xl bg-brand-surfaceSoft p-2">
            <dt className="font-medium text-brand-muted">Ubicacion</dt>
            <dd className="mt-0.5 whitespace-nowrap text-[11px] text-brand-text">{locationLabel}</dd>
          </div>
        </dl>

        <Link
          to={`/app/devices/${device.id_device}`}
          className="mt-2 inline-flex min-h-10 items-center justify-center rounded-2xl bg-brand-primary px-4 text-xs font-semibold text-white transition hover:bg-brand-primaryDark"
        >
          Ver detalle
        </Link>
      </div>
    </div>
  );
}
