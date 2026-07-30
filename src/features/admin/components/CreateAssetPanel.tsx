import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button, Card } from '../../../shared/components';
import { useCreateAsset } from '../hooks/useAdminDevices';
import type { AdminClient } from '../types/admin.types';
import { getProvisioningErrorMessage } from './provisioningErrorMessage';

type CreateAssetPanelProps = {
  clients: AdminClient[];
};

export function CreateAssetPanel({ clients }: CreateAssetPanelProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const createAsset = useCreateAsset();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const form = event.currentTarget;
    const values = new FormData(form);
    const client_id = Number(values.get('client_id'));
    const asset_type = String(values.get('asset_type') ?? '').trim();
    const serial = String(values.get('serial') ?? '').trim();

    if (!client_id || !asset_type || !serial) {
      setErrorMessage('Selecciona un cliente y completa el tipo y serial del activo.');
      return;
    }

    try {
      await createAsset.mutateAsync({ asset_type, serial, client_id, status: 'ACTIVE' });
      form.reset();
      setSuccessMessage('Activo creado y disponible para asignacion.');
    } catch (error) {
      setErrorMessage(getProvisioningErrorMessage(error, 'No pudimos crear el activo.'));
    }
  }

  return (
    <Card className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-brand-text">Crear activo</h2>
        <p className="mt-1 text-sm leading-5 text-brand-muted">
          Crea un activo libre para asignarlo durante el provisioning o mas adelante.
        </p>
      </div>

      <form className="grid gap-3" onSubmit={handleSubmit}>
        <label className="text-sm font-semibold text-brand-text">
          Cliente
          <select
            className="mt-2 w-full rounded-2xl border border-brand-border bg-white px-3 py-2.5 text-sm font-normal outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
            defaultValue=""
            name="client_id"
          >
            <option disabled value="">Selecciona un cliente</option>
            {clients.map((client) => (
              <option key={client.id_client} value={client.id_client}>{client.name}</option>
            ))}
          </select>
        </label>

        <label className="text-sm font-semibold text-brand-text">
          Tipo de activo
          <input
            className="mt-2 w-full rounded-2xl border border-brand-border bg-white px-3 py-2.5 text-sm font-normal outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
            defaultValue="CATTLE"
            name="asset_type"
            placeholder="CATTLE"
          />
        </label>

        <label className="text-sm font-semibold text-brand-text">
          Serial del activo
          <input
            className="mt-2 w-full rounded-2xl border border-brand-border bg-white px-3 py-2.5 text-sm font-normal outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
            name="serial"
            placeholder="COW-001"
          />
        </label>

        {errorMessage ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-brand-danger">{errorMessage}</p> : null}
        {successMessage ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{successMessage}</p> : null}

        <Button className="w-full sm:w-auto" disabled={createAsset.isPending || clients.length === 0} type="submit">
          {createAsset.isPending ? 'Creando...' : 'Crear activo'}
        </Button>
      </form>
    </Card>
  );
}
