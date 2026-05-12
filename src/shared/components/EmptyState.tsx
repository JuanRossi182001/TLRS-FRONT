type EmptyStateProps = {
  title: string;
  message?: string;
};

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center">
      <h2 className="text-base font-semibold text-slate-900">{title}</h2>
      {message ? <p className="mt-1 text-sm text-slate-600">{message}</p> : null}
    </div>
  );
}
