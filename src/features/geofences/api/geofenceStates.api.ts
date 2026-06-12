import { apiFetch } from '../../../shared/api/httpClient';
import {
  mapMyGeofenceStatesResponseFromApi,
  type GeoFenceAssetState,
  type MyGeofenceStatesApiResponse,
  type MyGeofenceStatesResponse,
} from '../types/geofenceState.types';

const geofenceStatesPageLimit = 500;

export type GetMyGeofenceStatesParams = {
  skip?: number;
  limit?: number;
};

export async function getMyGeofenceStatesPage({
  skip = 0,
  limit = 100,
}: GetMyGeofenceStatesParams = {}): Promise<MyGeofenceStatesResponse> {
  const searchParams = new URLSearchParams({
    skip: String(skip),
    limit: String(Math.min(limit, geofenceStatesPageLimit)),
  });
  const response = await apiFetch<MyGeofenceStatesApiResponse>(
    `/geofences/states/my-states?${searchParams.toString()}`,
  );

  return mapMyGeofenceStatesResponseFromApi(response);
}

export async function getMyGeofenceStates() {
  let skip = 0;
  let total = 0;
  const states: GeoFenceAssetState[] = [];

  do {
    const response = await getMyGeofenceStatesPage({
      skip,
      limit: geofenceStatesPageLimit,
    });

    total = response.total;
    states.push(...response.items);
    skip += response.items.length;

    if (response.items.length === 0) {
      break;
    }
  } while (skip < total);

  return states;
}

export function getGeofenceStatesByAssetId(asset_id: number) {
  return apiFetch<GeoFenceAssetState[]>(`/geofences/states/assets/${asset_id}`);
}
