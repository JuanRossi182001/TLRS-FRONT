import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ApiError } from '../../../shared/api/httpClient';
import { Button, Card, EmptyState, ErrorState, LoadingState, StatusBadge } from '../../../shared/components';
import { AdminPageHeader } from '../components/AdminPageHeader';
import { AdminTablePlaceholder } from '../components/AdminTablePlaceholder';
import {
  useAdminClientUsers,
  useCreateAdminUser,
  useDeactivateAdminUser,
} from '../hooks/useAdminClientUsers';
import { useAdminClients } from '../hooks/useAdminClients';
import type { AdminUser } from '../types/admin.types';

export function AdminUsersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: clients = [], isLoading: isLoadingClients, isError: isClientsError, error: clientsError } = useAdminClients();
  const selectedClientId = Number(searchParams.get('client_id')) || clients[0]?.id_client;
  const { data: users = [], isLoading: isLoadingUsers, isError: isUsersError, error: usersError } = useAdminClientUsers(selectedClientId);
  const createUser = useCreateAdminUser(selectedClientId);
  const deactivateUser = useDeactivateAdminUser(selectedClientId);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createMessage, setCreateMessage] = useState<string | null>(null);

  const clientOptions = useMemo(
    () => clients.map((client) => ({ id: client.id_client, label: client.name })),
    [clients],
  );

  useEffect(() => {
    if (!searchParams.get('client_id') && clients[0]) {
      setSearchParams({ client_id: String(clients[0].id_client) }, { replace: true });
    }
  }, [clients, searchParams, setSearchParams]);

  async function handleCreateUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedClientId) return;
    setCreateError(null);
    setCreateMessage(null);

    const form = event.currentTarget;
    const values = new FormData(form);
    const name = String(values.get('name') ?? '').trim();
    const email = String(values.get('email') ?? '').trim();
    if (!name || !email) {
      setCreateError('Completa el nombre y el correo de la persona.');
      return;
    }

    try {
      const created = await createUser.mutateAsync({
        name,
        email,
        id_client: selectedClientId,
      });
      form.reset();
      setCreateMessage(
        created.invitation_email_sent
          ? `Cuenta creada. Enviamos a ${created.email} un enlace para activarla y definir su contraseña.`
          : `Cuenta creada, pero no pudimos enviar el correo a ${created.email}. La persona puede solicitar un nuevo enlace en «Activar cuenta».`,
      );
    } catch (mutationError) {
      if (mutationError instanceof ApiError && mutationError.status === 409) {
        setCreateError('Ya existe un usuario con ese nombre o correo.');
      } else if (mutationError instanceof ApiError && mutationError.status === 403) {
        setCreateError('No tienes permisos para crear usuarios.');
      } else {
        setCreateError(
          mutationError instanceof Error
            ? mutationError.message
            : 'No pudimos crear la cuenta.',
        );
      }
    }
  }

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

      {selectedClientId ? (
        <Card className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-brand-text">Invitar usuario</h2>
            <p className="mt-1 text-sm text-brand-muted">
              La persona recibirá un enlace para activar su cuenta y crear su contraseña.
            </p>
          </div>
          <form className="grid gap-3 sm:grid-cols-2" onSubmit={handleCreateUser}>
            <label className="text-sm font-semibold text-brand-text">
              Nombre
              <input
                className="mt-1.5 w-full rounded-xl border border-brand-border bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
                name="name"
                required
                maxLength={200}
                autoComplete="name"
              />
            </label>
            <label className="text-sm font-semibold text-brand-text">
              Correo electrónico
              <input
                className="mt-1.5 w-full rounded-xl border border-brand-border bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
                name="email"
                type="email"
                required
                maxLength={320}
                autoComplete="email"
              />
            </label>
            {createError ? (
              <p className="sm:col-span-2 rounded-2xl bg-red-50 px-4 py-3 text-sm text-brand-danger">
                {createError}
              </p>
            ) : null}
            {createMessage ? (
              <p className="sm:col-span-2 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                {createMessage}
              </p>
            ) : null}
            <div className="sm:col-span-2">
              <Button disabled={createUser.isPending} type="submit">
                {createUser.isPending ? 'Creando cuenta…' : 'Crear y enviar invitación'}
              </Button>
            </div>
          </form>
        </Card>
      ) : null}

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
      />
      ) : null}
    </section>
  );
}
