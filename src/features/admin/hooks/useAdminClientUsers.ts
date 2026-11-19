import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createAdminUser, deactivateAdminUser, getAdminClientUsers } from '../api/admin.api';
import type { AdminUser, AdminUserInviteRequest, AdminUserInviteResponse } from '../types/admin.types';

export function useAdminClientUsers(client_id?: number) {
  return useQuery<AdminUser[]>({
    queryKey: ['admin', 'clients', client_id, 'users'],
    queryFn: () => getAdminClientUsers(client_id ?? 0),
    enabled: Boolean(client_id),
  });
}

export function useDeactivateAdminUser(client_id?: number) {
  const queryClient = useQueryClient();

  return useMutation<AdminUser, Error, number>({
    mutationFn: deactivateAdminUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'clients', client_id, 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
  });
}

export function useCreateAdminUser(client_id?: number) {
  const queryClient = useQueryClient();

  return useMutation<AdminUserInviteResponse, Error, AdminUserInviteRequest>({
    mutationFn: createAdminUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'clients', client_id, 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
  });
}
