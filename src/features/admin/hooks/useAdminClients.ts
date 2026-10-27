import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createAdminClient,
  deleteAdminClient,
  getAdminClient,
  getAdminClients,
  updateAdminClient,
} from '../api/admin.api';
import type {
  AdminClient,
  AdminClientCreateRequest,
  AdminClientDetails,
  AdminClientUpdateRequest,
} from '../types/admin.types';

export function useAdminClients() {
  return useQuery<AdminClient[]>({
    queryKey: ['admin', 'clients'],
    queryFn: getAdminClients,
  });
}

export function useAdminClient(client_id?: number) {
  return useQuery<AdminClientDetails>({
    queryKey: ['admin', 'clients', client_id],
    queryFn: () => getAdminClient(client_id as number),
    enabled: Boolean(client_id),
  });
}

function invalidateAdminClientData(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ['admin', 'clients'] });
  queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
}

export function useCreateAdminClient() {
  const queryClient = useQueryClient();
  return useMutation<AdminClientDetails, Error, AdminClientCreateRequest>({
    mutationFn: createAdminClient,
    onSuccess: () => invalidateAdminClientData(queryClient),
  });
}

export function useUpdateAdminClient() {
  const queryClient = useQueryClient();
  return useMutation<
    AdminClientDetails,
    Error,
    { client_id: number; payload: AdminClientUpdateRequest }
  >({
    mutationFn: ({ client_id, payload }) => updateAdminClient(client_id, payload),
    onSuccess: (client) => {
      queryClient.setQueryData(['admin', 'clients', client.id_client], client);
      invalidateAdminClientData(queryClient);
    },
  });
}

export function useDeleteAdminClient() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: deleteAdminClient,
    onSuccess: (_, client_id) => {
      queryClient.removeQueries({ queryKey: ['admin', 'clients', client_id] });
      invalidateAdminClientData(queryClient);
    },
  });
}
