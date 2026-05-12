type LoadingStateProps = {
  message?: string;
};

export function LoadingState({ message = 'Cargando...' }: LoadingStateProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600">
      {message}
    </div>
  );
}
