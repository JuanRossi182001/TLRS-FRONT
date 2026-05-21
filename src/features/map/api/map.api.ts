import { apiFetch } from '../../../shared/api/httpClient';
import type { DeviceLatestLocation } from '../types/map.types';

export function getMyDevicesLatestLocations(): Promise<DeviceLatestLocation[]> {
  return apiFetch<DeviceLatestLocation[]>('/devices/my-devices/latest-locations');
}
