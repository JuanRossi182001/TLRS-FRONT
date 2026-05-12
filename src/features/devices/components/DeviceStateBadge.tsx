import type { DeviceState } from '../types/device.types';

type DeviceStateBadgeProps = {
  state: DeviceState;
};

const stateConfig: Record<DeviceState, { label: string; className: string }> = {
  online: {
    label: 'Online',
    className: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  },
  offline: {
    label: 'Offline',
    className: 'bg-red-50 text-red-700 ring-red-600/20',
  },
  unknown: {
    label: 'Unknown',
    className: 'bg-slate-100 text-slate-700 ring-slate-500/20',
  },
};

export function DeviceStateBadge({ state }: DeviceStateBadgeProps) {
  const config = stateConfig[state];

  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset',
        config.className,
      ].join(' ')}
    >
      {config.label}
    </span>
  );
}
