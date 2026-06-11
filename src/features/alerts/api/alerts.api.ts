import { apiFetch } from '../../../shared/api/httpClient';
import {
  mapMyGeofenceEventsStatsFromApi,
  type AlertEventTypeFilter,
  type AlertRelevanceFilter,
  type AlertTimeFilter,
  type MyGeofenceEventsApiResponse,
  type MyGeofenceEventsResponse,
} from '../types/alert.types';

export type GetMyGeofenceEventsParams = {
  skip?: number;
  limit?: number;
  time_filter?: AlertTimeFilter;
  relevance_filter?: AlertRelevanceFilter;
  event_type?: AlertEventTypeFilter;
};

export function getMyGeofenceEvents(params: GetMyGeofenceEventsParams = {}) {
  const {
    skip = 0,
    limit = 100,
    time_filter = 'today',
    relevance_filter = 'all',
    event_type,
  } = params;
  const searchParams = new URLSearchParams({
    skip: String(skip),
    limit: String(limit),
    time_filter,
    relevance_filter,
  });

  if (event_type) {
    searchParams.set('event_type', event_type);
  }

  return apiFetch<MyGeofenceEventsApiResponse>(`/geofences/events/my-events?${searchParams.toString()}`)
    .then((response): MyGeofenceEventsResponse => ({
      total: response.total,
      skip: response.skip,
      limit: response.limit,
      stats: mapMyGeofenceEventsStatsFromApi(response.stats),
      items: response.items,
    }));
}
