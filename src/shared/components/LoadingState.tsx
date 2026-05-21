type LoadingStateProps = {
  message?: string;
};

export function LoadingState({ message = 'Cargando...' }: LoadingStateProps) {
  return (
    <div className="rounded-3xl border border-brand-border/60 bg-brand-surface p-6 text-sm font-medium text-brand-muted shadow-sm shadow-brand-primary/5">
      {message}
    </div>
  );
}
