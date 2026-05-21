import { apiFetch } from '../../../shared/api/httpClient';
import {
  mapDeviceFromApi,
  type Device,
  type DeviceApiResponse,
} from '../types/device.types';

export async function getMyDevices(): Promise<Device[]> {
  const response = await apiFetch<DeviceApiResponse[]>('/devices/my-devices');

  return response.map(mapDeviceFromApi);
}
