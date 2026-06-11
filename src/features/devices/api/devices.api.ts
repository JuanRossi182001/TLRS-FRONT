import { apiFetch } from '../../../shared/api/httpClient';
import {
  mapDeviceFromApi,
  mapMyDevicesStatsFromApi,
  type MyDevicesApiResponse,
  type MyDevicesResponse,
} from '../types/device.types';

export type GetMyDevicesParams = {
  skip?: number;
  limit?: number;
};

export async function getMyDevices({ skip = 0, limit = 100 }: GetMyDevicesParams = {}): Promise<MyDevicesResponse> {
  const searchParams = new URLSearchParams({
    skip: String(skip),
    limit: String(Math.min(limit, 500)),
  });
  const response = await apiFetch<MyDevicesApiResponse>(`/devices/my-devices?${searchParams.toString()}`);

  return {
    total: response.total,
    skip: response.skip,
    limit: response.limit,
    stats: mapMyDevicesStatsFromApi(response.stats),
    items: response.items.map(mapDeviceFromApi),
  };
}
