import type { ReactNode } from 'react';

type PageHeaderProps = {
  title: ReactNode;
  description?: string;
  actions?: ReactNode;
};

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between lg:gap-4">
      <div>
        <h1 className="text-2xl font-semibold leading-8 tracking-tight text-brand-text lg:text-3xl lg:leading-9">{title}</h1>
        {description ? (
          <p className="mt-1 max-w-2xl text-sm leading-5 text-brand-muted lg:mt-2 lg:leading-6">{description}</p>
        ) : null}
      </div>

      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
