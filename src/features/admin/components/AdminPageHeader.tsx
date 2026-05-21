type AdminPageHeaderProps = {
  title: string;
  description: string;
};

export function AdminPageHeader({ title, description }: AdminPageHeaderProps) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-accentDark">
        Administracion interna
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-brand-text">{title}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-brand-muted">{description}</p>
    </div>
  );
}
