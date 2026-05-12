import { RadioTower } from 'lucide-react';
import type { DeviceState } from '../../devices/types/device.types';

type DeviceMapMarkerProps = {
  state: DeviceState;
  isSelected: boolean;
  onClick: () => void;
};

const markerClasses: Record<DeviceState, string> = {
  online: 'bg-emerald-600 ring-emerald-200',
  offline: 'bg-red-600 ring-red-200',
  unknown: 'bg-slate-500 ring-slate-200',
};

export function DeviceMapMarker({ state, isSelected, onClick }: DeviceMapMarkerProps) {
  return (
    <button
      type="button"
      aria-label={`Seleccionar device ${state}`}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      className={[
        'flex h-10 w-10 items-center justify-center rounded-full text-white shadow-lg ring-4 transition',
        markerClasses[state],
        isSelected ? 'scale-110' : 'hover:scale-105',
      ].join(' ')}
    >
      <RadioTower className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}
