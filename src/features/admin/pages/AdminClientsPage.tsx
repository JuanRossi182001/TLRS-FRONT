import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ApiError } from '../../../shared/api/httpClient';
import { Button, Card, EmptyState, ErrorState, LoadingState, ResponsiveDialog } from '../../../shared/components';
import { AdminPageHeader } from '../components/AdminPageHeader';
import { AdminTablePlaceholder } from '../components/AdminTablePlaceholder';
import {
  useAdminClient,
  useAdminClients,
  useCreateAdminClient,
  useDeleteAdminClient,
  useUpdateAdminClient,
} from '../hooks/useAdminClients';
import type { AdminClient } from '../types/admin.types';

function getClientErrorMessage(error: unknown, fallback: string) {
  if (error instanceof ApiError) {
    if (error.status === 401) return 'Tu sesión no es válida. Inicia sesión nuevamente.';
    if (error.status === 403) return 'No tienes permisos de administrador para gestionar clientes.';
    if (error.status === 404) return 'El cliente ya no existe o fue eliminado.';
    if (error.status === 409) return 'Ya existe un cliente activo con ese email.';
    if (error.status === 422) return 'Revisa los datos ingresados. El nombre y el email son obligatorios.';
  }
  return error instanceof Error ? error.message : fallback;
}

export function AdminClientsPage() {
  const { data: clients = [], isLoading, isError, error } = useAdminClients();
  const [editingClientId, setEditingClientId] = useState<number | undefined>();
  const { data: editingClient, isLoading: isLoadingDetail, isError: isDetailError, error: detailError } =
    useAdminClient(editingClientId);
  const createClient = useCreateAdminClient();
  const updateClient = useUpdateAdminClient();
  const deleteClient = useDeleteAdminClient();
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreateError(null);
    setCreateSuccess(null);
    const form = event.currentTarget;
    const values = new FormData(form);
    const name = String(values.get('name') ?? '').trim();
    const email = String(values.get('email') ?? '').trim();
    if (!name || !email) {
      setCreateError('Completa el nombre y el email del cliente.');
      return;
    }
    try {
      await createClient.mutateAsync({ name, email });
      form.reset();
      setCreateSuccess('Cliente creado correctamente.');
    } catch (mutationError) {
      setCreateError(getClientErrorMessage(mutationError, 'No pudimos crear el cliente.'));
    }
  }

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingClientId) return;
    setEditError(null);
    const values = new FormData(event.currentTarget);
    const name = String(values.get('name') ?? '').trim();
    const email = String(values.get('email') ?? '').trim();
    if (!name || !email) {
      setEditError('El nombre y el email no pueden quedar vacíos.');
      return;
    }
    try {
      await updateClient.mutateAsync({ client_id: editingClientId, payload: { name, email } });
      setEditingClientId(undefined);
    } catch (mutationError) {
      setEditError(getClientErrorMessage(mutationError, 'No pudimos actualizar el cliente.'));
    }
  }

  async function handleDelete(client: AdminClient) {
    if (!window.confirm(`¿Eliminar el cliente «${client.name}»? Esta acción lo quitará de las consultas normales.`)) {
      return;
    }
    try {
      await deleteClient.mutateAsync(client.id_client);
    } catch (mutationError) {
      window.alert(getClientErrorMessage(mutationError, 'No pudimos eliminar el cliente.'));
    }
  }

  if (isLoading) return <LoadingState message="Cargando clientes..." />;
  if (isError) {
    return <ErrorState title="No pudimos cargar los clientes" message={getClientErrorMessage(error, 'Revisa la conexión con el backend.')} />;
  }

  const inputClassName = 'mt-1.5 w-full rounded-xl border border-brand-border bg-white px-3 py-2.5 text-sm font-normal outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15';

  return (
    <section className="space-y-5">
      <AdminPageHeader title="Clientes" description="Gestiona los clientes, sus datos de contacto y el volumen operativo asociado." />

      <Card className="space-y-3" density="compact">
        <div>
          <h2 className="text-lg font-semibold text-brand-text">Agregar cliente</h2>
          <p className="mt-1 text-sm text-brand-muted">El email se normaliza a minúsculas al guardar.</p>
        </div>
        <form className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end" onSubmit={handleCreate}>
          <label className="text-sm font-semibold text-brand-text">Nombre
            <input className={inputClassName} name="name" required maxLength={200} />
          </label>
          <label className="text-sm font-semibold text-brand-text">Email
            <input className={inputClassName} name="email" type="email" required maxLength={320} />
          </label>
          <Button disabled={createClient.isPending} type="submit">
            {createClient.isPending ? 'Creando...' : 'Crear cliente'}
          </Button>
        </form>
        {createError ? <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-brand-danger">{createError}</p> : null}
        {createSuccess ? <p role="status" className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{createSuccess}</p> : null}
      </Card>

      {clients.length === 0 ? (
        <EmptyState title="No hay clientes" message="Cuando existan clientes cargados, van a aparecer en esta tabla." />
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
              <Link className="inline-flex rounded-full bg-brand-primary px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-primaryDark" to={`/app/admin/users?client_id=${client.id_client}`}>Ver usuarios</Link>
              <Button className="px-3 py-1.5 text-xs" onClick={() => { setEditError(null); setEditingClientId(client.id_client); }} variant="secondary">Editar</Button>
              <Button className="px-3 py-1.5 text-xs" disabled={deleteClient.isPending} onClick={() => void handleDelete(client)} variant="secondary">Eliminar</Button>
            </div>
          )}
          note="Los conteos de usuarios y dispositivos se actualizan al recargar la lista."
        />
      )}

      <ResponsiveDialog
        isOpen={Boolean(editingClientId)}
        title="Editar cliente"
        subtitle={editingClient ? `Cliente #${editingClient.id_client}` : 'Cargando datos del cliente'}
        onClose={() => setEditingClientId(undefined)}
      >
        {isLoadingDetail ? <LoadingState message="Cargando datos del cliente..." /> : null}
        {isDetailError ? <ErrorState title="No pudimos cargar el cliente" message={getClientErrorMessage(detailError, 'Intenta nuevamente.')} /> : null}
        {editingClient ? (
          <form className="grid gap-3" onSubmit={handleUpdate}>
            <label className="text-sm font-semibold text-brand-text">Nombre
              <input className={inputClassName} key={`${editingClient.id_client}-name`} name="name" defaultValue={editingClient.name} required maxLength={200} />
            </label>
            <label className="text-sm font-semibold text-brand-text">Email
              <input className={inputClassName} key={`${editingClient.id_client}-email`} name="email" type="email" defaultValue={editingClient.email} required maxLength={320} />
            </label>
            {editError ? <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-brand-danger">{editError}</p> : null}
            <div className="flex justify-end gap-2">
              <Button onClick={() => setEditingClientId(undefined)} variant="secondary">Cancelar</Button>
              <Button disabled={updateClient.isPending} type="submit">{updateClient.isPending ? 'Guardando...' : 'Guardar cambios'}</Button>
            </div>
          </form>
        ) : null}
      </ResponsiveDialog>
    </section>
  );
}
