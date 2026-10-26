import { useMutation, useQueryClient } from '@tanstack/react-query';
import { setGeofenceActivation } from '../api/geofences.api';
import type { GeoFenceActivationUpdate, GeoFenceRead } from '../types/geofence.types';

type SetGeofenceActivationVariables = {
  geofence_id: number;
  payload: GeoFenceActivationUpdate;
};

export function useSetGeofenceActivation() {
  const queryClient = useQueryClient();
  const queryKey = ['geofences', 'my-geofences'] as const;

  return useMutation<GeoFenceRead, Error, SetGeofenceActivationVariables, { previousActive?: boolean }>({
    mutationFn: ({ geofence_id, payload }) => setGeofenceActivation(geofence_id, payload),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey });

      const previousActive = queryClient
        .getQueryData<GeoFenceRead[]>(queryKey)
        ?.find((geofence) => geofence.id_geofence === variables.geofence_id)?.active;

      queryClient.setQueryData<GeoFenceRead[]>(queryKey, (geofences) =>
        geofences?.map((geofence) =>
          geofence.id_geofence === variables.geofence_id
            ? { ...geofence, active: variables.payload.active }
            : geofence,
        ),
      );

      return { previousActive };
    },
    onError: (_error, _variables, context) => {
      const previousActive = context?.previousActive;

      if (typeof previousActive === 'boolean') {
        queryClient.setQueryData<GeoFenceRead[]>(queryKey, (geofences) =>
          geofences?.map((geofence) =>
            geofence.id_geofence === _variables.geofence_id
              ? { ...geofence, active: previousActive }
              : geofence,
          ),
        );
      }
    },
    onSuccess: (geofence, variables) => {
      queryClient.setQueryData<GeoFenceRead[]>(queryKey, (geofences) =>
        geofences?.map((currentGeofence) =>
          currentGeofence.id_geofence === geofence.id_geofence ? geofence : currentGeofence,
        ),
      );
      queryClient.invalidateQueries({ queryKey: ['geofences', variables.geofence_id, 'detail'] });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
