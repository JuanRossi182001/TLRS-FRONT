import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button, Card, LoadingState } from '../../../shared/components';
import { useAvailableAssets, useProvisionDevice } from '../hooks/useAdminDevices';
import type { AdminClient, ProvisionDeviceRequest } from '../types/admin.types';
import { getProvisioningErrorMessage } from './provisioningErrorMessage';

type ProvisionDevicePanelProps = {
  clients: AdminClient[];
};

type AssetMode = 'existing' | 'new';

export function ProvisionDevicePanel({ clients }: ProvisionDevicePanelProps) {
  const [clientId, setClientId] = useState<number | null>(null);
  const [assetMode, setAssetMode] = useState<AssetMode>('existing');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const availableAssets = useAvailableAssets(clientId);
  const provisionDevice = useProvisionDevice();
  const selectableAssets = (availableAssets.data ?? []).filter(
    (asset) => asset.status === 'ACTIVE' && asset.assigned_device_id === null,
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const form = event.currentTarget;
    const values = new FormData(form);
    const selectedClientId = Number(values.get('client_id'));
    const base = {
      serial: String(values.get('serial') ?? '').trim(),
      name: String(values.get('name') ?? '').trim(),
      type: String(values.get('type') ?? '').trim(),
      client_id: selectedClientId,
      dev_eui: String(values.get('dev_eui') ?? '').trim(),
      join_eui: String(values.get('join_eui') ?? '').trim(),
      app_key: String(values.get('app_key') ?? '').trim(),
      chirpstack_application_id: String(values.get('chirpstack_application_id') ?? '').trim(),
      chirpstack_device_profile_id: String(values.get('chirpstack_device_profile_id') ?? '').trim(),
      description: String(values.get('description') ?? '').trim() || undefined,
      is_disabled: false,
    };

    if (Object.values(base).some((value) => value === '')) {
      setErrorMessage('Completa todos los datos requeridos del dispositivo y ChirpStack.');
      return;
    }

    if (!selectedClientId) {
      setErrorMessage('Selecciona el cliente del dispositivo.');
      return;
    }

    let payload: ProvisionDeviceRequest;

    if (assetMode === 'existing') {
      const asset_id = Number(values.get('asset_id'));

      if (!asset_id) {
        setErrorMessage('Selecciona un activo libre para provisionar el dispositivo.');
        return;
      }

      payload = { ...base, asset_id };
    } else {
      const asset_type = String(values.get('asset_type') ?? '').trim();
      const assetSerial = String(values.get('asset_serial') ?? '').trim();

      if (!asset_type || !assetSerial) {
        setErrorMessage('Completa el tipo y serial del activo nuevo.');
        return;
      }

      payload = {
        ...base,
        asset: { asset_type, serial: assetSerial, status: 'ACTIVE' },
      };
    }

    try {
      await provisionDevice.provision(payload);
      form.reset();
      setClientId(null);
      setAssetMode('existing');
      setSuccessMessage('Dispositivo provisionado y activo asignado correctamente.');
    } catch (error) {
      setErrorMessage(getProvisioningErrorMessage(error, 'No pudimos provisionar el dispositivo.'));
    }
  }

  return (
    <Card className="border-brand-primary/20 bg-brand-surface/95 shadow-xl shadow-brand-primary/10">
      <div>
        <h2 className="text-lg font-semibold text-brand-text">Provisionar dispositivo</h2>
        <p className="mt-1 text-sm leading-5 text-brand-muted">
          Registra el dispositivo en ChirpStack y asocialo a un activo del cliente.
        </p>
      </div>

      <form className="mt-4 grid gap-3" onSubmit={handleSubmit}>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-semibold text-brand-text">
            Cliente
            <select
              className="mt-2 w-full rounded-2xl border border-brand-border bg-white px-3 py-2.5 text-sm font-normal outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
              name="client_id"
              onChange={(event) => setClientId(event.target.value ? Number(event.target.value) : null)}
              value={clientId ?? ''}
            >
              <option disabled value="">Selecciona un cliente</option>
              {clients.map((client) => (
                <option key={client.id_client} value={client.id_client}>{client.name}</option>
              ))}
            </select>
          </label>
          <label className="text-sm font-semibold text-brand-text">
            Tipo de dispositivo
            <input className="mt-2 w-full rounded-2xl border border-brand-border bg-white px-3 py-2.5 text-sm font-normal outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15" defaultValue="COLLAR" name="type" placeholder="COLLAR" />
          </label>
          <label className="text-sm font-semibold text-brand-text">
            Serial
            <input className="mt-2 w-full rounded-2xl border border-brand-border bg-white px-3 py-2.5 text-sm font-normal outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15" name="serial" placeholder="COLLAR-001" />
          </label>
          <label className="text-sm font-semibold text-brand-text">
            Nombre
            <input className="mt-2 w-full rounded-2xl border border-brand-border bg-white px-3 py-2.5 text-sm font-normal outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15" name="name" placeholder="Collar 001" />
          </label>
        </div>

        <fieldset className="rounded-2xl border border-brand-border bg-brand-surfaceSoft p-3">
          <legend className="px-1 text-sm font-semibold text-brand-text">Activo</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            <label className="flex cursor-pointer items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-medium text-brand-text">
              <input checked={assetMode === 'existing'} className="accent-brand-primary" name="asset_mode" onChange={() => setAssetMode('existing')} type="radio" />
              Usar activo existente
            </label>
            <label className="flex cursor-pointer items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-medium text-brand-text">
              <input checked={assetMode === 'new'} className="accent-brand-primary" name="asset_mode" onChange={() => setAssetMode('new')} type="radio" />
              Crear activo nuevo
            </label>
          </div>

          {assetMode === 'existing' ? (
            <div className="mt-3">
              {!clientId ? <p className="text-sm text-brand-muted">Selecciona un cliente para cargar sus activos libres.</p> : null}
              {clientId && availableAssets.isLoading ? <LoadingState message="Cargando activos libres..." /> : null}
              {clientId && availableAssets.isError ? <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-brand-danger">{getProvisioningErrorMessage(availableAssets.error, 'No pudimos cargar los activos libres.')}</p> : null}
              {clientId && !availableAssets.isLoading && !availableAssets.isError ? (
                <select className="w-full rounded-xl border border-brand-border bg-white px-3 py-2.5 text-sm outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15" defaultValue="" key={clientId} name="asset_id">
                  <option disabled value="">Selecciona un activo libre</option>
                  {selectableAssets.map((asset) => (
                    <option key={asset.id_asset} value={asset.id_asset}>{asset.serial} ({asset.asset_type})</option>
                  ))}
                </select>
              ) : null}
              {clientId && !availableAssets.isLoading && !availableAssets.isError && selectableAssets.length === 0 ? <p className="mt-2 text-sm text-brand-muted">No hay activos libres activos para este cliente.</p> : null}
            </div>
          ) : (
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="text-sm font-semibold text-brand-text">Tipo de activo<input className="mt-2 w-full rounded-xl border border-brand-border bg-white px-3 py-2.5 text-sm font-normal outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15" defaultValue="CATTLE" name="asset_type" placeholder="CATTLE" /></label>
              <label className="text-sm font-semibold text-brand-text">Serial del activo<input className="mt-2 w-full rounded-xl border border-brand-border bg-white px-3 py-2.5 text-sm font-normal outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15" name="asset_serial" placeholder="COW-001" /></label>
            </div>
          )}
        </fieldset>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-semibold text-brand-text">DevEUI<input className="mt-2 w-full rounded-2xl border border-brand-border bg-white px-3 py-2.5 text-sm font-normal outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15" name="dev_eui" placeholder="0102030405060708" /></label>
          <label className="text-sm font-semibold text-brand-text">JoinEUI<input className="mt-2 w-full rounded-2xl border border-brand-border bg-white px-3 py-2.5 text-sm font-normal outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15" name="join_eui" placeholder="1020304050607080" /></label>
          <label className="text-sm font-semibold text-brand-text">ID de aplicacion ChirpStack<input className="mt-2 w-full rounded-2xl border border-brand-border bg-white px-3 py-2.5 text-sm font-normal outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15" name="chirpstack_application_id" /></label>
          <label className="text-sm font-semibold text-brand-text">ID de perfil ChirpStack<input className="mt-2 w-full rounded-2xl border border-brand-border bg-white px-3 py-2.5 text-sm font-normal outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15" name="chirpstack_device_profile_id" /></label>
        </div>

        <label className="text-sm font-semibold text-brand-text">
          App key
          <input autoComplete="new-password" className="mt-2 w-full rounded-2xl border border-brand-border bg-white px-3 py-2.5 text-sm font-normal outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15" name="app_key" type="password" />
        </label>
        <label className="text-sm font-semibold text-brand-text">Descripcion opcional<textarea className="mt-2 min-h-20 w-full rounded-2xl border border-brand-border bg-white px-3 py-2.5 text-sm font-normal outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15" name="description" /></label>

        {errorMessage ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-brand-danger">{errorMessage}</p> : null}
        {successMessage ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{successMessage}</p> : null}

        <Button className="w-full sm:w-auto" disabled={provisionDevice.isPending || clients.length === 0} type="submit">
          {provisionDevice.isPending ? 'Provisionando...' : 'Provisionar dispositivo'}
        </Button>
      </form>
    </Card>
  );
}
