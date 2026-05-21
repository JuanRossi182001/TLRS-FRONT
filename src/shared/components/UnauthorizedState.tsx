export function UnauthorizedState() {
  return (
    <div className="rounded-3xl border border-brand-border/60 bg-brand-surface p-8 text-center shadow-sm shadow-brand-primary/5">
      <h1 className="text-xl font-semibold text-brand-text">Acceso restringido</h1>
      <p className="mt-2 text-sm leading-6 text-brand-muted">
        No tenes permisos para acceder a esta seccion.
      </p>
    </div>
  );
}
