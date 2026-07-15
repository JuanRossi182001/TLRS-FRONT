type GeofencePanelHeaderProps = {
  title: string;
  description: string;
  points_count: number;
  mode?: 'desktop' | 'mobile';
};

export function GeofencePanelHeader({
  title,
  description,
  points_count,
  mode = 'desktop',
}: GeofencePanelHeaderProps) {
  const is_mobile = mode === 'mobile';

  return (
    <div className="flex flex-col gap-1">
      <h2 className="text-lg font-semibold text-brand-text">{title}</h2>
      <p className="text-sm leading-6 text-brand-muted">{description}</p>

      {is_mobile ? (
        <div className="mt-3 rounded-2xl border border-dashed border-brand-border bg-brand-surfaceSoft px-4 py-3 text-sm text-brand-muted">
          <span className="block font-semibold text-brand-text">Puntos marcados</span>
          <span>{points_count} puntos en el mapa.</span>
        </div>
      ) : null}
    </div>
  );
}
