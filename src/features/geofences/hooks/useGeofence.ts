import { useQuery } from '@tanstack/react-query';
import { getGeofence } from '../api/geofences.api';
import type { GeoFenceDetailRead } from '../types/geofence.types';

export function useGeofence(geofence_id: number, enabled: boolean) {
  return useQuery<GeoFenceDetailRead>({
    queryKey: ['geofences', geofence_id, 'detail'],
    queryFn: () => getGeofence(geofence_id),
    enabled,
  });
}
