import { Card } from '../../../shared/components';

type AdminStatCardProps = {
  label: string;
  value: number;
  tone?: 'primary' | 'accent' | 'default';
};

const toneClasses = {
  primary: 'bg-brand-primary text-white',
  accent: 'bg-brand-accent text-brand-primary',
  default: 'bg-brand-surface text-brand-text',
};

export function AdminStatCard({ label, value, tone = 'default' }: AdminStatCardProps) {
  return (
    <Card className={toneClasses[tone]}>
      <p className={tone === 'default' ? 'text-sm font-medium text-brand-muted' : 'text-sm font-medium opacity-75'}>
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold">{value}</p>
    </Card>
  );
}
