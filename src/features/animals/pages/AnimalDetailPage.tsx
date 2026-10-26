import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Button, Card, EmptyState, ErrorState, LoadingState, PageHeader } from '../../../shared/components';
import { CollarConnectionBadge } from '../../collars/components/CollarConnectionBadge';
import { useAllMyDevices } from '../../devices/hooks/useAllMyDevices';
import { useAnimalRodeos } from '../hooks/useAnimalRodeos';
import { useAnimals } from '../hooks/useAnimals';

export function AnimalDetailPage() {
  const { assetId } = useParams<{ assetId: string }>();
  const animalId = Number(assetId);
  const animalsQuery = useAnimals();
  const devicesQuery = useAllMyDevices();
  const rodeosQuery = useAnimalRodeos();
  const animal = (animalsQuery.data ?? []).find((item) => item.id_asset === animalId);
  const collar = animal?.assigned_device_id ? (devicesQuery.data ?? []).find((device) => device.idDevice === animal.assigned_device_id) : undefined;
  const isLoading = animalsQuery.isLoading || devicesQuery.isLoading || rodeosQuery.isLoading;
  const error = animalsQuery.error ?? devicesQuery.error ?? rodeosQuery.error;

  if (isLoading) return <LoadingState message="Cargando animal..." />;
  if (error) return <ErrorState title="No pudimos cargar el animal" message={error instanceof Error ? error.message : 'Intentalo nuevamente.'} />;
  if (!animal) return <section className="space-y-4"><PageHeader title="Animal no encontrado" description="No encontramos un animal asociado a este identificador." /><EmptyState title="No encontramos este animal" message="Vuelve al listado para seleccionar otro animal." /><Link className="inline-flex items-center gap-2 text-sm font-semibold text-brand-primary" to="/app/animals"><ArrowLeft className="h-4 w-4" />Volver a animales</Link></section>;

  const rodeos = rodeosQuery.data?.get(animal.id_asset) ?? [];

  return <section className="space-y-4 lg:space-y-5"><PageHeader title={`Caravana ${animal.serial}`} description="Informacion del animal y su collar actual." actions={<Link className="inline-flex min-h-10 items-center gap-2 rounded-2xl border border-brand-border/70 bg-brand-surface px-4 py-2 text-sm font-semibold text-brand-primary transition hover:bg-brand-surfaceSoft" to="/app/animals"><ArrowLeft className="h-4 w-4" />Animales</Link>} /><Card className="space-y-5"><div><h2 className="text-sm font-semibold uppercase tracking-wide text-brand-muted">Informacion</h2><dl className="mt-3 grid gap-3 sm:grid-cols-2"><div className="rounded-2xl bg-brand-surfaceSoft p-4"><dt className="text-sm text-brand-muted">Rodeos</dt><dd className="mt-1 font-medium text-brand-text">{rodeos.join(', ') || 'Sin rodeo'}</dd></div><div className="rounded-2xl bg-brand-surfaceSoft p-4"><dt className="text-sm text-brand-muted">Estado</dt><dd className="mt-1 font-medium text-brand-text">{animal.status === 'ACTIVE' ? 'Activo' : animal.status}</dd></div></dl></div><div className="border-t border-brand-border/60 pt-5"><h2 className="text-sm font-semibold uppercase tracking-wide text-brand-muted">Collar</h2>{collar ? <div className="mt-3 flex flex-col gap-3 rounded-2xl bg-brand-surfaceSoft p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-semibold text-brand-text">{collar.name || collar.serial}</p><div className="mt-2"><CollarConnectionBadge state={collar.state} /></div></div><Link className="inline-flex min-h-10 items-center justify-center gap-1 rounded-2xl border border-brand-border bg-brand-surface px-4 py-2 text-sm font-semibold text-brand-primary transition hover:bg-white" to={`/app/collars/${collar.idDevice}`}>Ver collar <ChevronRight className="h-4 w-4" /></Link></div> : <div className="mt-3 rounded-2xl bg-brand-surfaceSoft p-4"><p className="font-medium text-brand-text">Este animal no tiene un collar colocado.</p><p className="mt-1 text-sm text-brand-muted">Elige un collar disponible para asignarlo.</p><Link className="mt-3 inline-flex min-h-10 items-center justify-center rounded-2xl bg-brand-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-primaryDark" to="/app/collars">Asignar collar</Link></div>}</div></Card></section>;
}
