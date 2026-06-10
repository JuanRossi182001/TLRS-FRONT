import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateGeofence } from '../api/geofences.api';
import type { GeoFenceRead, GeoFenceUpdate } from '../types/geofence.types';

type UpdateGeofenceVariables = {
  geofence_id: number;
  payload: GeoFenceUpdate;
};

export function useUpdateGeofence() {
  const queryClient = useQueryClient();

  return useMutation<GeoFenceRead, Error, UpdateGeofenceVariables>({
    mutationFn: ({ geofence_id, payload }) => updateGeofence(geofence_id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['geofences', 'my-geofences'] });
    },
  });
}
