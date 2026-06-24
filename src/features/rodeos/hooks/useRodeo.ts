import { useQuery } from '@tanstack/react-query';
import { getRodeo } from '../api/rodeos.api';
import type { RodeoDetail } from '../types/rodeo.types';

export function useRodeo(id_asset_group: number, enabled = true) {
  return useQuery<RodeoDetail>({
    queryKey: ['rodeos', id_asset_group],
    queryFn: () => getRodeo(id_asset_group),
    enabled,
  });
}
