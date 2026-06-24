import { useQuery } from '@tanstack/react-query';
import { getMyRodeos } from '../api/rodeos.api';
import type { RodeoSummary } from '../types/rodeo.types';

export function useMyRodeos() {
  return useQuery<RodeoSummary[]>({
    queryKey: ['rodeos', 'my-rodeos'],
    queryFn: getMyRodeos,
  });
}
