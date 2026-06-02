export type GeoFenceStatus = 'SAFE' | 'NEAR_LIMIT' | 'OUTSIDE' | 'GPS_UNCERTAIN';

export type GeoFenceAssetState = {
  asset_id: number;
  asset_type: string;
  asset_serial: string;
  device_id: number;
  device_serial: string;
  device_name: string;
  fence_id: number;
  geofence_name: string;
  current_status: GeoFenceStatus;
  last_location_id: number | null;
  latitude: number | null;
  longitude: number | null;
  last_distance_to_boundary_meters: number | null;
  last_accuracy: number | null;
  last_evaluated_at: string | null;
};
