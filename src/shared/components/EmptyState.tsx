type EmptyStateProps = {
  title: string;
  message?: string;
};

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <div className="rounded-3xl border border-dashed border-brand-border/80 bg-brand-surface p-8 text-center shadow-sm shadow-brand-primary/5">
      <h2 className="text-lg font-semibold text-brand-text">{title}</h2>
      {message ? <p className="mt-2 text-sm leading-6 text-brand-muted">{message}</p> : null}
    </div>
  );
}
