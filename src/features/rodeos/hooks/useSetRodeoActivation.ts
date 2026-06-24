import { useMutation, useQueryClient } from '@tanstack/react-query';
import { setRodeoActivation } from '../api/rodeos.api';
import type { RodeoActivationUpdate } from '../types/rodeo.types';

type SetRodeoActivationVariables = {
  id_asset_group: number;
  payload: RodeoActivationUpdate;
};

export function useSetRodeoActivation() {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, SetRodeoActivationVariables>({
    mutationFn: ({ id_asset_group, payload }) => setRodeoActivation(id_asset_group, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['rodeos'] });
      queryClient.invalidateQueries({ queryKey: ['rodeos', variables.id_asset_group] });
      queryClient.invalidateQueries({ queryKey: ['geofences'] });
    },
  });
}
