import { apiFetch } from '../../../shared/api/httpClient';
import type { GeoFenceEventRead } from '../types/alert.types';

export function getMyGeofenceEvents(params: { skip?: number; limit?: number } = {}) {
  const skip = params.skip ?? 0;
  const limit = params.limit ?? 100;

  return apiFetch<GeoFenceEventRead[]>(
    `/geofences/events/my-events?skip=${skip}&limit=${limit}`,
  );
}
