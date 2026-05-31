export type FenceEventType =
  | 'NEAR_LIMIT'
  | 'EXITED'
  | 'ENTERED'
  | 'RETURNED'
  | 'GPS_UNCERTAIN';

export type GeoFenceEventRead = {
  id_event: number;
  fence_id: number;
  geofence_name: string;
  device_id: number;
  device_name: string;
  device_serial: string;
  asset_type: string;
  asset_id: number | null;
  location_id: number;
  event_type: FenceEventType;
  distance_to_boundary_meters: number | null;
  accuracy: number | null;
  created_at: string;
};
