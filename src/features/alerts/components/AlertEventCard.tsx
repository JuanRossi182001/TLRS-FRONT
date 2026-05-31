import { Card } from '../../../shared/components';
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

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}

function getEventTitle(event: GeoFenceEventRead) {
  return titleByEventType[event.event_type]?.(event)
    ?? `${event.device_name} genero un evento en ${event.geofence_name}`;
}

function getMetadata(event: GeoFenceEventRead) {
  const asset = event.asset_id !== null
    ? `${event.asset_type} #${event.asset_id}`
    : event.asset_type || 'Asset no especificado';

  return `${event.device_serial} - ${asset} - ${event.geofence_name}`;
}

export function AlertEventCard({ event }: AlertEventCardProps) {
  return (
    <Card className="space-y-5 transition hover:-translate-y-0.5 hover:shadow-md hover:shadow-brand-primary/10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <AlertEventTypeBadge event_type={event.event_type} />
        <time className="text-sm font-medium text-brand-muted" dateTime={event.created_at}>
          {formatDateTime(event.created_at)}
        </time>
      </div>

      <div>
        <h2 className="text-xl font-semibold leading-tight text-brand-text">
          {getEventTitle(event)}
        </h2>
        <p className="mt-2 text-sm leading-6 text-brand-muted">{getMetadata(event)}</p>
      </div>

      <div className="grid gap-3 text-sm sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl bg-brand-surfaceSoft p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">Geocerca</p>
          <p className="mt-1 font-semibold text-brand-text">#{event.fence_id}</p>
        </div>
        <div className="rounded-2xl bg-brand-surfaceSoft p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">Dispositivo</p>
          <p className="mt-1 font-semibold text-brand-text">#{event.device_id}</p>
        </div>
        <div className="rounded-2xl bg-brand-surfaceSoft p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">Ubicacion</p>
          <p className="mt-1 font-semibold text-brand-text">#{event.location_id}</p>
        </div>
        {event.distance_to_boundary_meters !== null ? (
          <div className="rounded-2xl bg-blue-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">Distancia</p>
            <p className="mt-1 font-semibold text-brand-text">
              {event.distance_to_boundary_meters.toFixed(1)} m del limite
            </p>
          </div>
        ) : null}
        {event.accuracy !== null ? (
          <div className="rounded-2xl bg-amber-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">Precision GPS</p>
            <p className="mt-1 font-semibold text-brand-text">{event.accuracy.toFixed(1)} m</p>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
