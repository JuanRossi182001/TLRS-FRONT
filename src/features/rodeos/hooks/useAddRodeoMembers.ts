import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addRodeoMembers } from '../api/rodeos.api';
import type { RodeoMembersPayload } from '../types/rodeo.types';

type AddRodeoMembersVariables = {
  id_asset_group: number;
  payload: RodeoMembersPayload;
};

export function useAddRodeoMembers() {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, AddRodeoMembersVariables>({
    mutationFn: ({ id_asset_group, payload }) => addRodeoMembers(id_asset_group, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['rodeos'] });
      queryClient.invalidateQueries({ queryKey: ['rodeos', variables.id_asset_group] });
      queryClient.invalidateQueries({ queryKey: ['geofences'] });
    },
  });
}
