import { ChevronRight } from 'lucide-react';
import { StatusBadge } from '../../../shared/components';
import { DeviceStateBadge } from '../../devices/components/DeviceStateBadge';
import { getDeviceAssetName } from '../../devices/types/device.types';
import { GeofenceStatusBadge } from '../../geofences/components/GeofenceStatusBadge';
import type { AdminDeviceListItem } from '../types/admin.types';

type AdminDeviceListProps = {
  devices: AdminDeviceListItem[];
  onSelect: (device: AdminDeviceListItem) => void;
};

function AssignmentLabel({ device }: { device: AdminDeviceListItem }) {
  if (device.asset_id === null) {
    return <StatusBadge label="Sin asignar" />;
  }

  return <span className="font-medium text-brand-text">{getDeviceAssetName(device, 'Asset sin nombre')}</span>;
}

function handleRowKeyDown(event: React.KeyboardEvent<HTMLTableRowElement>, onSelect: () => void) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    onSelect();
  }
}

export function AdminDeviceList({ devices, onSelect }: AdminDeviceListProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-brand-border/60 bg-brand-surface shadow-sm shadow-brand-primary/5 lg:rounded-3xl">
      <div className="divide-y divide-brand-border/60 lg:hidden">
        {devices.map((device) => (
          <button
            className="flex w-full items-start gap-3 p-3 text-left transition active:bg-brand-surfaceSoft focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-primary/30"
            key={device.id_device}
            onClick={() => onSelect(device)}
            type="button"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-semibold text-brand-text">{device.serial}</p>
                <ChevronRight className="h-4 w-4 shrink-0 text-brand-muted" aria-hidden="true" />
              </div>
              <p className="mt-1 truncate text-sm text-brand-muted">
                {device.asset_id === null ? 'Sin asignar' : getDeviceAssetName(device, 'Asset sin nombre')}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <DeviceStateBadge state={device.state} />
                <GeofenceStatusBadge current_status={device.status} />
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="hidden lg:block">
        <table className="min-w-full divide-y divide-brand-border/60 text-sm">
          <thead className="bg-brand-surfaceSoft text-left text-xs uppercase tracking-wide text-brand-muted">
            <tr>
              <th className="px-5 py-3 font-semibold">Serial</th>
              <th className="px-5 py-3 font-semibold">Nombre</th>
              <th className="px-5 py-3 font-semibold">Cliente</th>
              <th className="px-5 py-3 font-semibold">Asignacion</th>
              <th className="px-5 py-3 font-semibold">Conexion</th>
              <th className="px-5 py-3 font-semibold">Geocerca</th>
              <th aria-label="Ver detalle" className="w-12 px-3 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border/50">
            {devices.map((device) => (
              <tr
                aria-label={`Ver detalle de ${device.serial}`}
                className="cursor-pointer transition hover:bg-brand-surfaceSoft/60 focus:bg-brand-surfaceSoft focus:outline-none"
                key={device.id_device}
                onClick={() => onSelect(device)}
                onKeyDown={(event) => handleRowKeyDown(event, () => onSelect(device))}
                role="button"
                tabIndex={0}
              >
                <td className="whitespace-nowrap px-5 py-3.5 font-semibold text-brand-text">{device.serial}</td>
                <td className="max-w-44 truncate px-5 py-3.5 text-brand-text">{device.name}</td>
                <td className="max-w-40 truncate px-5 py-3.5 text-brand-text">{device.client_name ?? 'Sin cliente'}</td>
                <td className="max-w-48 truncate px-5 py-3.5"><AssignmentLabel device={device} /></td>
                <td className="whitespace-nowrap px-5 py-3.5"><DeviceStateBadge state={device.state} /></td>
                <td className="whitespace-nowrap px-5 py-3.5"><GeofenceStatusBadge current_status={device.status} /></td>
                <td className="px-3 py-3.5 text-brand-muted"><ChevronRight className="h-4 w-4" aria-hidden="true" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
