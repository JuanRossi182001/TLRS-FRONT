import { AdminPageHeader } from '../components/AdminPageHeader';
import { AdminTablePlaceholder } from '../components/AdminTablePlaceholder';
import { adminClientsMock } from '../mocks/admin.mock';

export function AdminClientsPage() {
  return (
    <section className="space-y-6">
      <AdminPageHeader
        title="Clientes"
        description="Gestion base de clientes, usuarios asociados y dispositivos asignados."
      />

      <AdminTablePlaceholder
        rows={adminClientsMock}
        columns={[
          { key: 'id', label: 'ID' },
          { key: 'name', label: 'Nombre' },
          { key: 'email', label: 'Email' },
          { key: 'users', label: 'Usuarios' },
          { key: 'devices', label: 'Dispositivos' },
          { key: 'status', label: 'Estado' },
        ]}
        actions={['Ver usuarios', 'Editar', 'Desactivar']}
      />
    </section>
  );
}
