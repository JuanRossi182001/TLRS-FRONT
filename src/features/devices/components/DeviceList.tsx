import type { Device } from '../types/device.types';
import { DeviceCard } from './DeviceCard';

type DeviceListProps = {
  devices: Device[];
};

export function DeviceList({ devices }: DeviceListProps) {
  return (
    <div className="grid gap-5 xl:grid-cols-2 2xl:grid-cols-3">
      {devices.map((device) => (
        <DeviceCard key={device.idDevice} device={device} />
      ))}
    </div>
  );
}
