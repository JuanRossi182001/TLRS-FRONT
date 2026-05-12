import type { DeviceLocation, DeviceTrackingItem } from '../../devices/types/device.types';

export type LocatedDeviceTrackingItem = DeviceTrackingItem & {
  lastLocation: DeviceLocation;
};
