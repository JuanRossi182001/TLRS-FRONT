import { useQuery } from '@tanstack/react-query';
import { getMyDevices, type GetMyDevicesParams } from '../api/devices.api';
import type { MyDevicesResponse } from '../types/device.types';

export function useMyDevices(params: GetMyDevicesParams = {}) {
  const { skip = 0, limit = 100 } = params;

  return useQuery<MyDevicesResponse>({
    queryKey: ['devices', 'my-devices', skip, limit],
    queryFn: () => getMyDevices({ skip, limit }),
    placeholderData: (previousData) => previousData,
  });
}
