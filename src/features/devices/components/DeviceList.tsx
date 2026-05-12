import type { DeviceTrackingItem } from '../types/device.types';
import { DeviceCard } from './DeviceCard';

type DeviceListProps = {
  items: DeviceTrackingItem[];
};

export function DeviceList({ items }: DeviceListProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {items.map((item) => (
        <DeviceCard key={item.device.idDevice} item={item} />
      ))}
    </div>
  );
}
