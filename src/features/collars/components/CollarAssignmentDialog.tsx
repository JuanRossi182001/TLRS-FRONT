import { useDeferredValue, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, ResponsiveDialog } from '../../../shared/components';
import type { Device } from '../../devices/types/device.types';
import { AnimalForm } from '../../animals/components/AnimalForm';
import type { AssetListItem } from '../../animals/types/animal.types';
import { useAssignCollar } from '../hooks/useCollarAssignment';

type CollarAssignmentDialogProps = {
  device: Device;
  animals: AssetListItem[];
  rodeosByAnimalId: Map<number, string[]>;
  currentAnimal?: AssetListItem;
  onClose: () => void;
};

type DialogStep = 'picker' | 'create' | 'confirm' | 'success';

function collarName(device: Device) {
  return device.name.trim() || device.serial;
}

export function CollarAssignmentDialog({ device, animals, rodeosByAnimalId, currentAnimal, onClose }: CollarAssignmentDialogProps) {
  const [step, setStep] = useState<DialogStep>('picker');
  const [selectedAnimal, setSelectedAnimal] = useState<AssetListItem | null>(null);
  const [search, setSearch] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const deferredSearch = useDeferredValue(search.trim().toLowerCase());
  const assignCollar = useAssignCollar();
  const candidates = useMemo(() => animals.filter((animal) => (
    animal.assigned_device_id === null && (!deferredSearch || animal.serial.toLowerCase().includes(deferredSearch))
  )), [animals, deferredSearch]);
  const title = currentAnimal ? 'Cambiar collar de animal' : 'Asignar collar';

  async function confirmAssignment() {
    if (!selectedAnimal) return;
    setErrorMessage(null);

    try {
      await assignCollar.mutateAsync({ deviceId: device.idDevice, assetId: selectedAnimal.id_asset });
      setStep('success');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'No pudimos asignar el collar.');
    }
  }

  const selectedRodeos = selectedAnimal ? rodeosByAnimalId.get(selectedAnimal.id_asset) ?? [] : [];

  return (
    <ResponsiveDialog isOpen onClose={onClose} title={title} subtitle={collarName(device)}>
      {step === 'picker' ? (
        <div className="space-y-4">
          {currentAnimal ? <p className="rounded-2xl bg-brand-surfaceSoft px-4 py-3 text-sm text-brand-muted">Actualmente: <strong className="text-brand-text">Caravana {currentAnimal.serial}</strong></p> : null}
          <div><p className="font-medium text-brand-text">¿A qué animal le estas colocando este collar?</p><p className="mt-1 text-sm text-brand-muted">Mostramos animales que no tienen un collar asignado.</p></div>
          <input autoFocus className="min-h-11 w-full rounded-2xl border border-brand-border bg-white px-3 py-2 text-sm outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15" onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por caravana..." value={search} />
          <div className="max-h-72 space-y-2 overflow-y-auto">
            {candidates.map((animal) => <button className="flex w-full items-center justify-between rounded-2xl border border-brand-border/70 px-4 py-3 text-left transition hover:bg-brand-surfaceSoft focus:outline-none focus:ring-2 focus:ring-brand-primary/30" key={animal.id_asset} onClick={() => { setSelectedAnimal(animal); setStep('confirm'); }} type="button"><span><span className="block font-semibold text-brand-text">{animal.serial}</span><span className="mt-0.5 block text-sm text-brand-muted">{(rodeosByAnimalId.get(animal.id_asset) ?? []).join(', ') || 'Sin rodeo'}</span></span><span className="text-brand-primary" aria-hidden="true">›</span></button>)}
            {candidates.length === 0 ? <p className="rounded-2xl bg-brand-surfaceSoft px-4 py-3 text-sm text-brand-muted">No encontramos animales disponibles con esa caravana.</p> : null}
          </div>
          <div className="border-t border-brand-border/60 pt-4"><p className="text-sm text-brand-muted">¿No encontras el animal?</p><Button className="mt-2" onClick={() => setStep('create')} variant="secondary">Crear animal</Button></div>
        </div>
      ) : null}

      {step === 'create' ? <div className="space-y-4"><p className="text-sm text-brand-muted">Crea el animal y luego confirma la asignacion del collar.</p><AnimalForm onCancel={() => setStep('picker')} onCreated={(animal) => { setSelectedAnimal(animal); setStep('confirm'); }} submitLabel="Crear y continuar" /></div> : null}

      {step === 'confirm' && selectedAnimal ? (
        <div className="space-y-5">
          <div className="rounded-2xl bg-brand-surfaceSoft p-4 text-center"><p className="text-sm text-brand-muted">Collar</p><p className="mt-1 font-semibold text-brand-text">{collarName(device)}</p><p className="my-3 text-brand-primary" aria-hidden="true">↓</p><p className="text-sm text-brand-muted">Animal</p><p className="mt-1 font-semibold text-brand-text">Caravana {selectedAnimal.serial}</p>{selectedRodeos.length ? <p className="mt-1 text-sm text-brand-muted">{selectedRodeos.join(', ')}</p> : null}</div>
          {currentAnimal ? <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-brand-accentDark">Esto retirara el collar del animal actual y lo asignara al nuevo.</p> : null}
          {errorMessage ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-brand-danger">{errorMessage}</p> : null}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><Button disabled={assignCollar.isPending} onClick={() => setStep('picker')} variant="secondary">Volver</Button><Button disabled={assignCollar.isPending} onClick={confirmAssignment}>{assignCollar.isPending ? 'Asignando...' : currentAnimal ? 'Confirmar cambio' : 'Confirmar asignacion'}</Button></div>
        </div>
      ) : null}

      {step === 'success' && selectedAnimal ? <div className="space-y-5 text-center"><div className="rounded-2xl bg-emerald-50 p-5 text-emerald-800"><p className="text-lg font-semibold">Collar asignado correctamente</p><p className="mt-2 text-sm">{collarName(device)} ↓ Caravana {selectedAnimal.serial}</p></div><div className="flex flex-col gap-2 sm:flex-row sm:justify-center"><Link className="inline-flex min-h-10 items-center justify-center rounded-2xl bg-brand-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-primaryDark" onClick={onClose} to={`/app/collars/${device.idDevice}`}>Ver collar</Link><Button onClick={onClose} variant="secondary">Volver a collares</Button></div></div> : null}
    </ResponsiveDialog>
  );
}
