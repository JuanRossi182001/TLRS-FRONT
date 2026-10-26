import { normalizeDeviceState } from '../../devices/components/DeviceStateBadge';

type CollarConnectionBadgeProps = {
  state: string;
};

export function CollarConnectionBadge({ state }: CollarConnectionBadgeProps) {
  const normalizedState = normalizeDeviceState(state);
  const config = {
    online: { label: 'Online', className: 'bg-emerald-50 text-brand-success ring-brand-success/20' },
    offline: { label: 'Sin conexion', className: 'bg-red-50 text-brand-danger ring-brand-danger/20' },
    unknown: { label: 'Sin conexion', className: 'bg-brand-surfaceSoft text-brand-muted ring-brand-border' },
  }[normalizedState];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${config.className}`}>
      <span aria-hidden="true">{normalizedState === 'online' ? '●' : '○'}</span>
      {config.label}
    </span>
  );
}
