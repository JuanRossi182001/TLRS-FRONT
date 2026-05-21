import { RadioTower } from 'lucide-react';
import type { DeviceLatestLocation } from '../types/map.types';

type DeviceMapMarkerProps = {
  device: DeviceLatestLocation;
  isSelected: boolean;
  onClick: () => void;
};

export function DeviceMapMarker({ device, isSelected, onClick }: DeviceMapMarkerProps) {
  return (
    <button
      type="button"
      aria-label={`Seleccionar device ${device.name}`}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      className={[
        'flex h-11 w-11 items-center justify-center rounded-full text-white shadow-xl ring-4 transition',
        device.active ? 'bg-brand-success ring-emerald-100' : 'bg-brand-muted ring-white',
        isSelected ? 'scale-110' : 'hover:scale-105',
      ].join(' ')}
    >
      <RadioTower className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}
