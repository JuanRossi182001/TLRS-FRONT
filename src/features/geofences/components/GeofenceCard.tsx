import { Cpu, Map, Pencil, Power, PowerOff, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { Button, Card } from '../../../shared/components';
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

  useEffect(() => {
    if (!is_managing_devices) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsManagingDevices(false);
      }
    }

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [is_managing_devices]);

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
    <Card className="space-y-3.5 p-4 xl:space-y-3 xl:p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold text-brand-text xl:text-lg">
            {geofence.name}
          </h2>
          <p className="mt-1 text-sm leading-5 text-brand-muted xl:text-xs xl:leading-5">
            {geofence.description || 'Sin descripcion'}
          </p>
        </div>
        <GeofenceBadge active={geofence.active} />
      </div>

      <div className="grid gap-2 text-sm text-brand-muted sm:grid-cols-2 xl:text-xs">
        <div className="rounded-2xl bg-brand-surfaceSoft p-3 xl:p-3">
          <span className="font-semibold text-brand-text">Creada</span>
          <p className="mt-1">{formatArgentinaDateTime(geofence.created_at)}</p>
        </div>
        <div className="rounded-2xl bg-brand-surfaceSoft p-3 xl:p-3">
          <span className="font-semibold text-brand-text">Actualizada</span>
          <p className="mt-1">{formatArgentinaDateTime(geofence.updated_at)}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-primaryDark hover:shadow-md xl:px-4 xl:py-2 xl:text-xs"
          to="/app/map"
        >
          <Map className="h-4 w-4" aria-hidden="true" />
          Ver en mapa
        </Link>
        <Button
          className="gap-2 xl:px-4 xl:py-2 xl:text-xs"
          disabled={is_toggling_activation}
          onClick={handleActivationToggle}
          type="button"
          variant="secondary"
        >
          {geofence.active ? (
            <PowerOff className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Power className="h-4 w-4" aria-hidden="true" />
          )}
          {is_toggling_activation
            ? 'Actualizando...'
            : geofence.active
              ? 'Desactivar'
              : 'Activar'}
        </Button>
        <Link
          className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-border/70 bg-brand-surface px-5 py-2.5 text-sm font-semibold text-brand-primary shadow-sm transition hover:bg-brand-surfaceSoft hover:shadow-md xl:px-4 xl:py-2 xl:text-xs"
          onClick={resetForm}
          to={`/app/map?editGeofence=${geofence.id_geofence}`}
        >
          <Pencil className="h-4 w-4" aria-hidden="true" />
          Editar
        </Link>
        <Button
          className="gap-2 xl:px-4 xl:py-2 xl:text-xs"
          onClick={() => setIsManagingDevices((current) => !current)}
          type="button"
          variant="secondary"
        >
          <Cpu className="h-4 w-4" aria-hidden="true" />
          Gestionar alcance
        </Button>
      </div>

      {error_message ? (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-brand-danger">
          {error_message}
        </p>
      ) : null}

      {is_managing_devices && typeof document !== 'undefined'
        ? createPortal(
            <div
              className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/45 p-2 backdrop-blur-sm md:items-center md:p-6"
              onClick={() => setIsManagingDevices(false)}
            >
              <div
                aria-labelledby={`geofence-assignment-title-${geofence.id_geofence}`}
                aria-modal="true"
                className="flex h-[calc(100dvh-0.75rem)] w-full max-w-6xl flex-col overflow-hidden rounded-[1.5rem] border border-brand-border/70 bg-brand-surface shadow-2xl shadow-brand-primary/20 md:h-auto md:max-h-[94dvh] md:max-w-[92rem] md:rounded-[2rem]"
                onClick={(event) => event.stopPropagation()}
                role="dialog"
              >
                <div className="flex items-start justify-between gap-3 border-b border-brand-border/70 px-3 py-3 md:gap-4 md:px-5 md:py-3.5">
                  <div className="min-w-0">
                    <h3
                      className="text-base font-semibold text-brand-text md:text-[1.05rem]"
                      id={`geofence-assignment-title-${geofence.id_geofence}`}
                    >
                      Gestionar alcance
                    </h3>
                    <p className="mt-0.5 truncate text-xs text-brand-muted md:text-[13px]">{geofence.name}</p>
                  </div>

                  <button
                    aria-label="Cerrar gestion de alcance"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-brand-border/70 text-brand-muted transition hover:bg-brand-surfaceSoft hover:text-brand-text md:h-9 md:w-9"
                    onClick={() => setIsManagingDevices(false)}
                    type="button"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto p-3 md:p-5">
                  <GeofenceAssignmentManager
                    geofence_id={geofence.id_geofence}
                    is_open={is_managing_devices}
                  />
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </Card>
  );
}
