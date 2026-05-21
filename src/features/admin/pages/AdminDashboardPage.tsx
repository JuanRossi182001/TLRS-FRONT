import { AdminPageHeader } from '../components/AdminPageHeader';
import { AdminSectionCard } from '../components/AdminSectionCard';
import { AdminStatCard } from '../components/AdminStatCard';
import { adminStatsMock } from '../mocks/admin.mock';

export function AdminDashboardPage() {
  return (
    <section className="space-y-6">
      <AdminPageHeader
        title="Panel admin"
        description="Vista interna para monitorear el estado general de la plataforma Manea."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard label="Total dispositivos" value={adminStatsMock.totalDevices} tone="primary" />
        <AdminStatCard label="Dispositivos activos" value={adminStatsMock.activeDevices} tone="accent" />
        <AdminStatCard label="Dispositivos inactivos" value={adminStatsMock.inactiveDevices} />
        <AdminStatCard label="Online" value={adminStatsMock.onlineDevices} />
        <AdminStatCard label="Offline" value={adminStatsMock.offlineDevices} />
        <AdminStatCard label="Clientes" value={adminStatsMock.totalClients} />
        <AdminStatCard label="Usuarios" value={adminStatsMock.totalUsers} />
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
