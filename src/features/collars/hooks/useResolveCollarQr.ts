import { useQuery } from '@tanstack/react-query';
import { resolveDeviceByQrToken } from '../../devices/api/devices.api';

export function useResolveCollarQr(token: string) {
  return useQuery({
    queryKey: ['devices', 'qr', token],
    queryFn: () => resolveDeviceByQrToken(token),
    enabled: Boolean(token),
    staleTime: 0,
    refetchOnMount: 'always',
    retry: false,
  });
}
