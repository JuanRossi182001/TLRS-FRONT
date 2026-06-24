import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removeAssetGroupsFromGeofence } from '../api/geofences.api';
import type { GeoFenceAssetGroupAssignmentPayload } from '../types/geofence.types';

type RemoveAssetGroupsVariables = {
  geofence_id: number;
  payload: GeoFenceAssetGroupAssignmentPayload;
};

export function useRemoveAssetGroupsFromGeofence() {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, RemoveAssetGroupsVariables>({
    mutationFn: ({ geofence_id, payload }) => removeAssetGroupsFromGeofence(geofence_id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['geofences', 'my-geofences'] });
      queryClient.invalidateQueries({ queryKey: ['geofences', variables.geofence_id, 'detail'] });
    },
  });
}
