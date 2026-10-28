import { useQuery } from '@tanstack/react-query';
import { getAdminDeviceQrToken } from '../api/admin.api';

export function useAdminDeviceQrToken(deviceId: number) {
  return useQuery({
    queryKey: ['admin', 'device-qr', deviceId],
    queryFn: () => getAdminDeviceQrToken(deviceId),
    staleTime: Infinity,
    enabled: deviceId > 0,
    retry: false,
  });
}
