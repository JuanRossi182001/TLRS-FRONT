import { Eye, EyeOff, LoaderCircle, MapPinned, X } from 'lucide-react';
import { useState } from 'react';
import { useSetGeofenceActivation } from '../../geofences/hooks/useSetGeofenceActivation';
import type { GeoFenceRead } from '../../geofences/types/geofence.types';

type MapGeofenceActivationControlProps = {
  geofences: GeoFenceRead[];
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

type MapGeofenceActivationItemProps = {
  geofence: GeoFenceRead;
};

function MapGeofenceActivationItem({ geofence }: MapGeofenceActivationItemProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const setGeofenceActivation = useSetGeofenceActivation();
  const isToggling = setGeofenceActivation.isPending;

  async function handleToggle() {
    setErrorMessage(null);

    try {
      await setGeofenceActivation.mutateAsync({
        geofence_id: geofence.id_geofence,
        payload: { active: !geofence.active },
      });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'No pudimos actualizar la geocerca.');
    }
  }

  return (
    <li className="rounded-2xl border border-brand-border/70 bg-brand-surface/55 p-2.5 backdrop-blur-sm lg:bg-brand-surfaceSoft/70">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-brand-text">{geofence.name}</p>
          <p className={geofence.active ? 'mt-0.5 text-xs font-medium text-brand-success' : 'mt-0.5 text-xs font-medium text-brand-muted'}>
            {geofence.active ? 'Visible en el mapa' : 'No visible'}
          </p>
        </div>
        <button
          aria-checked={geofence.active}
          aria-label={`${geofence.active ? 'Desactivar' : 'Activar'} ${geofence.name}`}
          className={[
            'inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-xl px-2.5 text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-brand-primary/30 disabled:cursor-not-allowed disabled:opacity-60',
            geofence.active
              ? 'bg-brand-primary text-white hover:bg-brand-primaryDark'
              : 'border border-brand-border/70 bg-brand-surface text-brand-primary hover:bg-brand-surfaceSoft',
          ].join(' ')}
          disabled={isToggling}
          onClick={handleToggle}
          role="switch"
          type="button"
        >
          {isToggling ? (
            <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : geofence.active ? (
            <EyeOff className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Eye className="h-4 w-4" aria-hidden="true" />
          )}
          {isToggling ? 'Actualizando' : geofence.active ? 'Desactivar' : 'Activar'}
        </button>
      </div>
      {errorMessage ? <p className="mt-2 text-xs font-medium text-brand-danger" role="alert">{errorMessage}</p> : null}
    </li>
  );
}

export function MapGeofenceActivationControl({
  geofences,
  isOpen,
  onOpenChange,
}: MapGeofenceActivationControlProps) {
  const activeGeofences = geofences.filter((geofence) => geofence.active).length;

  return (
    <div className="relative">
      <button
        aria-controls="map-geofence-activation-panel"
        aria-expanded={isOpen}
        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-2xl border border-brand-border/70 bg-brand-surface/95 px-3 py-2 text-sm font-semibold text-brand-primary shadow-sm transition hover:bg-brand-surfaceSoft hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand-primary/30 lg:rounded-full lg:px-4"
        onClick={() => onOpenChange(!isOpen)}
        type="button"
      >
        <MapPinned className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">Geocercas</span>
        <span className="sm:hidden">{activeGeofences}/{geofences.length}</span>
        <span className="hidden text-xs font-medium text-brand-muted sm:inline">
          {activeGeofences}/{geofences.length}
        </span>
      </button>

      {isOpen ? (
        <section
          aria-label="Activar geocercas"
          className="absolute right-0 top-full z-30 mt-2 w-72 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-brand-border/70 bg-brand-surface/60 shadow-xl shadow-brand-primary/20 backdrop-blur-sm lg:bg-brand-surface/95 lg:backdrop-blur-xl"
          id="map-geofence-activation-panel"
        >
          <header className="flex items-start justify-between gap-3 border-b border-brand-border/70 px-3 py-2.5">
            <div>
              <h2 className="text-sm font-semibold text-brand-text">Geocercas</h2>
              <p className="mt-0.5 text-xs text-brand-muted">
                Activa las geocercas que quieres ver en el mapa.
              </p>
            </div>
            <button
              aria-label="Cerrar geocercas"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-brand-muted transition hover:bg-brand-surfaceSoft hover:text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
              onClick={() => onOpenChange(false)}
              type="button"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </header>

          {geofences.length === 0 ? (
            <p className="p-3 text-sm text-brand-muted">No hay geocercas disponibles.</p>
          ) : (
            <ul className="max-h-[55dvh] space-y-2 overflow-y-auto p-2.5">
              {geofences.map((geofence) => (
                <MapGeofenceActivationItem geofence={geofence} key={geofence.id_geofence} />
              ))}
            </ul>
          )}
        </section>
      ) : null}
    </div>
  );
}
