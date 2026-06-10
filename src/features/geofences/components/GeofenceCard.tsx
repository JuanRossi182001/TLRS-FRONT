import { Cpu, Map, Pencil, Power, PowerOff } from 'lucide-react';
import { useState } from 'react';
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
    <Card className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-brand-text">{geofence.name}</h2>
          <p className="mt-1 text-sm leading-6 text-brand-muted">
            {geofence.description || 'Sin descripcion'}
          </p>
        </div>
        <GeofenceBadge active={geofence.active} />
      </div>

      <div className="grid gap-3 text-sm text-brand-muted sm:grid-cols-2">
        <div className="rounded-2xl bg-brand-surfaceSoft p-4">
          <span className="font-semibold text-brand-text">Creada</span>
          <p className="mt-1">{formatArgentinaDateTime(geofence.created_at)}</p>
        </div>
        <div className="rounded-2xl bg-brand-surfaceSoft p-4">
          <span className="font-semibold text-brand-text">Actualizada</span>
          <p className="mt-1">{formatArgentinaDateTime(geofence.updated_at)}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-primaryDark hover:shadow-md"
          to="/app/map"
        >
          <Map className="h-4 w-4" aria-hidden="true" />
          Ver en mapa
        </Link>
        <Button
          className="gap-2"
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
          className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-border/70 bg-brand-surface px-5 py-2.5 text-sm font-semibold text-brand-primary shadow-sm transition hover:bg-brand-surfaceSoft hover:shadow-md"
          onClick={resetForm}
          to={`/app/map?editGeofence=${geofence.id_geofence}`}
        >
          <Pencil className="h-4 w-4" aria-hidden="true" />
          Editar
        </Link>
        <Button
          className="gap-2"
          onClick={() => setIsManagingDevices((current) => !current)}
          type="button"
          variant="secondary"
        >
          <Cpu className="h-4 w-4" aria-hidden="true" />
          Gestionar dispositivos
        </Button>
      </div>

      {error_message ? (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-brand-danger">
          {error_message}
        </p>
      ) : null}

      <GeofenceAssignmentManager
        geofence_id={geofence.id_geofence}
        is_open={is_managing_devices}
      />
    </Card>
  );
}
