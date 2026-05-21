import { AdminPageHeader } from '../components/AdminPageHeader';
import { AdminTablePlaceholder } from '../components/AdminTablePlaceholder';
import { adminDevicesMock } from '../mocks/admin.mock';

export function AdminDevicesPage() {
  return (
    <section className="space-y-6">
      <AdminPageHeader
        title="Gestion de dispositivos"
        description="Administra todos los dispositivos de la plataforma."
      />

      <AdminTablePlaceholder
        rows={adminDevicesMock}
        columns={[
          { key: 'id', label: 'ID' },
          { key: 'serial', label: 'Serial' },
          { key: 'name', label: 'Nombre' },
          { key: 'client', label: 'Client' },
          { key: 'asset', label: 'Asset' },
          { key: 'active', label: 'Activo' },
          { key: 'state', label: 'Estado' },
        ]}
        actions={['Ver', 'Editar', 'Activar/Desactivar']}
      />
    </section>
  );
}
