import { useQuery } from '@tanstack/react-query';
import { getAdminStats } from '../api/admin.api';
import type { AdminStats } from '../types/admin.types';

export function useAdminStats() {
  return useQuery<AdminStats>({
    queryKey: ['admin', 'stats'],
    queryFn: getAdminStats,
  });
}
