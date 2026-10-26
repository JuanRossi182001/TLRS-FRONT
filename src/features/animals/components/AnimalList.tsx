import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CollarConnectionBadge } from '../../collars/components/CollarConnectionBadge';
import type { Device } from '../../devices/types/device.types';
import type { AssetListItem } from '../types/animal.types';

type AnimalListProps = {
  animals: AssetListItem[];
  devicesById: Map<number, Device>;
  rodeosByAnimalId: Map<number, string[]>;
};

export function AnimalList({ animals, devicesById, rodeosByAnimalId }: AnimalListProps) {
  return (
    <>
      <div className="hidden overflow-hidden rounded-3xl border border-brand-border/60 bg-brand-surface md:block">
        <div className="grid grid-cols-[minmax(8rem,1fr)_minmax(10rem,1.3fr)_minmax(9rem,1fr)_8rem] gap-4 border-b border-brand-border/60 bg-brand-surfaceSoft px-5 py-3 text-xs font-semibold uppercase tracking-wide text-brand-muted">
          <span>Caravana</span><span>Rodeo</span><span>Collar</span><span>Estado</span>
        </div>
        {animals.map((animal) => {
          const device = animal.assigned_device_id ? devicesById.get(animal.assigned_device_id) : undefined;
          const rodeos = rodeosByAnimalId.get(animal.id_asset) ?? [];

          return (
            <Link className="grid grid-cols-[minmax(8rem,1fr)_minmax(10rem,1.3fr)_minmax(9rem,1fr)_8rem] items-center gap-4 border-b border-brand-border/50 px-5 py-4 text-sm transition last:border-b-0 hover:bg-brand-surfaceSoft focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-primary/30" key={animal.id_asset} to={`/app/animals/${animal.id_asset}`}>
              <span className="font-semibold text-brand-text">{animal.serial}</span>
              <span className="truncate text-brand-muted">{rodeos.join(', ') || '—'}</span>
              <span className="truncate text-brand-muted">{device?.name ?? 'Sin collar'}</span>
              {device ? <CollarConnectionBadge state={device.state} /> : <span className="text-brand-muted">—</span>}
            </Link>
          );
        })}
      </div>

      <div className="grid gap-2 md:hidden">
        {animals.map((animal) => {
          const device = animal.assigned_device_id ? devicesById.get(animal.assigned_device_id) : undefined;
          const rodeos = rodeosByAnimalId.get(animal.id_asset) ?? [];

          return (
            <Link className="flex items-start gap-3 rounded-2xl border border-brand-border/60 bg-brand-surface p-3 transition active:bg-brand-surfaceSoft focus:outline-none focus:ring-2 focus:ring-brand-primary/30" key={animal.id_asset} to={`/app/animals/${animal.id_asset}`}>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-brand-text">{animal.serial}</p>
                <p className="mt-1 truncate text-sm text-brand-muted">{rodeos.join(', ') || 'Sin rodeo'}</p>
                {device ? <div className="mt-2 flex items-center gap-2"><span className="truncate text-sm text-brand-text">{device.name}</span><CollarConnectionBadge state={device.state} /></div> : <p className="mt-2 text-sm text-brand-muted">Sin collar</p>}
              </div>
              <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-brand-muted" aria-hidden="true" />
            </Link>
          );
        })}
      </div>
    </>
  );
}
