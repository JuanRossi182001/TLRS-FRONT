import { Link, useParams } from 'react-router-dom';
import { Card, EmptyState, ErrorState, LoadingState, PageHeader, StatusBadge } from '../../../shared/components';
import { DeviceStateBadge } from '../components/DeviceStateBadge';
import { useMyDevices } from '../hooks/useMyDevices';

export function DeviceDetailPage() {
  const { deviceId } = useParams<{ deviceId: string }>();
  const idDevice = Number(deviceId);
  const { data: devices = [], isError, isLoading, error } = useMyDevices();
  const device = devices.find((item) => item.idDevice === idDevice);

  if (isLoading) {
    return <LoadingState message="Cargando dispositivo..." />;
  }

  if (isError) {
    return (
      <ErrorState
        title="No pudimos cargar el dispositivo"
        message={error instanceof Error ? error.message : 'Intentalo nuevamente.'}
      />
    );
  }

  if (!device) {
    return (
      <section className="space-y-4">
        <PageHeader
          title="Device no encontrado"
          description="No hay un device asociado al identificador solicitado."
        />

        <EmptyState
          title="No encontramos este device"
          message="Volver al listado para seleccionar un rastreador disponible."
        />

        <Link
          to="/app/devices"
          className="inline-flex items-center justify-center rounded-md border border-brand-border bg-brand-surface px-4 py-2 text-sm font-medium text-brand-primary transition hover:bg-brand-surfaceSoft"
        >
          Volver al listado
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <PageHeader
        title={device.name}
        description="Detalle del device devuelto por /devices/my-devices."
        actions={<DeviceStateBadge state={device.state} />}
      />

      <Card className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-semibold tracking-tight text-brand-text">Device</h2>
          <StatusBadge
            label={device.active ? 'Activo' : 'Inactivo'}
            tone={device.active ? 'success' : 'default'}
          />
        </div>

        <dl className="grid gap-4 text-sm sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-brand-surfaceSoft p-4">
            <dt className="font-medium text-brand-muted">ID</dt>
            <dd className="mt-1 text-brand-text">{device.idDevice}</dd>
          </div>
          <div className="rounded-2xl bg-brand-surfaceSoft p-4">
            <dt className="font-medium text-brand-muted">Serial</dt>
            <dd className="mt-1 text-brand-text">{device.serial}</dd>
          </div>
          <div className="rounded-2xl bg-brand-surfaceSoft p-4">
            <dt className="font-medium text-brand-muted">Nombre</dt>
            <dd className="mt-1 text-brand-text">{device.name}</dd>
          </div>
          <div className="rounded-2xl bg-brand-surfaceSoft p-4">
            <dt className="font-medium text-brand-muted">Tipo</dt>
            <dd className="mt-1 text-brand-text">{device.type}</dd>
          </div>
          <div className="rounded-2xl bg-brand-surfaceSoft p-4">
            <dt className="font-medium text-brand-muted">Estado</dt>
            <dd className="mt-1 text-brand-text">{device.state}</dd>
          </div>
          <div className="rounded-2xl bg-brand-surfaceSoft p-4">
            <dt className="font-medium text-brand-muted">Protocolo</dt>
            <dd className="mt-1 uppercase text-brand-text">{device.communicationProtocol}</dd>
          </div>
          <div className="rounded-2xl bg-brand-surfaceSoft p-4">
            <dt className="font-medium text-brand-muted">Client ID</dt>
            <dd className="mt-1 text-brand-text">{device.clientId ?? 'Sin client'}</dd>
          </div>
          <div className="rounded-2xl bg-brand-surfaceSoft p-4">
            <dt className="font-medium text-brand-muted">Asset ID</dt>
            <dd className="mt-1 text-brand-text">{device.assetId ?? 'Sin asset'}</dd>
          </div>
        </dl>
      </Card>

      <Link
        to="/app/devices"
        className="inline-flex w-fit items-center justify-center rounded-full border border-brand-border/70 bg-brand-surface px-5 py-2.5 text-sm font-semibold text-brand-primary shadow-sm transition hover:bg-brand-surfaceSoft hover:shadow-md"
      >
        Volver al listado
      </Link>
    </section>
  );
}
