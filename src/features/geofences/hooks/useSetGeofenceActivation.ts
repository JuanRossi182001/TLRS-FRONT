import { useMutation, useQueryClient } from '@tanstack/react-query';
import { setGeofenceActivation } from '../api/geofences.api';
import type { GeoFenceActivationUpdate, GeoFenceRead } from '../types/geofence.types';

type SetGeofenceActivationVariables = {
  geofence_id: number;
  payload: GeoFenceActivationUpdate;
};

export function useSetGeofenceActivation() {
  const queryClient = useQueryClient();

    return useMutation<GeoFenceRead, Error, SetGeofenceActivationVariables>({
    mutationFn: ({ geofence_id, payload }) => setGeofenceActivation(geofence_id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['geofences', 'my-geofences'] });
      queryClient.invalidateQueries({ queryKey: ['geofences', variables.geofence_id, 'detail'] });
    },
  });
}
