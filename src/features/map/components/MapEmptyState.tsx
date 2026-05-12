import { EmptyState } from '../../../shared/components';

export function MapEmptyState() {
  return (
    <div className="flex min-h-[420px] flex-1 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white p-4">
      <EmptyState
        title="Sin ubicaciones para mostrar"
        message="Los devices mock no tienen una ultima location registrada."
      />
    </div>
  );
}
