import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateRodeo } from '../api/rodeos.api';
import type { RodeoUpdate } from '../types/rodeo.types';

type UpdateRodeoVariables = {
  id_asset_group: number;
  payload: RodeoUpdate;
};

export function useUpdateRodeo() {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, UpdateRodeoVariables>({
    mutationFn: ({ id_asset_group, payload }) => updateRodeo(id_asset_group, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['rodeos'] });
      queryClient.invalidateQueries({ queryKey: ['rodeos', variables.id_asset_group] });
      queryClient.invalidateQueries({ queryKey: ['geofences'] });
    },
  });
}
