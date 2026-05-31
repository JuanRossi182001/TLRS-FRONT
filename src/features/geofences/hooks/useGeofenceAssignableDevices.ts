import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../../../shared/api/httpClient';
import type { DeviceApiResponse } from '../../devices/types/device.types';

export function useGeofenceAssignableDevices() {
  return useQuery<DeviceApiResponse[]>({
    queryKey: ['geofences', 'assignable-devices'],
    queryFn: () => apiFetch<DeviceApiResponse[]>('/devices/my-devices'),
  });
}
