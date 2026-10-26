import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reassignDeviceAsset, releaseDeviceAsset } from '../../admin/api/admin.api';

function invalidateCollarData(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ['animals', 'my-assets'] });
  queryClient.invalidateQueries({ queryKey: ['devices', 'my-devices'] });
  queryClient.invalidateQueries({ queryKey: ['devices', 'my-devices', 'latest-locations'] });
  queryClient.invalidateQueries({ queryKey: ['rodeos'] });
  queryClient.invalidateQueries({ queryKey: ['admin', 'devices'] });
  queryClient.invalidateQueries({ queryKey: ['admin', 'available-assets'] });
}

export function useAssignCollar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ deviceId, assetId }: { deviceId: number; assetId: number }) =>
      reassignDeviceAsset(deviceId, assetId),
    onSuccess: () => invalidateCollarData(queryClient),
  });
}

export function useReleaseCollar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (deviceId: number) => releaseDeviceAsset(deviceId),
    onSuccess: () => invalidateCollarData(queryClient),
  });
}
