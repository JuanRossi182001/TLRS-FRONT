import { useMutation, useQueryClient } from '@tanstack/react-query';
import { assignAssetGroupsToGeofence } from '../api/geofences.api';
import type { GeoFenceAssetGroupAssignmentPayload } from '../types/geofence.types';

type AssignAssetGroupsVariables = {
  geofence_id: number;
  payload: GeoFenceAssetGroupAssignmentPayload;
};

export function useAssignAssetGroupsToGeofence() {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, AssignAssetGroupsVariables>({
    mutationFn: ({ geofence_id, payload }) => assignAssetGroupsToGeofence(geofence_id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['geofences', 'my-geofences'] });
      queryClient.invalidateQueries({ queryKey: ['geofences', variables.geofence_id, 'detail'] });
    },
  });
}
