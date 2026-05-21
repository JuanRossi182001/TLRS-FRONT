import { AdminPageHeader } from '../components/AdminPageHeader';
import { AdminTablePlaceholder } from '../components/AdminTablePlaceholder';
import { adminUsersMock } from '../mocks/admin.mock';

export function AdminUsersPage() {
  return (
    <section className="space-y-6">
      <AdminPageHeader
        title="Usuarios"
        description="Gestion base de usuarios, permisos y estado de acceso."
      />

      <AdminTablePlaceholder
        rows={adminUsersMock}
        columns={[
          { key: 'id', label: 'ID' },
          { key: 'username', label: 'Usuario' },
          { key: 'client', label: 'Client' },
          { key: 'is_admin', label: 'Admin' },
          { key: 'active', label: 'Activo' },
          { key: 'last_login', label: 'Ultimo login' },
        ]}
        actions={['Ver', 'Desactivar', 'Cambiar permisos']}
      />
    </section>
  );
}
