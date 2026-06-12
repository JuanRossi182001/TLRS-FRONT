import { useQuery } from '@tanstack/react-query';
import {
  getMyGeofenceStates,
  getMyGeofenceStatesPage,
  type GetMyGeofenceStatesParams,
} from '../api/geofenceStates.api';
import type { GeoFenceAssetState, MyGeofenceStatesResponse } from '../types/geofenceState.types';

type UseGeofenceStatesOptions = {
  refetch_interval?: number | false;
};

type UsePaginatedGeofenceStatesOptions = UseGeofenceStatesOptions & GetMyGeofenceStatesParams;

export function useGeofenceStates(options: UseGeofenceStatesOptions = {}) {
  return useQuery<GeoFenceAssetState[]>({
    queryKey: ['geofences', 'states', 'my-states'],
    queryFn: getMyGeofenceStates,
    staleTime: 10_000,
    refetchInterval: options.refetch_interval ?? 15_000,
  });
}

export function usePaginatedGeofenceStates(options: UsePaginatedGeofenceStatesOptions = {}) {
  const { skip = 0, limit = 100, refetch_interval } = options;

  return useQuery<MyGeofenceStatesResponse>({
    queryKey: ['geofences', 'states', 'my-states', skip, limit],
    queryFn: () => getMyGeofenceStatesPage({ skip, limit }),
    staleTime: 10_000,
    refetchInterval: refetch_interval ?? 15_000,
    placeholderData: (previousData) => previousData,
  });
}
