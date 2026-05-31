import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deactivateAdminDevice, getAdminDevices } from '../api/admin.api';
import type { AdminDeviceListItem, AdminDeviceUpdateResponse } from '../types/admin.types';

export function useAdminDevices() {
  return useQuery<AdminDeviceListItem[]>({
    queryKey: ['admin', 'devices'],
    queryFn: getAdminDevices,
  });
}

export function useDeactivateAdminDevice() {
  const queryClient = useQueryClient();

  return useMutation<AdminDeviceUpdateResponse, Error, number>({
    mutationFn: deactivateAdminDevice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'devices'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
  });
}
