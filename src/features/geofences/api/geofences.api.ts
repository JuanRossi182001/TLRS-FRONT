import { apiFetch } from '../../../shared/api/httpClient';
import type {
  GeoFenceAssignmentCreate,
  GeoFenceAssignmentRead,
  GeoFenceCreate,
  GeoFenceRead,
} from '../types/geofence.types';

export function getMyGeofences(params: { skip?: number; limit?: number } = {}) {
  const skip = params.skip ?? 0;
  const limit = params.limit ?? 100;

  return apiFetch<GeoFenceRead[]>(`/geofences/my-geofences?skip=${skip}&limit=${limit}`);
}

export function createGeofence(payload: GeoFenceCreate) {
  return apiFetch<GeoFenceRead>('/geofences', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function assignAssetsToGeofence(
  geofence_id: number,
  payload: GeoFenceAssignmentCreate,
) {
  return apiFetch<GeoFenceAssignmentRead[]>(`/geofences/${geofence_id}/assignments`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
