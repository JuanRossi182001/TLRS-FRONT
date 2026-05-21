import { Link } from 'react-router-dom';
import { Card } from '../../../shared/components';

type AdminSectionCardProps = {
  title: string;
  description: string;
  to: string;
};

export function AdminSectionCard({ title, description, to }: AdminSectionCardProps) {
  return (
    <Card className="transition hover:-translate-y-0.5 hover:shadow-md hover:shadow-brand-primary/10">
      <h2 className="text-xl font-semibold tracking-tight text-brand-text">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-brand-muted">{description}</p>
      <Link
        to={to}
        className="mt-5 inline-flex rounded-full bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-primaryDark"
      >
        Abrir
      </Link>
    </Card>
  );
}
