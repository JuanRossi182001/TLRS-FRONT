import { useQuery } from '@tanstack/react-query';
import { getGeofenceAssignments } from '../api/geofences.api';
import type { GeoFenceAssignmentRead } from '../types/geofence.types';

export function useGeofenceAssignments(geofence_id: number, enabled: boolean) {
  return useQuery<GeoFenceAssignmentRead[]>({
    queryKey: ['geofences', geofence_id, 'assignments'],
    queryFn: () => getGeofenceAssignments(geofence_id),
    enabled,
  });
}
