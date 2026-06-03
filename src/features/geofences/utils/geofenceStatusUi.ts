import type { GeoFenceStatus } from '../types/geofenceState.types';

type GeofenceStatusUi = {
  label: string;
  description: string;
  badgeClassName: string;
  markerClassName: string;
};

const fallbackStatusUi: GeofenceStatusUi = {
  label: 'Sin estado',
  description: 'No hay un estado de geocerca disponible',
  badgeClassName: 'bg-slate-100 text-slate-700 ring-slate-200',
  markerClassName: 'bg-slate-500 ring-slate-100',
};

const statusUi: Record<GeoFenceStatus, GeofenceStatusUi> = {
  SAFE: {
    label: 'Seguro',
    description: 'Dentro de la zona segura',
    badgeClassName: 'bg-emerald-50 text-brand-success ring-emerald-200',
    markerClassName: 'bg-brand-success ring-emerald-100',
  },
  NEAR_LIMIT: {
    label: 'Cerca del limite',
    description: 'El animal/dispositivo esta cerca del borde de la geocerca',
    badgeClassName: 'bg-amber-50 text-brand-accentDark ring-amber-200',
    markerClassName: 'bg-brand-accent ring-amber-100 text-brand-primary',
  },
  OUTSIDE: {
    label: 'Fuera de la cerca',
    description: 'El animal/dispositivo salio de la geocerca',
    badgeClassName: 'bg-red-50 text-brand-danger ring-red-200',
    markerClassName: 'bg-brand-danger ring-red-100',
  },
  GPS_UNCERTAIN: {
    label: 'GPS incierto',
    description: 'La precision GPS no permite determinar el estado con seguridad',
    badgeClassName: 'bg-slate-100 text-slate-700 ring-slate-200',
    markerClassName: 'bg-slate-500 ring-slate-100',
  },
};

export function getGeofenceStatusUi(status: GeoFenceStatus | string | null | undefined) {
  return statusUi[status as GeoFenceStatus] ?? fallbackStatusUi;
}
