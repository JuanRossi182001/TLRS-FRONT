import type { DeviceState } from '../types/device.types';

type DeviceStateBadgeProps = {
  state: string;
};

const stateConfig: Record<DeviceState, { label: string; className: string }> = {
  online: {
    label: 'Online',
    className: 'bg-emerald-50 text-brand-success ring-brand-success/20',
  },
  offline: {
    label: 'Offline',
    className: 'bg-red-50 text-brand-danger ring-brand-danger/20',
  },
  unknown: {
    label: 'Unknown',
    className: 'bg-brand-surfaceSoft text-brand-muted ring-brand-border',
  },
};

export function DeviceStateBadge({ state }: DeviceStateBadgeProps) {
  const normalizedState = normalizeDeviceState(state);
  const config = stateConfig[normalizedState];

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

export function normalizeDeviceState(state: string): DeviceState {
  const value = state.trim().toLowerCase();

  if (value === 'on' || value === 'online') {
    return 'online';
  }

  if (value === 'off' || value === 'offline') {
    return 'offline';
  }

  return 'unknown';
}
