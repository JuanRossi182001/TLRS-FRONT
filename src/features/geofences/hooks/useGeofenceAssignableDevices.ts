import { useQuery } from '@tanstack/react-query';
import { getAllMyDevicesRaw } from '../../devices/api/devices.api';
import type { DeviceApiResponse } from '../../devices/types/device.types';

export function useGeofenceAssignableDevices(enabled = true) {
  return useQuery<DeviceApiResponse[]>({
    queryKey: ['geofences', 'assignable-devices'],
    queryFn: getAllMyDevicesRaw,
    enabled,
  });
}
