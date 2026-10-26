import { useQuery } from '@tanstack/react-query';
import { getAllMyDevices } from '../api/devices.api';
import type { Device } from '../types/device.types';

export function useAllMyDevices() {
  return useQuery<Device[]>({
    queryKey: ['devices', 'my-devices', 'all'],
    queryFn: getAllMyDevices,
  });
}
