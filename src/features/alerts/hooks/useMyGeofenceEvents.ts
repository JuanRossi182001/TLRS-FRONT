import { useQuery } from '@tanstack/react-query';
import { getMyGeofenceEvents, type GetMyGeofenceEventsParams } from '../api/alerts.api';
import type { MyGeofenceEventsResponse } from '../types/alert.types';

type UseMyGeofenceEventsParams = GetMyGeofenceEventsParams;

export function useMyGeofenceEvents(params: UseMyGeofenceEventsParams = {}) {
  const {
    skip = 0,
    limit = 100,
    time_filter = 'today',
    relevance_filter = 'all',
    event_type,
  } = params;

  return useQuery<MyGeofenceEventsResponse>({
    queryKey: ['geofences', 'events', 'my-events', skip, limit, time_filter, relevance_filter, event_type ?? 'all'],
    queryFn: () => getMyGeofenceEvents({ skip, limit, time_filter, relevance_filter, event_type }),
    placeholderData: (previousData) => previousData,
    staleTime: 15_000,
    refetchInterval: 30_000,
  });
}
