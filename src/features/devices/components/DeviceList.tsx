import type { Device } from '../types/device.types';
import { DeviceCard } from './DeviceCard';

type DeviceListProps = {
  devices: Device[];
};

export function DeviceList({ devices }: DeviceListProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 xl:gap-2">
      {devices.map((device) => (
        <DeviceCard key={device.idDevice} device={device} />
      ))}
    </div>
  );
}
