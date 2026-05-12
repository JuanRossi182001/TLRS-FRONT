import { useCurrentUser } from '../../auth/hooks/useCurrentUser';
import { devicesMock } from '../mocks/devices.mock';

export function useVisibleDevices() {
  const currentUser = useCurrentUser();

  const visibleDevices =
    currentUser.role === 'admin'
      ? devicesMock
      : devicesMock.filter((item) => item.device.clientId === currentUser.clientId);

  const totalVisible = visibleDevices.length;
  const online = visibleDevices.filter((item) => item.device.state === 'online').length;
  const offline = visibleDevices.filter((item) => item.device.state === 'offline').length;
  const withoutLocation = visibleDevices.filter((item) => !item.lastLocation).length;

  return {
    currentUser,
    visibleDevices,
    totalVisible,
    online,
    offline,
    withoutLocation,
  };
}
