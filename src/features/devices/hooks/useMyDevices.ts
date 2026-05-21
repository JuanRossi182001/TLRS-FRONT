import { useQuery } from '@tanstack/react-query';
import { getMyDevices } from '../api/devices.api';
import type { Device } from '../types/device.types';

export function useMyDevices() {
  return useQuery<Device[]>({
    queryKey: ['devices', 'my-devices'],
    queryFn: getMyDevices,
  });
}
