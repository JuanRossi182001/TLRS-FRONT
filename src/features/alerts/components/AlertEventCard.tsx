import { Card } from '../../../shared/components';
import { formatArgentinaDateTime } from '../../../shared/utils/dateTime';
import type { FenceEventType, GeoFenceEventRead } from '../types/alert.types';
import { AlertEventTypeBadge } from './AlertEventTypeBadge';

type AlertEventCardProps = {
  event: GeoFenceEventRead;
};

const titleByEventType: Record<FenceEventType, (event: GeoFenceEventRead) => string> = {
  EXITED: (event) => `${event.device_name} salio de ${event.geofence_name}`,
  NEAR_LIMIT: (event) => `${event.device_name} esta cerca del limite de ${event.geofence_name}`,
  GPS_UNCERTAIN: (event) =>
    `La senal GPS de ${event.device_name} es incierta en ${event.geofence_name}`,
  ENTERED: (event) => `${event.device_name} entro a ${event.geofence_name}`,
  RETURNED: (event) => `${event.device_name} volvio a ${event.geofence_name}`,
};

function getEventTitle(event: GeoFenceEventRead) {
  const assetLabel = event.asset_name || event.device_serial;

  return titleByEventType[event.event_type]?.({
    ...event,
    device_name: assetLabel,
  }) ?? `${assetLabel} genero un evento en ${event.geofence_name}`;
}

function getMetadata(event: GeoFenceEventRead) {
  const asset = event.asset_name || event.asset_type || 'Asset no especificado';

  return `${asset} - ${event.device_serial} - ${event.geofence_name}`;
}

export function AlertEventCard({ event }: AlertEventCardProps) {
  return (
    <Card className="flex h-full flex-col space-y-2.5 p-3 transition hover:-translate-y-0.5 hover:shadow-md hover:shadow-brand-primary/10 xl:space-y-2 xl:p-3" density="compact">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <AlertEventTypeBadge event_type={event.event_type} />
        </div>
        <time className="shrink-0 text-[11px] font-medium text-brand-muted" dateTime={event.created_at}>
          {formatArgentinaDateTime(event.created_at)}
        </time>
      </div>

      <div className="min-w-0">
        <h2 className="text-base font-semibold leading-tight text-brand-text xl:text-[15px]">
          {getEventTitle(event)}
        </h2>
        <p className="mt-1 text-xs leading-4 text-brand-muted">{getMetadata(event)}</p>
      </div>

      <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5 border-t border-brand-border/60 pt-2 text-xs xl:mt-auto">
        <div><dt className="text-brand-muted">Geocerca</dt><dd className="font-semibold text-brand-text">#{event.fence_id}</dd></div>
        <div><dt className="text-brand-muted">Dispositivo</dt><dd className="font-semibold text-brand-text">{event.device_serial}</dd></div>
        {event.distance_to_boundary_meters !== null ? (
          <div><dt className="text-brand-muted">Distancia</dt><dd className="font-semibold text-brand-text">{event.distance_to_boundary_meters.toFixed(1)} m</dd></div>
        ) : null}
        {event.accuracy !== null ? (
          <div><dt className="text-brand-muted">Precision GPS</dt><dd className="font-semibold text-brand-text">{event.accuracy.toFixed(1)} m</dd></div>
        ) : null}
      </dl>
    </Card>
  );
}
