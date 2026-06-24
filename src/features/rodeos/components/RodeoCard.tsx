import { Link } from 'react-router-dom';
import { Button, Card, StatusBadge } from '../../../shared/components';
import { formatArgentinaDateTime } from '../../../shared/utils/dateTime';
import { useSetRodeoActivation } from '../hooks/useSetRodeoActivation';
import type { RodeoSummary } from '../types/rodeo.types';

type RodeoCardProps = {
  rodeo: RodeoSummary;
};

function getRodeoErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'No pudimos actualizar el rodeo.';
}

export function RodeoCard({ rodeo }: RodeoCardProps) {
  const setRodeoActivation = useSetRodeoActivation();

  async function handleActivationToggle() {
    try {
      await setRodeoActivation.mutateAsync({
        id_asset_group: rodeo.id_asset_group,
        payload: { active: !rodeo.active },
      });
    } catch {
      return;
    }
  }

  const isActivationTarget = setRodeoActivation.variables?.id_asset_group === rodeo.id_asset_group;
  const isUpdating = setRodeoActivation.isPending && isActivationTarget;

  return (
    <Card className="space-y-4 p-5 xl:p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="truncate text-xl font-semibold text-brand-text xl:text-lg">{rodeo.name}</h2>
          <p className="mt-1 text-sm leading-6 text-brand-muted xl:text-xs xl:leading-5">
            {rodeo.description || 'Sin descripcion'}
          </p>
        </div>

        <StatusBadge label={rodeo.active ? 'Activo' : 'Inactivo'} tone={rodeo.active ? 'success' : 'default'} />
      </div>

      <div className="grid gap-2 text-sm text-brand-muted sm:grid-cols-3 xl:text-xs">
        <div className="rounded-2xl bg-brand-surfaceSoft p-4 xl:p-3">
          <span className="font-semibold text-brand-text">Animales</span>
          <p className="mt-1 text-lg font-semibold text-brand-primary xl:text-base">{rodeo.total_assets}</p>
        </div>

        <div className="rounded-2xl bg-brand-surfaceSoft p-4 xl:p-3">
          <span className="font-semibold text-brand-text">Creado</span>
          <p className="mt-1">{formatArgentinaDateTime(rodeo.created_at)}</p>
        </div>

        <div className="rounded-2xl bg-brand-surfaceSoft p-4 xl:p-3">
          <span className="font-semibold text-brand-text">Actualizado</span>
          <p className="mt-1">{formatArgentinaDateTime(rodeo.updated_at)}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          className="inline-flex items-center justify-center rounded-full bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-primaryDark hover:shadow-md"
          to={`/app/rodeos/${rodeo.id_asset_group}`}
        >
          Ver detalle
        </Link>

        <Button disabled={isUpdating} onClick={handleActivationToggle} type="button" variant="secondary">
          {isUpdating ? 'Actualizando...' : rodeo.active ? 'Desactivar' : 'Activar'}
        </Button>
      </div>

      {setRodeoActivation.isError && isActivationTarget ? (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-brand-danger">
          {getRodeoErrorMessage(setRodeoActivation.error)}
        </p>
      ) : null}
    </Card>
  );
}
