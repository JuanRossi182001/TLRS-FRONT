import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '../../../shared/components';
import { useAuth } from '../../auth/hooks/useAuth';
import { getClientIdFromToken } from '../../auth/utils/jwt';
import { useCreateAnimal } from '../hooks/useAnimals';
import type { AssetListItem } from '../types/animal.types';

type AnimalFormProps = {
  submitLabel?: string;
  onCreated: (animal: AssetListItem) => void;
  onCancel?: () => void;
};

export function AnimalForm({ submitLabel = 'Crear animal', onCreated, onCancel }: AnimalFormProps) {
  const { accessToken } = useAuth();
  const clientId = getClientIdFromToken(accessToken);
  const createAnimal = useCreateAnimal();
  const [serial, setSerial] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    if (!serial.trim()) {
      setErrorMessage('Ingresa el numero de caravana para continuar.');
      return;
    }

    if (!clientId) {
      setErrorMessage('No pudimos identificar tu establecimiento. Vuelve a iniciar sesion e intentalo nuevamente.');
      return;
    }

    try {
      const animal = await createAnimal.mutateAsync({ serial: serial.trim(), client_id: clientId });
      onCreated(animal);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'No pudimos crear el animal.');
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <label className="block text-sm font-semibold text-brand-text">
        Numero de caravana
        <input
          autoFocus
          className="mt-2 min-h-11 w-full rounded-2xl border border-brand-border bg-white px-3 py-2 text-sm font-normal outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
          maxLength={255}
          onChange={(event) => setSerial(event.target.value)}
          placeholder="Ej. 1842"
          value={serial}
        />
      </label>

      {errorMessage ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-brand-danger">{errorMessage}</p> : null}

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {onCancel ? <Button disabled={createAnimal.isPending} onClick={onCancel} variant="secondary">Cancelar</Button> : null}
        <Button className="w-full sm:w-auto" disabled={createAnimal.isPending} type="submit">
          {createAnimal.isPending ? 'Creando...' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
