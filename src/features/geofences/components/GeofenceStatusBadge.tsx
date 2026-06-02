import { getGeofenceStatusUi } from '../utils/geofenceStatusUi';
import type { GeoFenceStatus } from '../types/geofenceState.types';

type GeofenceStatusBadgeProps = {
  current_status: GeoFenceStatus;
};

export function GeofenceStatusBadge({ current_status }: GeofenceStatusBadgeProps) {
  const ui = getGeofenceStatusUi(current_status);

  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset',
        ui.badgeClassName,
      ].join(' ')}
      title={ui.description}
    >
      {ui.label}
    </span>
  );
}
