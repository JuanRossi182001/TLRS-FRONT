import type { FenceEventType } from '../types/alert.types';

type AlertEventTypeBadgeProps = {
  event_type: FenceEventType;
};

const eventTypeConfig: Record<FenceEventType, { label: string; className: string }> = {
  EXITED: {
    label: 'Salida',
    className: 'bg-red-50 text-brand-danger ring-red-200',
  },
  NEAR_LIMIT: {
    label: 'Cerca del limite',
    className: 'bg-amber-50 text-brand-accentDark ring-amber-200',
  },
  GPS_UNCERTAIN: {
    label: 'GPS incierto',
    className: 'bg-yellow-50 text-brand-accentDark ring-yellow-200',
  },
  ENTERED: {
    label: 'Entrada',
    className: 'bg-emerald-50 text-brand-success ring-emerald-200',
  },
  RETURNED: {
    label: 'Retorno',
    className: 'bg-emerald-50 text-brand-success ring-emerald-200',
  },
};

export function AlertEventTypeBadge({ event_type }: AlertEventTypeBadgeProps) {
  const config = eventTypeConfig[event_type] ?? {
    label: event_type,
    className: 'bg-brand-surfaceSoft text-brand-primary ring-brand-border/60',
  };

  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset',
        config.className,
      ].join(' ')}
    >
      {config.label}
    </span>
  );
}
