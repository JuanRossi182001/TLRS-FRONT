import { useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { Button, LoadingState, ResponsiveDialog } from '../../../shared/components';
import {
  useAvailableAssets,
  useReassignDeviceAsset,
  useReleaseDeviceAsset,
} from '../hooks/useAdminDevices';
import type { AdminDeviceListItem } from '../types/admin.types';
import { getProvisioningErrorMessage } from './provisioningErrorMessage';

type DialogShellProps = {
  children: ReactNode;
  title: string;
  onClose: () => void;
};

function DialogShell({ children, title, onClose }: DialogShellProps) {
  return (
    <ResponsiveDialog isOpen onClose={onClose} title={title}>
      {children}
    </ResponsiveDialog>
  );
}

type ReassignAssetDialogProps = {
  action?: 'assign' | 'reassign';
  device: AdminDeviceListItem | null;
  onClose: () => void;
  onCompleted: (message: string) => void;
};

export function ReassignAssetDialog({ action = 'reassign', device, onClose, onCompleted }: ReassignAssetDialogProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const availableAssets = useAvailableAssets(device?.client_id ?? null);
  const reassignAsset = useReassignDeviceAsset();
  const selectableAssets = (availableAssets.data ?? []).filter(
    (asset) => asset.status === 'ACTIVE' && asset.assigned_device_id === null,
  );

  if (!device) {
    return null;
  }

  const selectedDevice = device;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    const asset_id = Number(new FormData(event.currentTarget).get('asset_id'));

    if (!asset_id) {
      setErrorMessage('Selecciona un asset libre para continuar.');
      return;
    }

    try {
      await reassignAsset.mutateAsync({ device_id: selectedDevice.id_device, asset_id });
      onCompleted(action === 'assign' ? 'Asset asignado correctamente.' : 'Asset reasignado correctamente.');
      onClose();
    } catch (error) {
      setErrorMessage(getProvisioningErrorMessage(error, 'No pudimos actualizar la asignacion del asset.'));
    }
  }

  return (
    <DialogShell onClose={onClose} title={action === 'assign' ? 'Asignar asset' : 'Reasignar asset'}>
      <p className="mt-2 text-sm leading-5 text-brand-muted">
        {action === 'assign' ? 'Asigna' : 'Reasigna'} un asset libre del cliente {selectedDevice.client_name ?? 'sin cliente'} al dispositivo {selectedDevice.name}.
      </p>

      {!selectedDevice.client_id ? <p className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-brand-accentDark">Este dispositivo no tiene cliente asociado, por lo que no se puede reasignar.</p> : null}
      {selectedDevice.client_id && availableAssets.isLoading ? <div className="mt-4"><LoadingState message="Cargando assets libres..." /></div> : null}
      {selectedDevice.client_id && availableAssets.isError ? <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-brand-danger">{getProvisioningErrorMessage(availableAssets.error, 'No pudimos cargar los assets libres.')}</p> : null}

      {selectedDevice.client_id && !availableAssets.isLoading && !availableAssets.isError ? (
        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-semibold text-brand-text">
            Asset libre
            <select className="mt-2 w-full rounded-2xl border border-brand-border bg-white px-3 py-2.5 text-sm font-normal outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15" defaultValue="" key={selectedDevice.id_device} name="asset_id">
              <option disabled value="">Selecciona un asset</option>
              {selectableAssets.map((asset) => <option key={asset.id_asset} value={asset.id_asset}>{asset.serial} ({asset.asset_type})</option>)}
            </select>
          </label>
          {selectableAssets.length === 0 ? <p className="rounded-2xl bg-brand-surfaceSoft px-4 py-3 text-sm text-brand-muted">No hay assets libres activos para este cliente.</p> : null}
          {errorMessage ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-brand-danger">{errorMessage}</p> : null}
          <div className="flex flex-wrap justify-end gap-2">
            <Button onClick={onClose} variant="secondary">Cancelar</Button>
            <Button disabled={reassignAsset.isPending || selectableAssets.length === 0} type="submit">
              {reassignAsset.isPending ? (action === 'assign' ? 'Asignando...' : 'Reasignando...') : (action === 'assign' ? 'Asignar asset' : 'Reasignar asset')}
            </Button>
          </div>
        </form>
      ) : null}
    </DialogShell>
  );
}

type ReleaseAssetDialogProps = {
  device: AdminDeviceListItem | null;
  onClose: () => void;
  onCompleted: (message: string) => void;
};

export function ReleaseAssetDialog({ device, onClose, onCompleted }: ReleaseAssetDialogProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const releaseAsset = useReleaseDeviceAsset();

  if (!device) {
    return null;
  }

  const selectedDevice = device;

  async function handleRelease() {
    setErrorMessage(null);

    try {
      await releaseAsset.mutateAsync(selectedDevice.id_device);
      onCompleted('Asset liberado. El dispositivo fue desactivado.');
      onClose();
    } catch (error) {
      setErrorMessage(getProvisioningErrorMessage(error, 'No pudimos liberar el asset.'));
    }
  }

  return (
    <DialogShell onClose={onClose} title="Liberar asset">
      <p className="mt-3 text-sm leading-6 text-brand-text">
        Vas a liberar el asset <strong>{selectedDevice.asset_name ?? 'asignado'}</strong> del dispositivo <strong>{selectedDevice.name}</strong>.
      </p>
      <p className="mt-3 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-medium text-brand-accentDark">
        Esta operacion desactivara el dispositivo y lo dejara sin asset.
      </p>
      {errorMessage ? <p className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-brand-danger">{errorMessage}</p> : null}
      <div className="mt-5 flex flex-wrap justify-end gap-2">
        <Button onClick={onClose} variant="secondary">Cancelar</Button>
        <Button disabled={releaseAsset.isPending} onClick={handleRelease}>{releaseAsset.isPending ? 'Liberando...' : 'Liberar asset y desactivar'}</Button>
      </div>
    </DialogShell>
  );
}
