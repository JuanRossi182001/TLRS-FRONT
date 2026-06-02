import { apiFetch } from '../../../shared/api/httpClient';
import type { GeoFenceAssetState } from '../types/geofenceState.types';

export function getMyGeofenceStates() {
  return apiFetch<GeoFenceAssetState[]>('/geofences/states/my-states');
}

export function getGeofenceStatesByAssetId(asset_id: number) {
  return apiFetch<GeoFenceAssetState[]>(`/geofences/states/assets/${asset_id}`);
}
