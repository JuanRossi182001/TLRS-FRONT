import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatusBadge } from '../../../shared/components';
import { GeofenceStatusBadge } from '../../geofences/components/GeofenceStatusBadge';
import type { GeoFenceAssetState } from '../../geofences/types/geofenceState.types';
import type { DeviceLatestLocation } from '../types/map.types';

type MapDeviceBottomSheetProps = {
  device?: DeviceLatestLocation;
  geofenceState?: GeoFenceAssetState;
  onClose: () => void;
};

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function MapDeviceBottomSheet({
  device,
  geofenceState,
  onClose,
}: MapDeviceBottomSheetProps) {
  if (!device) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-16 z-50 px-3 pb-[env(safe-area-inset-bottom)] md:hidden">
      <div className="rounded-[1.75rem] border border-brand-border/70 bg-brand-surface p-5 shadow-2xl shadow-brand-primary/20">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-brand-text">{device.name}</h2>
            <p className="mt-1 text-xs text-brand-muted">{device.serial}</p>
          </div>

          <button
            type="button"
            aria-label="Cerrar detalle"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-md text-brand-muted transition hover:bg-brand-surfaceSoft hover:text-brand-text"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <StatusBadge
            label={device.active ? 'Activo' : 'Inactivo'}
            tone={device.active ? 'success' : 'default'}
          />
          <StatusBadge label={device.type} />
          {geofenceState ? (
            <GeofenceStatusBadge current_status={geofenceState.current_status} />
          ) : null}
        </div>

        {geofenceState ? (
          <div className="mt-4 rounded-2xl bg-brand-surfaceSoft p-3 text-sm">
            <p className="font-semibold text-brand-text">{geofenceState.geofence_name}</p>
            <p className="mt-1 text-brand-muted">
              Distancia: {geofenceState.last_distance_to_boundary_meters !== null
                ? `${geofenceState.last_distance_to_boundary_meters.toFixed(1)} m`
                : 'Sin datos'}
            </p>
            <p className="mt-1 text-brand-muted">
              Accuracy: {geofenceState.last_accuracy !== null
                ? `${geofenceState.last_accuracy.toFixed(1)} m`
                : 'Sin datos'}
            </p>
          </div>
        ) : null}

        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl bg-brand-surfaceSoft p-3">
            <dt className="font-medium text-brand-muted">Latitud</dt>
            <dd className="mt-1 text-brand-text">{device.latitude.toFixed(5)}</dd>
          </div>
          <div className="rounded-2xl bg-brand-surfaceSoft p-3">
            <dt className="font-medium text-brand-muted">Longitud</dt>
            <dd className="mt-1 text-brand-text">{device.longitude.toFixed(5)}</dd>
          </div>
          <div className="rounded-2xl bg-brand-surfaceSoft p-3">
            <dt className="font-medium text-brand-muted">Accuracy</dt>
            <dd className="mt-1 text-brand-text">
              {device.accuracy !== null ? `${device.accuracy} m` : 'Sin datos'}
            </dd>
          </div>
          <div className="rounded-2xl bg-brand-surfaceSoft p-3">
            <dt className="font-medium text-brand-muted">Received at</dt>
            <dd className="mt-1 text-brand-text">{formatDateTime(device.received_at)}</dd>
          </div>
        </dl>

        <Link
          to={`/app/devices/${device.id_device}`}
          className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-brand-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-primaryDark"
        >
          Ver detalle
        </Link>
      </div>
    </div>
  );
}
