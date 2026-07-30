import { Link } from 'react-router-dom';
import { Card } from '../../../shared/components';

type AdminSectionCardProps = {
  title: string;
  description: string;
  to: string;
  icon: LucideIcon;
};

export function AdminSectionCard({ title, description, to, icon: Icon }: AdminSectionCardProps) {
  return (
    <Card className="p-0 transition hover:-translate-y-0.5 hover:shadow-md hover:shadow-brand-primary/10">
      <Link to={to} className="flex min-h-[72px] items-center gap-3 p-3 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-primary/30 lg:block lg:min-h-0 lg:p-6">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary lg:hidden">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1 lg:block">
          <span className="block text-base font-semibold tracking-tight text-brand-text lg:text-xl">{title}</span>
          <span className="mt-0.5 block text-sm leading-5 text-brand-muted lg:mt-2 lg:leading-6">{description}</span>
        </span>
        <ChevronRight className="h-5 w-5 shrink-0 text-brand-muted lg:hidden" aria-hidden="true" />
        <span className="mt-5 hidden rounded-full bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white lg:inline-flex">Abrir</span>
      </Link>
    </Card>
  );
}
import { ChevronRight, type LucideIcon } from 'lucide-react';
