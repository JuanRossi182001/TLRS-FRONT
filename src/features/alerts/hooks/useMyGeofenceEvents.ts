import { useQuery } from '@tanstack/react-query';
import { getMyGeofenceEvents } from '../api/alerts.api';
import type { GeoFenceEventRead } from '../types/alert.types';

type UseMyGeofenceEventsParams = {
  skip?: number;
  limit?: number;
};

export function useMyGeofenceEvents(params: UseMyGeofenceEventsParams = {}) {
  return useQuery<GeoFenceEventRead[]>({
    queryKey: ['geofences', 'events', 'my-events', params],
    queryFn: () => getMyGeofenceEvents(params),
    staleTime: 15_000,
    refetchInterval: 30_000,
  });
}
