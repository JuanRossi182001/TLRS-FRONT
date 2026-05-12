import { Link, useParams } from 'react-router-dom';
import { Card, EmptyState, PageHeader, StatusBadge } from '../../../shared/components';
import { AssetBadge } from '../components/AssetBadge';
import { ClientBadge } from '../components/ClientBadge';
import { DeviceLastSeen } from '../components/DeviceLastSeen';
import { DeviceLocationPreview } from '../components/DeviceLocationPreview';
import { DeviceStateBadge } from '../components/DeviceStateBadge';
import { devicesMock } from '../mocks/devices.mock';

function formatCoordinate(value: number) {
  return value.toFixed(5);
}

export function DeviceDetailPage() {
  const { deviceId } = useParams<{ deviceId: string }>();
  const idDevice = Number(deviceId);
  const item = devicesMock.find((trackingItem) => trackingItem.device.idDevice === idDevice);

  if (!item) {
    return (
      <section className="space-y-4">
        <PageHeader
          title="Device no encontrado"
          description="No hay un device mock asociado al identificador solicitado."
        />

        <EmptyState
          title="No encontramos este device"
          message="Volver al listado para seleccionar un rastreador disponible."
        />

        <Link
          to="/app/devices"
          className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Volver al listado
        </Link>
      </section>
    );
  }

  const { device, asset, client, lastLocation } = item;

  return (
    <section className="space-y-4">
      <PageHeader
        title={device.name}
        description="Detalle tecnico del device, su client, asset asociado y ultima location recibida."
        actions={<DeviceStateBadge state={device.state} />}
      />

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-slate-950">Device</h2>
            <StatusBadge
              label={device.active ? 'Activo' : 'Inactivo'}
              tone={device.active ? 'success' : 'default'}
            />
          </div>

          <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-medium text-slate-500">ID</dt>
              <dd className="mt-1 text-slate-950">{device.idDevice}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">Serial</dt>
              <dd className="mt-1 text-slate-950">{device.serial}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">Tipo</dt>
              <dd className="mt-1 text-slate-950">{device.type}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">Protocolo</dt>
              <dd className="mt-1 uppercase text-slate-950">
                {device.communicationProtocol}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="font-medium text-slate-500">Ultima conexion</dt>
              <dd className="mt-1 text-slate-950">
                <DeviceLastSeen value={device.lastSeenAt} />
              </dd>
            </div>
          </dl>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-slate-950">Relaciones</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            <ClientBadge client={client} />
            <AssetBadge asset={asset} />
          </div>

          <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-medium text-slate-500">Client</dt>
              <dd className="mt-1 text-slate-950">{client?.name ?? 'Sin client asociado'}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">Email client</dt>
              <dd className="mt-1 text-slate-950">{client?.email ?? 'Sin datos'}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">Asset type</dt>
              <dd className="mt-1 text-slate-950">{asset?.assetType ?? 'Sin asset'}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">Asset serial</dt>
              <dd className="mt-1 text-slate-950">{asset?.serial ?? 'Sin datos'}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">Asset status</dt>
              <dd className="mt-1 text-slate-950">{asset?.status ?? 'Sin datos'}</dd>
            </div>
          </dl>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-slate-950">Ultima location</h2>
        {lastLocation ? (
          <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2 xl:grid-cols-4">
            <div>
              <dt className="font-medium text-slate-500">Latitud</dt>
              <dd className="mt-1 text-slate-950">
                {formatCoordinate(lastLocation.latitude)}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">Longitud</dt>
              <dd className="mt-1 text-slate-950">
                {formatCoordinate(lastLocation.longitude)}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">Accuracy</dt>
              <dd className="mt-1 text-slate-950">
                {lastLocation.accuracy !== undefined ? `${lastLocation.accuracy} m` : 'Sin datos'}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">Altitud</dt>
              <dd className="mt-1 text-slate-950">
                {lastLocation.altitude !== undefined ? `${lastLocation.altitude} m` : 'Sin datos'}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">Device timestamp</dt>
              <dd className="mt-1 text-slate-950">
                <DeviceLastSeen value={lastLocation.deviceTimestamp} />
              </dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">Received at</dt>
              <dd className="mt-1 text-slate-950">
                <DeviceLastSeen value={lastLocation.receivedAt} />
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="font-medium text-slate-500">Preview</dt>
              <dd className="mt-1 text-slate-950">
                <DeviceLocationPreview location={lastLocation} />
              </dd>
            </div>
          </dl>
        ) : (
          <p className="mt-4 text-sm text-slate-600">
            Este device todavia no tiene ubicacion registrada.
          </p>
        )}
      </Card>

      <Link
        to="/app/devices"
        className="inline-flex w-fit items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
      >
        Volver al listado
      </Link>
    </section>
  );
}
