import { Card } from './Card';

type StatCardProps = {
  label: string;
  value: number | string;
  tone?: 'default' | 'primary' | 'accent' | 'success' | 'danger';
  className?: string;
};

const toneClasses = {
  default: 'bg-brand-surface text-brand-text',
  primary: 'bg-brand-primary text-white',
  accent: 'bg-brand-accent text-brand-primary',
  success: 'bg-emerald-50 text-brand-success',
  danger: 'bg-red-50 text-brand-danger',
};

export function StatCard({ label, value, tone = 'default', className = '' }: StatCardProps) {
  const labelClassName = tone === 'primary' ? 'text-white/75' : tone === 'default' ? 'text-brand-muted' : 'opacity-75';

  return (
    <Card className={['min-h-[76px] p-3 text-center lg:p-4', toneClasses[tone], className].join(' ')} density="compact">
      <p className={['text-xs font-medium', labelClassName].join(' ')}>{label}</p>
      <p className="mt-1 text-xl font-semibold leading-none lg:text-3xl">{value}</p>
    </Card>
  );
}
