import type { GeoFenceEventRead } from '../types/alert.types';
import { AlertEmptyState } from './AlertEmptyState';
import { AlertEventCard } from './AlertEventCard';

type AlertEventListProps = {
  events: GeoFenceEventRead[];
};

export function AlertEventList({ events }: AlertEventListProps) {
  if (events.length === 0) {
    return <AlertEmptyState />;
  }

  return (
    <div className="grid gap-4">
      {events.map((event) => (
        <AlertEventCard event={event} key={event.id_event} />
      ))}
    </div>
  );
}
