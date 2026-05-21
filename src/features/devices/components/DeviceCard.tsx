import { Link } from 'react-router-dom';
import { Card, StatusBadge } from '../../../shared/components';
import type { Device } from '../types/device.types';
import { DeviceStateBadge } from './DeviceStateBadge';

type DeviceCardProps = {
  device: Device;
};

export function DeviceCard({ device }: DeviceCardProps) {
  return (
    <Card className="space-y-5 transition hover:-translate-y-0.5 hover:shadow-md hover:shadow-brand-primary/10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-semibold tracking-tight text-brand-text">{device.name}</h2>
            <DeviceStateBadge state={device.state} />
          </div>
          <p className="mt-1 text-sm font-medium text-brand-muted">{device.serial}</p>
        </div>

        <StatusBadge
          label={device.active ? 'Activo' : 'Inactivo'}
          tone={device.active ? 'success' : 'default'}
        />
      </div>

      <dl className="grid gap-3 text-sm sm:grid-cols-2">
        <div className="rounded-2xl bg-brand-surfaceSoft p-3">
          <dt className="font-medium text-brand-muted">Tipo</dt>
          <dd className="mt-1 text-brand-text">{device.type}</dd>
        </div>
        <div className="rounded-2xl bg-brand-surfaceSoft p-3">
          <dt className="font-medium text-brand-muted">Protocolo</dt>
          <dd className="mt-1 uppercase text-brand-text">{device.communicationProtocol}</dd>
        </div>
        <div className="rounded-2xl bg-brand-surfaceSoft p-3">
          <dt className="font-medium text-brand-muted">Client ID</dt>
          <dd className="mt-1 text-brand-text">{device.clientId ?? 'Sin client'}</dd>
        </div>
        <div className="rounded-2xl bg-brand-surfaceSoft p-3">
          <dt className="font-medium text-brand-muted">Asset ID</dt>
          <dd className="mt-1 text-brand-text">{device.assetId ?? 'Sin asset'}</dd>
        </div>
        <div className="rounded-2xl bg-brand-surfaceSoft p-3 sm:col-span-2">
          <dt className="font-medium text-brand-muted">Ubicacion</dt>
          <dd className="mt-1 text-brand-muted">Ubicacion no cargada en este listado</dd>
        </div>
      </dl>

      <div className="flex justify-end">
        <Link
          to={`/app/devices/${device.idDevice}`}
          className="inline-flex items-center justify-center rounded-full bg-brand-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-primaryDark hover:shadow-md"
        >
          Ver detalle
        </Link>
      </div>
    </Card>
  );
}
