import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../../../shared/api/httpClient';
import type { DeviceApiResponse, MyDevicesApiResponse } from '../../devices/types/device.types';

const assignableDevicesPageLimit = 500;

export function useGeofenceAssignableDevices(enabled = true) {
  return useQuery<DeviceApiResponse[]>({
    queryKey: ['geofences', 'assignable-devices'],
    queryFn: async () => {
      let skip = 0;
      let total = 0;
      const devices: DeviceApiResponse[] = [];

      do {
        const response = await apiFetch<MyDevicesApiResponse>(
          `/devices/my-devices?skip=${skip}&limit=${assignableDevicesPageLimit}`,
        );

        total = response.total;
        devices.push(...response.items);
        skip += response.items.length;

        if (response.items.length === 0) {
          break;
        }
      } while (skip < total);

      return devices;
    },
    enabled,
  });
}
