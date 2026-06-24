export type FenceEventType =
  | 'NEAR_LIMIT'
  | 'EXITED'
  | 'ENTERED'
  | 'RETURNED'
  | 'GPS_UNCERTAIN';

export type AlertTimeFilter = 'all' | 'today' | '7_days';

export type AlertRelevanceFilter = 'all' | 'important_only';

export type AlertEventTypeFilter = Exclude<FenceEventType, 'ENTERED'>;

export type GeoFenceEventRead = {
  id_event: number;
  fence_id: number;
  geofence_name: string;
  device_id: number;
  device_name: string;
  device_serial: string;
  asset_name?: string | null;
  asset_type: string;
  asset_id: number | null;
  location_id: number;
  event_type: FenceEventType;
  distance_to_boundary_meters: number | null;
  accuracy: number | null;
  created_at: string;
};

export type MyGeofenceEventsStatsApiResponse = {
  total_events: number;
  near_limit_events: number;
  exited_events: number;
  returned_events: number;
  gps_unknown_events: number;
};

export type MyGeofenceEventsStats = {
  totalEvents: number;
  nearLimitEvents: number;
  exitedEvents: number;
  returnedEvents: number;
  gpsUnknownEvents: number;
};

export type MyGeofenceEventsApiResponse = {
  total: number;
  skip: number;
  limit: number;
  stats: MyGeofenceEventsStatsApiResponse;
  items: GeoFenceEventRead[];
};

export type MyGeofenceEventsResponse = {
  total: number;
  skip: number;
  limit: number;
  stats: MyGeofenceEventsStats;
  items: GeoFenceEventRead[];
};

export function mapMyGeofenceEventsStatsFromApi(
  stats: MyGeofenceEventsStatsApiResponse,
): MyGeofenceEventsStats {
  return {
    totalEvents: stats.total_events,
    nearLimitEvents: stats.near_limit_events,
    exitedEvents: stats.exited_events,
    returnedEvents: stats.returned_events,
    gpsUnknownEvents: stats.gps_unknown_events,
  };
}
