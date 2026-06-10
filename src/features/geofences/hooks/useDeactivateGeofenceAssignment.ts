import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deactivateGeofenceAssignment } from '../api/geofences.api';
import type { GeoFenceAssignmentRead } from '../types/geofence.types';

type DeactivateAssignmentVariables = {
  assignment_id: number;
  geofence_id: number;
};

export function useDeactivateGeofenceAssignment() {
  const queryClient = useQueryClient();

  return useMutation<GeoFenceAssignmentRead, Error, DeactivateAssignmentVariables>({
    mutationFn: ({ assignment_id }) => deactivateGeofenceAssignment(assignment_id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['geofences', variables.geofence_id, 'assignments'] });
      queryClient.invalidateQueries({ queryKey: ['geofences', 'my-geofences'] });
    },
  });
}
