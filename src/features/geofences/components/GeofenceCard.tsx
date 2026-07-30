import { Cpu, Ellipsis, Map, Pencil, Power, PowerOff } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, ResponsiveDialog } from '../../../shared/components';
import { formatArgentinaDateTime } from '../../../shared/utils/dateTime';
import { useSetGeofenceActivation } from '../hooks/useSetGeofenceActivation';
import type { GeoFenceRead } from '../types/geofence.types';
import { GeofenceAssignmentManager } from './GeofenceAssignmentManager';
import { GeofenceBadge } from './GeofenceBadge';

type GeofenceCardProps = {
  geofence: GeoFenceRead;
};

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'No pudimos actualizar la geocerca.';
}

export function GeofenceCard({ geofence }: GeofenceCardProps) {
  const [is_managing_devices, setIsManagingDevices] = useState(false);
  const [error_message, setErrorMessage] = useState<string | null>(null);
  const setGeofenceActivation = useSetGeofenceActivation();

  function resetForm() {
    setErrorMessage(null);
  }

  async function handleActivationToggle() {
    setErrorMessage(null);

    try {
      await setGeofenceActivation.mutateAsync({
        geofence_id: geofence.id_geofence,
        payload: { active: !geofence.active },
      });
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  }

  const is_toggling_activation = setGeofenceActivation.isPending;

  return (
    <Card className="space-y-3 p-3 lg:p-4 xl:space-y-3 xl:p-4" density="compact">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold text-brand-text lg:text-lg xl:text-lg">
            {geofence.name}
          </h2>
          <p className="mt-1 text-sm leading-5 text-brand-muted xl:text-xs xl:leading-5">
            {geofence.description || 'Sin descripcion'}
          </p>
        </div>
        <GeofenceBadge active={geofence.active} />
      </div>

      <p className="text-xs text-brand-muted">
        Actualizada {formatArgentinaDateTime(geofence.updated_at)}
      </p>

      <div className="flex items-center gap-2">
        {geofence.active ? (
          <Link
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-2xl bg-brand-primary px-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-primaryDark hover:shadow-md lg:rounded-full lg:px-5 lg:py-2.5 xl:px-4 xl:py-2 xl:text-xs"
            to="/app/map"
          >
            <Map className="h-4 w-4" aria-hidden="true" />
            Ver en mapa
          </Link>
        ) : (
          <span
            aria-disabled="true"
            className="inline-flex min-h-10 cursor-not-allowed items-center justify-center gap-2 rounded-2xl bg-brand-border px-3 text-sm font-semibold text-brand-muted lg:rounded-full lg:px-5 lg:py-2.5 xl:px-4 xl:py-2 xl:text-xs"
          >
            <Map className="h-4 w-4" aria-hidden="true" />
            Ver en mapa
          </span>
        )}
        <Button
          aria-label={geofence.active ? 'Desactivar geocerca' : 'Activar geocerca'}
          className="gap-2 px-3 text-xs xl:px-4 xl:py-2 xl:text-xs"
          disabled={is_toggling_activation}
          onClick={handleActivationToggle}
          type="button"
          variant="secondary"
        >
          {geofence.active ? <PowerOff className="h-4 w-4" aria-hidden="true" /> : <Power className="h-4 w-4" aria-hidden="true" />}
          <span className="hidden sm:inline">{is_toggling_activation ? 'Actualizando...' : geofence.active ? 'Desactivar' : 'Activar'}</span>
        </Button>
        <details className="relative ml-auto md:hidden">
          <summary aria-label="Mas acciones de geocerca" className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-2xl border border-brand-border/70 text-brand-muted transition hover:bg-brand-surfaceSoft">
            <Ellipsis className="h-5 w-5" aria-hidden="true" />
          </summary>
          <div className="absolute right-0 top-11 z-10 w-44 rounded-2xl border border-brand-border/70 bg-brand-surface p-1.5 shadow-lg">
            <Link className="flex min-h-10 items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-brand-primary hover:bg-brand-surfaceSoft" onClick={resetForm} to={`/app/map?editGeofence=${geofence.id_geofence}`}>
              <Pencil className="h-4 w-4" aria-hidden="true" /> Editar
            </Link>
            <button className="flex min-h-10 w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold text-brand-primary hover:bg-brand-surfaceSoft" onClick={() => setIsManagingDevices(true)} type="button">
              <Cpu className="h-4 w-4" aria-hidden="true" /> Gestionar alcance
            </button>
          </div>
        </details>
        <Link
          className="hidden items-center justify-center gap-2 rounded-full border border-brand-border/70 bg-brand-surface px-5 py-2.5 text-sm font-semibold text-brand-primary shadow-sm transition hover:bg-brand-surfaceSoft hover:shadow-md md:inline-flex xl:px-4 xl:py-2 xl:text-xs"
          onClick={resetForm}
          to={`/app/map?editGeofence=${geofence.id_geofence}`}
        >
          <Pencil className="h-4 w-4" aria-hidden="true" /> Editar
        </Link>
        <Button className="hidden gap-2 md:inline-flex xl:px-4 xl:py-2 xl:text-xs" onClick={() => setIsManagingDevices(true)} type="button" variant="secondary">
          <Cpu className="h-4 w-4" aria-hidden="true" /> Gestionar alcance
        </Button>
      </div>

      {error_message ? (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-brand-danger">
          {error_message}
        </p>
      ) : null}

      <ResponsiveDialog isOpen={is_managing_devices} onClose={() => setIsManagingDevices(false)} subtitle={geofence.name} title="Gestionar alcance">
        <GeofenceAssignmentManager geofence_id={geofence.id_geofence} is_open={is_managing_devices} />
      </ResponsiveDialog>
    </Card>
  );
}
