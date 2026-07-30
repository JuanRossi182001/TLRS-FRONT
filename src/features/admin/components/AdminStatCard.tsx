import { StatCard } from '../../../shared/components';

type AdminStatCardProps = {
  label: string;
  value: number;
  tone?: 'primary' | 'accent' | 'default';
};

export function AdminStatCard({ label, value, tone = 'default' }: AdminStatCardProps) {
  return <StatCard label={label} tone={tone} value={value} />;
}
