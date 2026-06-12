export type GeoFenceStatus = 'SAFE' | 'NEAR_LIMIT' | 'OUTSIDE' | 'GPS_UNCERTAIN';

export type GeoFenceAssetStateApiResponse = {
  id_asset: number;
  asset_type: string;
  asset_serial: string;
  id_device: number;
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

export type MyGeofenceStatesApiResponse = {
  total: number;
  skip: number;
  limit: number;
  items: GeoFenceAssetStateApiResponse[];
};

export type MyGeofenceStatesResponse = {
  total: number;
  skip: number;
  limit: number;
  items: GeoFenceAssetState[];
};

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

export function mapGeofenceAssetStateFromApi(state: GeoFenceAssetStateApiResponse): GeoFenceAssetState {
  return {
    asset_id: state.id_asset,
    asset_type: state.asset_type,
    asset_serial: state.asset_serial,
    device_id: state.id_device,
    device_serial: state.device_serial,
    device_name: state.device_name,
    fence_id: state.fence_id,
    geofence_name: state.geofence_name,
    current_status: state.current_status,
    last_location_id: state.last_location_id,
    latitude: state.latitude,
    longitude: state.longitude,
    last_distance_to_boundary_meters: state.last_distance_to_boundary_meters,
    last_accuracy: state.last_accuracy,
    last_evaluated_at: state.last_evaluated_at,
  };
}

export function mapMyGeofenceStatesResponseFromApi(
  response: MyGeofenceStatesApiResponse,
): MyGeofenceStatesResponse {
  return {
    total: response.total,
    skip: response.skip,
    limit: response.limit,
    items: response.items.map(mapGeofenceAssetStateFromApi),
  };
}
