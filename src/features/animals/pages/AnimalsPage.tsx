import { Plus } from 'lucide-react';
import { useDeferredValue, useMemo, useState } from 'react';
import { Button, EmptyState, ErrorState, LoadingState, PageHeader, ResponsiveDialog } from '../../../shared/components';
import { useAllMyDevices } from '../../devices/hooks/useAllMyDevices';
import { AnimalForm } from '../components/AnimalForm';
import { AnimalList } from '../components/AnimalList';
import { useAnimalRodeos } from '../hooks/useAnimalRodeos';
import { useAnimals } from '../hooks/useAnimals';

type AnimalFilter = 'all' | 'assigned' | 'unassigned';

export function AnimalsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<AnimalFilter>('all');
  const deferredSearch = useDeferredValue(search.trim().toLowerCase());
  const animalsQuery = useAnimals();
  const devicesQuery = useAllMyDevices();
  const rodeosQuery = useAnimalRodeos();
  const animals = animalsQuery.data ?? [];
  const devicesById = useMemo(() => new Map((devicesQuery.data ?? []).map((device) => [device.idDevice, device])), [devicesQuery.data]);
  const filteredAnimals = useMemo(() => animals.filter((animal) => {
    if (filter === 'assigned' && animal.assigned_device_id === null) return false;
    if (filter === 'unassigned' && animal.assigned_device_id !== null) return false;
    return !deferredSearch || animal.serial.toLowerCase().includes(deferredSearch);
  }), [animals, deferredSearch, filter]);
  const isLoading = animalsQuery.isLoading || devicesQuery.isLoading || rodeosQuery.isLoading;
  const error = animalsQuery.error ?? devicesQuery.error ?? rodeosQuery.error;

  return (
    <section className="space-y-4 lg:space-y-5">
      <PageHeader
        title="Animales"
        description="Gestiona los animales de tu establecimiento."
        actions={<Button onClick={() => setIsCreateOpen(true)}><Plus className="mr-1 h-4 w-4" aria-hidden="true" />Agregar animal</Button>}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input className="min-h-11 flex-1 rounded-2xl border border-brand-border bg-brand-surface px-3 py-2 text-sm outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15" onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por caravana..." value={search} />
        <div className="grid grid-cols-3 rounded-2xl border border-brand-border bg-brand-surfaceSoft p-1 text-xs font-semibold sm:flex">
          {([['all', 'Todos'], ['assigned', 'Con collar'], ['unassigned', 'Sin collar']] as const).map(([value, label]) => <button className={`rounded-xl px-3 py-2 transition ${filter === value ? 'bg-brand-surface text-brand-primary shadow-sm' : 'text-brand-muted hover:text-brand-text'}`} key={value} onClick={() => setFilter(value)} type="button">{label}</button>)}
        </div>
      </div>

      {isLoading ? <LoadingState message="Cargando animales..." /> : null}
      {error ? <ErrorState title="No pudimos cargar los animales" message={error instanceof Error ? error.message : 'Intentalo nuevamente.'} /> : null}
      {!isLoading && !error && animals.length === 0 ? <EmptyState title="Todavia no cargaste animales." message="Agrega el primer animal para empezar a gestionar sus collares." /> : null}
      {!isLoading && !error && animals.length > 0 && filteredAnimals.length === 0 ? <EmptyState title="No encontramos animales con esa caravana." message="Prueba otra busqueda o agrega un animal nuevo." /> : null}
      {!isLoading && !error && filteredAnimals.length > 0 ? <AnimalList animals={filteredAnimals} devicesById={devicesById} rodeosByAnimalId={rodeosQuery.data ?? new Map()} /> : null}

      <ResponsiveDialog isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Nuevo animal" subtitle="Carga la caravana para agregarlo a tu establecimiento.">
        <AnimalForm onCancel={() => setIsCreateOpen(false)} onCreated={() => setIsCreateOpen(false)} />
      </ResponsiveDialog>
    </section>
  );
}
