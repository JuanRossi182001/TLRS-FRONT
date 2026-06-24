import { apiFetch } from '../../../shared/api/httpClient';
import type {
  GeoFenceActivationUpdate,
  GeoFenceAssignmentCreate,
  GeoFenceAssignmentRead,
  GeoFenceAssetGroupAssignmentPayload,
  GeoFenceCreate,
  GeoFenceDetailRead,
  GeoFenceRead,
  GeoFenceUpdate,
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

export function getGeofence(geofence_id: number) {
  return apiFetch<GeoFenceDetailRead>(`/geofences/${geofence_id}`);
}

export function updateGeofence(geofence_id: number, payload: GeoFenceUpdate) {
  return apiFetch<GeoFenceRead>(`/geofences/${geofence_id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function setGeofenceActivation(
  geofence_id: number,
  payload: GeoFenceActivationUpdate,
) {
  return apiFetch<GeoFenceRead>(`/geofences/${geofence_id}/activation`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function getGeofenceAssignments(geofence_id: number) {
  return apiFetch<GeoFenceAssignmentRead[]>(`/geofences/${geofence_id}/assignments`);
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

export function deactivateGeofenceAssignment(assignment_id: number) {
  return apiFetch<GeoFenceAssignmentRead>(
    `/geofences/assignments/${assignment_id}/deactivate`,
    {
      method: 'PATCH',
    },
  );
}

export function assignAssetGroupsToGeofence(
  geofence_id: number,
  payload: GeoFenceAssetGroupAssignmentPayload,
) {
  return apiFetch<unknown>(`/geofences/${geofence_id}/asset-groups`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function removeAssetGroupsFromGeofence(
  geofence_id: number,
  payload: GeoFenceAssetGroupAssignmentPayload,
) {
  return apiFetch<unknown>(`/geofences/${geofence_id}/asset-groups`, {
    method: 'DELETE',
    body: JSON.stringify(payload),
  });
}
