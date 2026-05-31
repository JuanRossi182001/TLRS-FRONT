import { EmptyState, ErrorState, LoadingState } from '../../../shared/components';
import { AdminPageHeader } from '../components/AdminPageHeader';
import { AdminSectionCard } from '../components/AdminSectionCard';
import { AdminStatCard } from '../components/AdminStatCard';
import { useAdminStats } from '../hooks/useAdminStats';

export function AdminDashboardPage() {
  const { data: stats, isLoading, isError, error } = useAdminStats();

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
