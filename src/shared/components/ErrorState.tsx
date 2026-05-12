type ErrorStateProps = {
  title?: string;
  message?: string;
};

export function ErrorState({
  title = 'Ocurrio un error',
  message = 'No pudimos completar la accion solicitada.',
}: ErrorStateProps) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-6">
      <h2 className="text-base font-semibold text-red-900">{title}</h2>
      <p className="mt-1 text-sm text-red-700">{message}</p>
    </div>
  );
}
