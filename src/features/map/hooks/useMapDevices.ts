import type { DeviceTrackingItem } from '../../devices/types/device.types';
import type { LocatedDeviceTrackingItem } from '../types/map.types';

function hasLocation(item: DeviceTrackingItem): item is LocatedDeviceTrackingItem {
  return Boolean(item.lastLocation);
}

export function useMapDevices(allDevices: DeviceTrackingItem[]) {
  const devicesWithLocation = allDevices.filter(hasLocation);
  const totalWithLocation = devicesWithLocation.length;
  const totalWithoutLocation = allDevices.length - totalWithLocation;

  return {
    allDevices,
    devicesWithLocation,
    totalWithLocation,
    totalWithoutLocation,
  };
}
