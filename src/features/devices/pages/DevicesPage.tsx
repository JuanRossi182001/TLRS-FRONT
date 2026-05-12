import { Card, EmptyState, PageHeader } from '../../../shared/components';
import { DeviceList } from '../components/DeviceList';
import { useVisibleDevices } from '../hooks/useVisibleDevices';

export function DevicesPage() {
  const { visibleDevices, totalVisible, online, offline, withoutLocation } = useVisibleDevices();
  const activeDevices = visibleDevices.filter((item) => item.device.active).length;

  return (
    <section className="space-y-4">
      <PageHeader
        title="Dispositivos"
        description="Rastreadores GPS asociados a clients y assets, con ultima ubicacion reportada por cada device."
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <Card>
          <p className="text-sm font-medium text-slate-500">Total devices</p>
          <p className="mt-2 text-2xl font-semibold text-slate-950">{totalVisible}</p>
        </Card>
        <Card>
          <p className="text-sm font-medium text-slate-500">Online</p>
          <p className="mt-2 text-2xl font-semibold text-emerald-700">{online}</p>
        </Card>
        <Card>
          <p className="text-sm font-medium text-slate-500">Offline</p>
          <p className="mt-2 text-2xl font-semibold text-red-700">{offline}</p>
        </Card>
        <Card>
          <p className="text-sm font-medium text-slate-500">Activos</p>
          <p className="mt-2 text-2xl font-semibold text-sky-700">{activeDevices}</p>
        </Card>
        <Card>
          <p className="text-sm font-medium text-slate-500">Sin ubicacion</p>
          <p className="mt-2 text-2xl font-semibold text-amber-700">{withoutLocation}</p>
        </Card>
      </div>

      {visibleDevices.length > 0 ? (
        <DeviceList items={visibleDevices} />
      ) : (
        <EmptyState
          title="No hay devices cargados"
          message="Cuando existan rastreadores registrados, apareceran en este listado."
        />
      )}
    </section>
  );
}
