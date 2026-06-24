import { apiFetch } from '../../../shared/api/httpClient';
import {
  mapDeviceFromApi,
  mapMyDevicesStatsFromApi,
  type DeviceApiResponse,
  type MyDevicesApiResponse,
  type MyDevicesResponse,
} from '../types/device.types';

export type GetMyDevicesParams = {
  skip?: number;
  limit?: number;
};

const maxDevicesPageLimit = 500;

export async function getAllMyDevicesRaw(): Promise<DeviceApiResponse[]> {
  let skip = 0;
  let total = 0;
  const devices: DeviceApiResponse[] = [];

  do {
    const response = await apiFetch<MyDevicesApiResponse>(
      `/devices/my-devices?skip=${skip}&limit=${maxDevicesPageLimit}`,
    );

    total = response.total;
    devices.push(...response.items);
    skip += response.items.length;

    if (response.items.length === 0) {
      break;
    }
  } while (skip < total);

  return devices;
}

export async function getMyDevices({ skip = 0, limit = 100 }: GetMyDevicesParams = {}): Promise<MyDevicesResponse> {
  const searchParams = new URLSearchParams({
    skip: String(skip),
    limit: String(Math.min(limit, maxDevicesPageLimit)),
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
