import type { GeoFenceRead } from '../types/geofence.types';
import { GeofenceCard } from './GeofenceCard';

type GeofenceListProps = {
  geofences: GeoFenceRead[];
};

export function GeofenceList({ geofences }: GeofenceListProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {geofences.map((geofence) => (
        <GeofenceCard geofence={geofence} key={geofence.id_geofence} />
      ))}
    </div>
  );
}
