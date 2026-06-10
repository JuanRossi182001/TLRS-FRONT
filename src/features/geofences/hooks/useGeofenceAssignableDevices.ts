import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../../../shared/api/httpClient';
import type { DeviceApiResponse, MyDevicesApiResponse } from '../../devices/types/device.types';

export function useGeofenceAssignableDevices(enabled = true) {
  return useQuery<DeviceApiResponse[]>({
    queryKey: ['geofences', 'assignable-devices'],
    queryFn: async () => {
      const response = await apiFetch<MyDevicesApiResponse>('/devices/my-devices?skip=0&limit=100');

      return response.items;
    },
    enabled,
  });
}
