import { useQuery } from '@tanstack/react-query';
import { getMyGeofenceStates } from '../api/geofenceStates.api';
import type { GeoFenceAssetState } from '../types/geofenceState.types';

type UseGeofenceStatesOptions = {
  refetch_interval?: number | false;
};

export function useGeofenceStates(options: UseGeofenceStatesOptions = {}) {
  return useQuery<GeoFenceAssetState[]>({
    queryKey: ['geofences', 'states', 'my-states'],
    queryFn: getMyGeofenceStates,
    staleTime: 10_000,
    refetchInterval: options.refetch_interval ?? 15_000,
  });
}
