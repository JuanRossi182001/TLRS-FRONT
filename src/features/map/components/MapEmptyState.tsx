import { EmptyState } from '../../../shared/components';

export function MapEmptyState() {
  return (
    <div className="flex min-h-[420px] flex-1 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white p-4">
      <EmptyState
        title="No hay ubicaciones registradas"
        message="Cuando tus dispositivos envien datos GPS, apareceran en el mapa."
      />
    </div>
  );
}
