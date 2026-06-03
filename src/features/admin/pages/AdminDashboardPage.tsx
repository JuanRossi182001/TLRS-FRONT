import { Card, EmptyState, ErrorState, LoadingState } from '../../../shared/components';
import { GeofenceStatusBadge } from '../../geofences/components/GeofenceStatusBadge';
import type { GeoFenceStatus } from '../../geofences/types/geofenceState.types';
import { AdminPageHeader } from '../components/AdminPageHeader';
import { AdminSectionCard } from '../components/AdminSectionCard';
import { AdminStatCard } from '../components/AdminStatCard';
import { useAdminDevices } from '../hooks/useAdminDevices';
import { useAdminStats } from '../hooks/useAdminStats';

const geofenceStatuses: GeoFenceStatus[] = ['SAFE', 'NEAR_LIMIT', 'OUTSIDE', 'GPS_UNCERTAIN'];

export function AdminDashboardPage() {
  const { data: stats, isLoading, isError, error } = useAdminStats();
  const { data: devices = [] } = useAdminDevices();
  const geofenceStatusCounts = devices.reduce<Record<string, number>>((counts, device) => {
    const status = geofenceStatuses.includes(device.status) ? device.status : 'UNKNOWN';

    counts[status] = (counts[status] ?? 0) + 1;

    return counts;
  }, {});
  const hasUnknownStatus = Boolean(geofenceStatusCounts.UNKNOWN);

  if (isLoading) {
    return <LoadingState message="Cargando metricas de administracion..." />;
  }

  if (isError) {
    return (
      <ErrorState
        title="No pudimos cargar el panel admin"
        message={error instanceof Error ? error.message : 'Revisa la conexion con el backend.'}
      />
    );
  }

  if (!stats) {
    return (
      <EmptyState
        title="Sin metricas disponibles"
        message="Cuando el backend devuelva datos, el panel se va a completar automaticamente."
      />
    );
  }

  return (
    <section className="space-y-6">
      <AdminPageHeader
        title="Panel admin"
        description="Vista interna para monitorear el estado general de la plataforma Manea."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard label="Total dispositivos" value={stats.devices_data.all_devices} tone="accent" />
        <AdminStatCard label="Dispositivos activos" value={stats.devices_data.active_devices} tone="accent" />
        <AdminStatCard label="Dispositivos inactivos" value={stats.devices_data.inactive_devices} />
        <AdminStatCard label="Online" value={stats.devices_data.online_devices} />
        <AdminStatCard label="Offline" value={stats.devices_data.offline_devices} />
        <AdminStatCard label="Clientes" value={stats.clients_data} />
        <AdminStatCard label="Usuarios" value={stats.users_data} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {geofenceStatuses.map((status) => (
          <Card key={status} className="space-y-3">
            <GeofenceStatusBadge current_status={status} />
            <p className="text-3xl font-semibold text-brand-text">{geofenceStatusCounts[status] ?? 0}</p>
            <p className="text-sm text-brand-muted">dispositivos</p>
          </Card>
        ))}
        {hasUnknownStatus ? (
          <Card className="space-y-3">
            <GeofenceStatusBadge current_status={null} />
            <p className="text-3xl font-semibold text-brand-text">{geofenceStatusCounts.UNKNOWN}</p>
            <p className="text-sm text-brand-muted">dispositivos</p>
          </Card>
        ) : null}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <AdminSectionCard
          title="Gestionar dispositivos"
          description="Administrar altas, estados y asociaciones de dispositivos."
          to="/app/admin/devices"
        />
        <AdminSectionCard
          title="Gestionar clientes"
          description="Revisar clientes, usuarios asociados y volumen operativo."
          to="/app/admin/clients"
        />
        <AdminSectionCard
          title="Gestionar usuarios"
          description="Controlar usuarios, permisos y accesos internos."
          to="/app/admin/users"
        />
      </div>
    </section>
  );
}
