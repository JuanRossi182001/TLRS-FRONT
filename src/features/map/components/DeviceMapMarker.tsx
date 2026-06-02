import { RadioTower } from 'lucide-react';
import type { GeoFenceAssetState } from '../../geofences/types/geofenceState.types';
import { getGeofenceStatusUi } from '../../geofences/utils/geofenceStatusUi';
import type { DeviceLatestLocation } from '../types/map.types';

type DeviceMapMarkerProps = {
  device: DeviceLatestLocation;
  geofenceState?: GeoFenceAssetState;
  isSelected: boolean;
  onClick: () => void;
};

export function DeviceMapMarker({
  device,
  geofenceState,
  isSelected,
  onClick,
}: DeviceMapMarkerProps) {
  const statusClassName = geofenceState
    ? getGeofenceStatusUi(geofenceState.current_status).markerClassName
    : device.active
      ? 'bg-brand-success ring-emerald-100'
      : 'bg-brand-muted ring-white';

  return (
    <button
      type="button"
      aria-label={`Seleccionar device ${device.name}`}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      className={[
        'flex h-11 w-11 items-center justify-center rounded-full text-white shadow-xl ring-4 transition',
        statusClassName,
        isSelected ? 'scale-110' : 'hover:scale-105',
      ].join(' ')}
    >
      <RadioTower className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}
