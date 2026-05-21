type StatusBadgeTone = 'default' | 'success' | 'warning' | 'danger';

type StatusBadgeProps = {
  label: string;
  tone?: StatusBadgeTone;
};

const toneClasses: Record<StatusBadgeTone, string> = {
  default: 'bg-brand-surfaceSoft text-brand-primary ring-brand-border/60',
  success: 'bg-emerald-50 text-brand-success ring-emerald-200',
  warning: 'bg-amber-50 text-brand-accentDark ring-amber-200',
  danger: 'bg-red-50 text-brand-danger ring-red-200',
};

export function StatusBadge({ label, tone = 'default' }: StatusBadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset',
        toneClasses[tone],
      ].join(' ')}
    >
      {label}
    </span>
  );
}
