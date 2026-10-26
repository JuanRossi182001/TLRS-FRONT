import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createAsset,
  deactivateAdminDevice,
  getAdminDevices,
  getAvailableAssets,
  provisionDevice,
  reassignDeviceAsset,
  releaseDeviceAsset,
} from '../api/admin.api';
import type {
  AdminDeviceListItem,
  AdminDeviceUpdateResponse,
  AvailableAsset,
  CreateAssetRequest,
  ProvisionDeviceRequest,
} from '../types/admin.types';

export function useAdminDevices() {
  return useQuery<AdminDeviceListItem[]>({
    queryKey: ['admin', 'devices'],
    queryFn: () => getAdminDevices(),
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

function invalidateProvisioningData(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ['admin', 'devices'] });
  queryClient.invalidateQueries({ queryKey: ['admin', 'available-assets'] });
  queryClient.invalidateQueries({ queryKey: ['admin', 'clients'] });
  queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
  queryClient.invalidateQueries({ queryKey: ['animals', 'my-assets'] });
  queryClient.invalidateQueries({ queryKey: ['devices', 'my-devices'] });
  queryClient.invalidateQueries({ queryKey: ['devices', 'my-devices', 'latest-locations'] });
}

export function useAvailableAssets(client_id: number | null) {
  return useQuery<AvailableAsset[]>({
    queryKey: ['admin', 'available-assets', client_id],
    queryFn: () => getAvailableAssets(client_id as number),
    enabled: client_id !== null,
  });
}

export function useCreateAsset() {
  const queryClient = useQueryClient();

  return useMutation<AvailableAsset, Error, CreateAssetRequest>({
    mutationFn: createAsset,
    onSuccess: () => invalidateProvisioningData(queryClient),
  });
}

export function useProvisionDevice() {
  const queryClient = useQueryClient();
  const [isPending, setIsPending] = useState(false);

  async function provision(payload: ProvisionDeviceRequest) {
    setIsPending(true);

    try {
      const device = await provisionDevice(payload);
      invalidateProvisioningData(queryClient);
      return device;
    } finally {
      setIsPending(false);
    }
  }

  return { isPending, provision };
}

export function useReassignDeviceAsset() {
  const queryClient = useQueryClient();

  return useMutation<AdminDeviceListItem, Error, { device_id: number; asset_id: number }>({
    mutationFn: ({ device_id, asset_id }) => reassignDeviceAsset(device_id, asset_id),
    onSuccess: () => invalidateProvisioningData(queryClient),
  });
}

export function useReleaseDeviceAsset() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: releaseDeviceAsset,
    onSuccess: () => invalidateProvisioningData(queryClient),
  });
}
