import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button, EmptyState, ErrorState, LoadingState, StatusBadge } from '../../../shared/components';
import { AdminPageHeader } from '../components/AdminPageHeader';
import { AdminTablePlaceholder } from '../components/AdminTablePlaceholder';
import { useAdminClientUsers, useDeactivateAdminUser } from '../hooks/useAdminClientUsers';
import { useAdminClients } from '../hooks/useAdminClients';
import type { AdminUser } from '../types/admin.types';

export function AdminUsersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: clients = [], isLoading: isLoadingClients, isError: isClientsError, error: clientsError } = useAdminClients();
  const selectedClientId = Number(searchParams.get('client_id')) || clients[0]?.id_client;
  const { data: users = [], isLoading: isLoadingUsers, isError: isUsersError, error: usersError } = useAdminClientUsers(selectedClientId);
  const deactivateUser = useDeactivateAdminUser(selectedClientId);

  const clientOptions = useMemo(
    () => clients.map((client) => ({ id: client.id_client, label: client.name })),
    [clients],
  );

  useEffect(() => {
    if (!searchParams.get('client_id') && clients[0]) {
      setSearchParams({ client_id: String(clients[0].id_client) }, { replace: true });
    }
  }, [clients, searchParams, setSearchParams]);

  if (isLoadingClients) {
    return <LoadingState message="Cargando clientes..." />;
  }

  if (isClientsError) {
    return (
      <ErrorState
        title="No pudimos cargar los clientes"
        message={clientsError instanceof Error ? clientsError.message : 'Revisa la conexion con el backend.'}
      />
    );
  }

  return (
    <section className="space-y-6">
      <AdminPageHeader
        title="Usuarios"
        description="Gestion base de usuarios, permisos y estado de acceso."
      />

      {clientOptions.length === 0 ? (
        <EmptyState title="No hay clientes" message="Primero debe existir al menos un cliente para listar usuarios." />
      ) : (
        <div className="flex items-center gap-3 rounded-3xl border border-brand-border/60 bg-brand-surface p-5 shadow-sm shadow-brand-primary/5">
          <label className="text-sm font-semibold text-brand-text" htmlFor="admin-client-select">
            Cliente
          </label>
          <select
            className="mt-2 w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-text outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15 md:max-w-sm"
            id="admin-client-select"
            onChange={(event) => setSearchParams({ client_id: event.target.value })}
            value={selectedClientId ?? ''}
          >
            {clientOptions.map((client) => (
              <option key={client.id} value={client.id}>
                {client.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {isLoadingUsers ? <LoadingState message="Cargando usuarios del cliente..." /> : null}

      {isUsersError ? (
        <ErrorState
          title="No pudimos cargar los usuarios"
          message={usersError instanceof Error ? usersError.message : 'Revisa la conexion con el backend.'}
        />
      ) : null}

      {!isLoadingUsers && !isUsersError && selectedClientId && users.length === 0 ? (
        <EmptyState title="No hay usuarios" message="Este cliente todavia no tiene usuarios asociados." />
      ) : null}

      {!isLoadingUsers && !isUsersError && users.length > 0 ? (
        <AdminTablePlaceholder<AdminUser>
        rows={users}
        getRowId={(user) => user.id_user}
        columns={[
          { key: 'id_user', label: 'ID' },
          { key: 'name', label: 'Nombre' },
          { key: 'email', label: 'Email' },
          { key: 'id_client', label: 'Cliente ID' },
          {
            key: 'is_admin',
            label: 'Admin',
            render: (user) => (
              <StatusBadge
                label={user.is_admin ? 'Admin' : 'Usuario'}
                tone={user.is_admin ? 'warning' : 'default'}
              />
            ),
          },
        ]}
        renderActions={(user) => (
          <div className="flex flex-wrap gap-2">
            <Button className="px-3 py-1.5 text-xs" disabled variant="secondary">
              Ver
            </Button>
            <Button
              className="px-3 py-1.5 text-xs"
              disabled={deactivateUser.isPending}
              onClick={() => deactivateUser.mutate(user.id_user)}
            >
              Desactivar
            </Button>
            <Button className="px-3 py-1.5 text-xs" disabled variant="secondary">
              Cambiar permisos
            </Button>
          </div>
        )}
        note="Los usuarios se consultan por cliente. Desactivar ya usa el endpoint admin."
      />
      ) : null}
    </section>
  );
}
