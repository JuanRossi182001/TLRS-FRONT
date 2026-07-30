import { Button } from '../../../shared/components';

type GeofenceDrawingControlsProps = {
  is_drawing: boolean;
  points_count: number;
  on_start: () => void;
  on_cancel: () => void;
  on_clear: () => void;
  on_continue?: () => void;
  continue_label?: string;
};

export function GeofenceDrawingControls({
  is_drawing,
  points_count,
  on_start,
  on_cancel,
  on_clear,
  on_continue,
  continue_label = 'Continuar',
}: GeofenceDrawingControlsProps) {
  if (!is_drawing) {
    return (
      <Button onClick={on_start} type="button">
        Crear geocerca
      </Button>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="rounded-full bg-brand-accent px-4 py-2 text-sm font-semibold text-brand-primary">
        {points_count} puntos
      </span>
      <Button onClick={on_clear} type="button" variant="secondary">
        Limpiar puntos
      </Button>
      {on_continue && points_count >= 3 ? (
        <Button onClick={on_continue} type="button">
          {continue_label}
        </Button>
      ) : null}
      <Button onClick={on_cancel} type="button" variant="secondary">
        Cancelar
      </Button>
    </div>
  );
}
