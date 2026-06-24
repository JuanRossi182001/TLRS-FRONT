import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removeRodeoMembers } from '../api/rodeos.api';
import type { RodeoMembersPayload } from '../types/rodeo.types';

type RemoveRodeoMembersVariables = {
  id_asset_group: number;
  payload: RodeoMembersPayload;
};

export function useRemoveRodeoMembers() {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, RemoveRodeoMembersVariables>({
    mutationFn: ({ id_asset_group, payload }) => removeRodeoMembers(id_asset_group, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['rodeos'] });
      queryClient.invalidateQueries({ queryKey: ['rodeos', variables.id_asset_group] });
      queryClient.invalidateQueries({ queryKey: ['geofences'] });
    },
  });
}
