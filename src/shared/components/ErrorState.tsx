type ErrorStateProps = {
  title?: string;
  message?: string;
};

export function ErrorState({
  title = 'Ocurrio un error',
  message = 'No pudimos completar la accion solicitada.',
}: ErrorStateProps) {
  return (
    <div className="rounded-3xl border border-red-200 bg-red-50 p-6 shadow-sm">
      <h2 className="text-base font-semibold text-brand-danger">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-red-700">{message}</p>
    </div>
  );
}
