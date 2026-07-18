import { RadioTower } from 'lucide-react';
import { getDeviceAssetName } from '../../devices/types/device.types';
import type { DeviceLatestLocation } from '../types/map.types';

type DeviceMapMarkerProps = {
  device: DeviceLatestLocation;
  isSelected: boolean;
  onClick: () => void;
};

export function DeviceMapMarker({
  device,
  isSelected,
  onClick,
}: DeviceMapMarkerProps) {
  const assetLabel = getDeviceAssetName(device, device.serial);

  return (
    <button
      type="button"
      aria-label={`Seleccionar asset ${assetLabel}`}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      className={[
        'flex h-8 w-8 items-center justify-center rounded-full bg-brand-accent text-brand-primary shadow-md ring-2 ring-brand-accentDark/20 transition',
        isSelected ? 'scale-105 shadow-lg ring-brand-accentDark/35' : 'hover:scale-[1.02]',
      ].join(' ')}
    >
      <RadioTower className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}
