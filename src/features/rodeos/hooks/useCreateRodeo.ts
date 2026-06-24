import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createRodeo } from '../api/rodeos.api';
import type { RodeoCreate } from '../types/rodeo.types';

export function useCreateRodeo() {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, RodeoCreate>({
    mutationFn: createRodeo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rodeos'] });
      queryClient.invalidateQueries({ queryKey: ['geofences'] });
    },
  });
}
