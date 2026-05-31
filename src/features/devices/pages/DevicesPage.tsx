import { Card, EmptyState, ErrorState, LoadingState, PageHeader } from '../../../shared/components';
import { DeviceList } from '../components/DeviceList';
import { normalizeDeviceState } from '../components/DeviceStateBadge';
import { useMyDevices } from '../hooks/useMyDevices';

export function DevicesPage() {
  const { data: devices = [], isError, isLoading, error } = useMyDevices();
  const totalDevices = devices.length;
  const online = devices.filter((device) => normalizeDeviceState(device.state) === 'online').length;
  const offline = devices.filter((device) => normalizeDeviceState(device.state) === 'offline').length;
  const activeDevices = devices.filter((device) => device.active).length;
  const inactiveDevices = devices.filter((device) => !device.active).length;

  return (
    <section className="space-y-6">
      <PageHeader
        title="Dispositivos"
        description="Rastreadores GPS asociados a tu client y, cuando corresponda, a un asset."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Card className="bg-brand-primary text-white">
          <p className="text-sm font-medium text-brand-primary/70">Total devices</p>
          <p className="mt-3 text-3xl font-semibold text-brand-primary">{totalDevices}</p>
        </Card>
        <Card className="bg-brand-surface">
          <p className="text-sm font-medium text-brand-muted">Online</p>
          <p className="mt-3 text-3xl font-semibold text-brand-success">{online}</p>
        </Card>
        <Card>
          <p className="text-sm font-medium text-brand-muted">Offline</p>
          <p className="mt-3 text-3xl font-semibold text-brand-danger">{offline}</p>
        </Card>
        <Card className="bg-brand-accent text-brand-primary">
          <p className="text-sm font-medium text-brand-primary/70">Activos</p>
          <p className="mt-3 text-3xl font-semibold text-brand-primary">{activeDevices}</p>
        </Card>
        <Card>
          <p className="text-sm font-medium text-brand-muted">Inactivos</p>
          <p className="mt-3 text-3xl font-semibold text-brand-muted">{inactiveDevices}</p>
        </Card>
      </div>

      {isLoading ? <LoadingState message="Cargando dispositivos..." /> : null}

      {isError ? (
        <ErrorState
          title="No pudimos cargar los dispositivos"
          message={error instanceof Error ? error.message : 'Intentalo nuevamente.'}
        />
      ) : null}

      {!isLoading && !isError && devices.length > 0 ? <DeviceList devices={devices} /> : null}

      {!isLoading && !isError && devices.length === 0 ? (
        <EmptyState
          title="No hay devices cargados"
          message="Cuando existan rastreadores registrados, apareceran en este listado."
        />
      ) : null}
    </section>
  );
}
