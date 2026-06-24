import { useMutation, useQueryClient } from '@tanstack/react-query';
import { assignAssetsToGeofence } from '../api/geofences.api';
import type {
  GeoFenceAssignmentCreate,
  GeoFenceAssignmentRead,
} from '../types/geofence.types';

type AssignAssetsVariables = {
  geofence_id: number;
  payload: GeoFenceAssignmentCreate;
};

export function useAssignAssetsToGeofence() {
  const queryClient = useQueryClient();

  return useMutation<GeoFenceAssignmentRead[], Error, AssignAssetsVariables>({
    mutationFn: ({ geofence_id, payload }) => assignAssetsToGeofence(geofence_id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['geofences', 'my-geofences'] });
      queryClient.invalidateQueries({ queryKey: ['geofences', variables.geofence_id, 'detail'] });
      queryClient.invalidateQueries({
        queryKey: ['geofences', variables.geofence_id, 'assignments'],
      });
    },
  });
}
