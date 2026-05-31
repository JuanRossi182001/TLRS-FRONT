import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createGeofence } from '../api/geofences.api';
import type { GeoFenceCreate, GeoFenceRead } from '../types/geofence.types';

export function useCreateGeofence() {
  const queryClient = useQueryClient();

  return useMutation<GeoFenceRead, Error, GeoFenceCreate>({
    mutationFn: createGeofence,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['geofences', 'my-geofences'] });
    },
  });
}
