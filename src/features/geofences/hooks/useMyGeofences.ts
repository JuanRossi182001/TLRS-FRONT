import { useQuery } from '@tanstack/react-query';
import { getMyGeofences } from '../api/geofences.api';
import type { GeoFenceRead } from '../types/geofence.types';

export function useMyGeofences() {
  return useQuery<GeoFenceRead[]>({
    queryKey: ['geofences', 'my-geofences'],
    queryFn: () => getMyGeofences({ skip: 0, limit: 100 }),
  });
}
