import { Link } from 'react-router-dom';
import { Button, EmptyState, ErrorState, LoadingState } from '../../../shared/components';
import { AdminPageHeader } from '../components/AdminPageHeader';
import { AdminTablePlaceholder } from '../components/AdminTablePlaceholder';
import { useAdminClients } from '../hooks/useAdminClients';
import type { AdminClient } from '../types/admin.types';

export function AdminClientsPage() {
  const { data: clients = [], isLoading, isError, error } = useAdminClients();

  if (isLoading) {
    return <LoadingState message="Cargando clientes..." />;
  }

  if (isError) {
    return (
      <ErrorState
        title="No pudimos cargar los clientes"
        message={error instanceof Error ? error.message : 'Revisa la conexion con el backend.'}
      />
    );
  }

  return (
    <section className="space-y-6">
      <AdminPageHeader
        title="Clientes"
        description="Gestion base de clientes, usuarios asociados y dispositivos asignados."
      />

      {clients.length === 0 ? (
        <EmptyState
          title="No hay clientes"
          message="Cuando existan clientes cargados, van a aparecer en esta tabla."
        />
      ) : (
        <AdminTablePlaceholder<AdminClient>
        rows={clients}
        getRowId={(client) => client.id_client}
        columns={[
          { key: 'id_client', label: 'ID' },
          { key: 'name', label: 'Nombre' },
          { key: 'email', label: 'Email' },
          { key: 'user_count', label: 'Usuarios' },
          { key: 'device_count', label: 'Dispositivos' },
        ]}
        renderActions={(client) => (
          <div className="flex flex-wrap gap-2">
            <Link
              className="inline-flex rounded-full bg-brand-primary px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-primaryDark"
              to={`/app/admin/users?client_id=${client.id_client}`}
            >
              Ver usuarios
            </Link>
            <Button className="px-3 py-1.5 text-xs" disabled variant="secondary">
              Editar
            </Button>
            <Button className="px-3 py-1.5 text-xs" disabled variant="secondary">
              Desactivar
            </Button>
          </div>
        )}
        note="Clientes obtenidos desde el backend. Editar y desactivar quedan preparados para endpoints futuros."
      />
      )}
    </section>
  );
}
