import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Card, EmptyState, ErrorState, LoadingState, PageHeader, ResponsiveDialog, StatusBadge } from '../../../shared/components';
import { useAnimalRodeos } from '../../animals/hooks/useAnimalRodeos';
import { useAnimals } from '../../animals/hooks/useAnimals';
import { useAllMyDevices } from '../../devices/hooks/useAllMyDevices';
import { CollarAssignmentDialog } from '../components/CollarAssignmentDialog';
import { CollarConnectionBadge } from '../components/CollarConnectionBadge';
import { useReleaseCollar } from '../hooks/useCollarAssignment';

type Action = 'assign' | 'change' | 'release' | null;

function collarName(name: string, serial: string) {
  return name.trim() || serial;
}

export function CollarDetailPage() {
  const { deviceId } = useParams<{ deviceId: string }>();
  const idDevice = Number(deviceId);
  const [action, setAction] = useState<Action>(null);
  const [releaseError, setReleaseError] = useState<string | null>(null);
  const [releaseSuccess, setReleaseSuccess] = useState(false);
  const devicesQuery = useAllMyDevices();
  const animalsQuery = useAnimals();
  const rodeosQuery = useAnimalRodeos();
  const releaseCollar = useReleaseCollar();
  const device = (devicesQuery.data ?? []).find((item) => item.idDevice === idDevice);
  const animal = device?.assetId ? (animalsQuery.data ?? []).find((item) => item.id_asset === device.assetId) : undefined;
  const isLoading = devicesQuery.isLoading || animalsQuery.isLoading || rodeosQuery.isLoading;
  const error = devicesQuery.error ?? animalsQuery.error ?? rodeosQuery.error;

  async function release() {
    if (!device) return;
    setReleaseError(null);
    setReleaseSuccess(false);
    try {
      await releaseCollar.mutateAsync(device.idDevice);
      setAction(null);
      setReleaseSuccess(true);
    } catch (mutationError) {
      setReleaseError(mutationError instanceof Error ? mutationError.message : 'No pudimos retirar el collar.');
    }
  }

  if (isLoading) return <LoadingState message="Cargando collar..." />;
  if (error) return <ErrorState title="No pudimos cargar el collar" message={error instanceof Error ? error.message : 'Intentalo nuevamente.'} />;
  if (!device) return <section className="space-y-4"><PageHeader title="Collar no encontrado" description="No encontramos un collar asociado a este identificador." /><EmptyState title="No encontramos este collar" message="Vuelve al listado para seleccionar otro collar." /><Link className="inline-flex items-center gap-2 text-sm font-semibold text-brand-primary" to="/app/collars"><ArrowLeft className="h-4 w-4" />Volver a collares</Link></section>;

  const name = collarName(device.name, device.serial);
  const rodeos = animal ? rodeosQuery.data?.get(animal.id_asset) ?? [] : [];

  return <section className="space-y-4 lg:space-y-5"><PageHeader title={name} description="Informacion y asignacion actual del collar." actions={<div className="flex items-center gap-2"><CollarConnectionBadge state={device.state} /><Link className="inline-flex min-h-10 items-center gap-2 rounded-2xl border border-brand-border/70 bg-brand-surface px-4 py-2 text-sm font-semibold text-brand-primary transition hover:bg-brand-surfaceSoft" to="/app/collars"><ArrowLeft className="h-4 w-4" />Collares</Link></div>} />{releaseSuccess ? <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">Collar disponible. {name} ya no esta asignado a ningun animal.</div> : null}<Card className="space-y-5"><div><h2 className="text-sm font-semibold uppercase tracking-wide text-brand-muted">Asignacion</h2>{animal ? <div className="mt-3 rounded-2xl bg-brand-surfaceSoft p-4"><p className="font-semibold text-brand-text">Caravana {animal.serial}</p><p className="mt-1 text-sm text-brand-muted">{rodeos.join(', ') || 'Sin rodeo'}</p><Link className="mt-3 inline-flex text-sm font-semibold text-brand-primary" to={`/app/animals/${animal.id_asset}`}>Ver animal</Link></div> : <div className="mt-3 rounded-2xl bg-brand-surfaceSoft p-4"><p className="font-medium text-brand-text">Este collar no esta colocado en ningun animal.</p><p className="mt-1 text-sm text-brand-muted">Asignalo cuando lo coloques en un animal.</p><Button className="mt-3" onClick={() => setAction('assign')}>Asignar a un animal</Button></div>}</div><div className="border-t border-brand-border/60 pt-5"><h2 className="text-sm font-semibold uppercase tracking-wide text-brand-muted">Estado del collar</h2><div className="mt-3 grid gap-3 sm:grid-cols-2"><div className="rounded-2xl bg-brand-surfaceSoft p-4"><p className="text-sm text-brand-muted">Conexion</p><div className="mt-2"><CollarConnectionBadge state={device.state} /></div></div><div className="rounded-2xl bg-brand-surfaceSoft p-4"><p className="text-sm text-brand-muted">Disponibilidad</p><div className="mt-2"><StatusBadge label={device.active ? 'Activo' : 'Sin conexion'} tone={device.active ? 'success' : 'default'} /></div></div></div></div>{animal ? <div className="flex flex-col gap-2 border-t border-brand-border/60 pt-5 sm:flex-row"><Button className="sm:flex-1" onClick={() => setAction('change')} variant="secondary">Cambiar de animal</Button><Button className="sm:flex-1" onClick={() => setAction('release')} variant="secondary">Retirar collar</Button></div> : null}</Card>{action === 'assign' || action === 'change' ? <CollarAssignmentDialog animals={animalsQuery.data ?? []} currentAnimal={action === 'change' ? animal : undefined} device={device} onClose={() => setAction(null)} rodeosByAnimalId={rodeosQuery.data ?? new Map()} /> : null}<ResponsiveDialog isOpen={action === 'release'} onClose={() => setAction(null)} title="Retirar collar" subtitle={name}><div className="space-y-5"><p className="text-sm leading-6 text-brand-text">{name} esta actualmente colocado en <strong>Caravana {animal?.serial}</strong>.</p><p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-brand-accentDark">¿Confirmas que el collar fue retirado del animal? Quedara sin asignar y sin conexion hasta volver a colocarlo.</p>{releaseError ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-brand-danger">{releaseError}</p> : null}<div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><Button disabled={releaseCollar.isPending} onClick={() => setAction(null)} variant="secondary">Cancelar</Button><Button disabled={releaseCollar.isPending} onClick={release}>{releaseCollar.isPending ? 'Retirando...' : 'Retirar collar'}</Button></div></div></ResponsiveDialog></section>;
}
