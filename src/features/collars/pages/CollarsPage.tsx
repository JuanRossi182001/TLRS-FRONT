import { useDeferredValue, useMemo, useState } from 'react';
import { EmptyState, ErrorState, LoadingState, PageHeader } from '../../../shared/components';
import { normalizeDeviceState } from '../../devices/components/DeviceStateBadge';
import { useAllMyDevices } from '../../devices/hooks/useAllMyDevices';
import { useAnimalRodeos } from '../../animals/hooks/useAnimalRodeos';
import { useAnimals } from '../../animals/hooks/useAnimals';
import { CollarList } from '../components/CollarList';

type CollarFilter = 'all' | 'assigned' | 'available' | 'offline';

export function CollarsPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<CollarFilter>('all');
  const deferredSearch = useDeferredValue(search.trim().toLowerCase());
  const devicesQuery = useAllMyDevices();
  const animalsQuery = useAnimals();
  const rodeosQuery = useAnimalRodeos();
  const animals = animalsQuery.data ?? [];
  const animalsById = useMemo(() => new Map(animals.map((animal) => [animal.id_asset, animal])), [animals]);
  const devices = useMemo(() => (devicesQuery.data ?? []).filter((device) => {
    const animal = device.assetId ? animalsById.get(device.assetId) : undefined;
    const text = `${device.name} ${device.serial} ${animal?.serial ?? ''}`.toLowerCase();
    if (deferredSearch && !text.includes(deferredSearch)) return false;
    if (filter === 'assigned') return device.assetId !== null;
    if (filter === 'available') return device.assetId === null;
    if (filter === 'offline') return normalizeDeviceState(device.state) !== 'online';
    return true;
  }), [animalsById, deferredSearch, devicesQuery.data, filter]);
  const isLoading = devicesQuery.isLoading || animalsQuery.isLoading || rodeosQuery.isLoading;
  const error = devicesQuery.error ?? animalsQuery.error ?? rodeosQuery.error;

  return <section className="space-y-4 lg:space-y-5"><PageHeader title="Collares" description="Gestiona los collares de tus animales." /><div className="flex flex-col gap-3 sm:flex-row sm:items-center"><input className="min-h-11 flex-1 rounded-2xl border border-brand-border bg-brand-surface px-3 py-2 text-sm outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15" onChange={(event) => setSearch(event.target.value)} placeholder="Buscar collar o caravana..." value={search} /><div className="grid grid-cols-2 rounded-2xl border border-brand-border bg-brand-surfaceSoft p-1 text-xs font-semibold sm:flex">{([['all', 'Todos'], ['assigned', 'Asignados'], ['available', 'Disponibles'], ['offline', 'Sin conexion']] as const).map(([value, label]) => <button className={`rounded-xl px-3 py-2 transition ${filter === value ? 'bg-brand-surface text-brand-primary shadow-sm' : 'text-brand-muted hover:text-brand-text'}`} key={value} onClick={() => setFilter(value)} type="button">{label}</button>)}</div></div>{isLoading ? <LoadingState message="Cargando collares..." /> : null}{error ? <ErrorState title="No pudimos cargar los collares" message={error instanceof Error ? error.message : 'Intentalo nuevamente.'} /> : null}{!isLoading && !error && (devicesQuery.data ?? []).length === 0 ? <EmptyState title="No hay collares disponibles para tu cuenta." message="Los collares registrados apareceran aqui." /> : null}{!isLoading && !error && (devicesQuery.data ?? []).length > 0 && devices.length === 0 ? <EmptyState title="No encontramos collares con ese criterio." message="Prueba otra busqueda o filtro." /> : null}{!isLoading && !error && devices.length > 0 ? <CollarList animalsById={animalsById} devices={devices} rodeosByAnimalId={rodeosQuery.data ?? new Map()} /> : null}</section>;
}
