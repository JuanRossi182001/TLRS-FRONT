import { useQuery } from '@tanstack/react-query';
import { getMyDevicesLatestLocations } from '../api/map.api';
import type { DeviceLatestLocation } from '../types/map.types';

export function useMyDevicesLatestLocations() {
  return useQuery<DeviceLatestLocation[]>({
    queryKey: ['devices', 'my-devices', 'latest-locations'],
    queryFn: getMyDevicesLatestLocations,
    staleTime: 15_000,
    refetchInterval: 15_000,
  });
}
