import { Link } from 'react-router-dom';
import { Card } from '../../../shared/components';
import type { GeoFenceRead } from '../types/geofence.types';
import { GeofenceBadge } from './GeofenceBadge';

type GeofenceListProps = {
  geofences: GeoFenceRead[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function GeofenceList({ geofences }: GeofenceListProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {geofences.map((geofence) => (
        <Card key={geofence.id_geofence} className="space-y-4">
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
              <p className="mt-1">{formatDate(geofence.created_at)}</p>
            </div>
            <div className="rounded-2xl bg-brand-surfaceSoft p-4">
              <span className="font-semibold text-brand-text">Actualizada</span>
              <p className="mt-1">{formatDate(geofence.updated_at)}</p>
            </div>
          </div>

          <Link
            className="inline-flex w-fit rounded-full bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-primaryDark hover:shadow-md"
            to="/app/map"
          >
            Ver en mapa
          </Link>
        </Card>
      ))}
    </div>
  );
}
