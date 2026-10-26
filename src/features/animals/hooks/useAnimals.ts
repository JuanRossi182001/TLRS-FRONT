import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createAnimal, getMyAssets } from '../api/animals.api';
import type { AssetListItem, CreateAnimalRequest } from '../types/animal.types';

const animalsQueryKey = ['animals', 'my-assets'] as const;

function invalidateAnimalData(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: animalsQueryKey });
  queryClient.invalidateQueries({ queryKey: ['devices', 'my-devices'] });
  queryClient.invalidateQueries({ queryKey: ['devices', 'my-devices', 'latest-locations'] });
  queryClient.invalidateQueries({ queryKey: ['rodeos'] });
  queryClient.invalidateQueries({ queryKey: ['admin', 'devices'] });
  queryClient.invalidateQueries({ queryKey: ['admin', 'available-assets'] });
}

export function useAnimals() {
  return useQuery<AssetListItem[]>({
    queryKey: animalsQueryKey,
    queryFn: getMyAssets,
  });
}

export function useCreateAnimal() {
  const queryClient = useQueryClient();

  return useMutation<AssetListItem, Error, CreateAnimalRequest>({
    mutationFn: createAnimal,
    onSuccess: () => invalidateAnimalData(queryClient),
  });
}

export function useInvalidateAnimalData() {
  const queryClient = useQueryClient();

  return () => invalidateAnimalData(queryClient);
}
