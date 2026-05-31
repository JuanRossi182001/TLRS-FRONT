import { useQuery } from '@tanstack/react-query';
import { getAdminClients } from '../api/admin.api';
import type { AdminClient } from '../types/admin.types';

export function useAdminClients() {
  return useQuery<AdminClient[]>({
    queryKey: ['admin', 'clients'],
    queryFn: getAdminClients,
  });
}
