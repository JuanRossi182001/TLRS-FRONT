import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Device } from '../../devices/types/device.types';
import type { AssetListItem } from '../../animals/types/animal.types';
import { CollarConnectionBadge } from './CollarConnectionBadge';

type CollarListProps = {
  devices: Device[];
  animalsById: Map<number, AssetListItem>;
  rodeosByAnimalId: Map<number, string[]>;
};

function collarName(device: Device) {
  return device.name.trim() || device.serial;
}

export function CollarList({ devices, animalsById, rodeosByAnimalId }: CollarListProps) {
  return (
    <>
      <div className="hidden overflow-hidden rounded-3xl border border-brand-border/60 bg-brand-surface md:block">
        <div className="grid grid-cols-[minmax(9rem,1fr)_minmax(9rem,1fr)_minmax(10rem,1.3fr)_9rem] gap-4 border-b border-brand-border/60 bg-brand-surfaceSoft px-5 py-3 text-xs font-semibold uppercase tracking-wide text-brand-muted">
          <span>Collar</span><span>Animal</span><span>Rodeo</span><span>Conexion</span>
        </div>
        {devices.map((device) => {
          const animal = device.assetId ? animalsById.get(device.assetId) : undefined;
          const rodeos = animal ? rodeosByAnimalId.get(animal.id_asset) ?? [] : [];

          return (
            <Link className="grid grid-cols-[minmax(9rem,1fr)_minmax(9rem,1fr)_minmax(10rem,1.3fr)_9rem] items-center gap-4 border-b border-brand-border/50 px-5 py-4 text-sm transition last:border-b-0 hover:bg-brand-surfaceSoft focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-primary/30" key={device.idDevice} to={`/app/collars/${device.idDevice}`}>
              <span className="font-semibold text-brand-text">{collarName(device)}</span>
              <span className="truncate text-brand-muted">{animal ? `Caravana ${animal.serial}` : 'Sin asignar'}</span>
              <span className="truncate text-brand-muted">{rodeos.join(', ') || '—'}</span>
              <CollarConnectionBadge state={device.state} />
            </Link>
          );
        })}
      </div>

      <div className="grid gap-2 md:hidden">
        {devices.map((device) => {
          const animal = device.assetId ? animalsById.get(device.assetId) : undefined;
          const rodeos = animal ? rodeosByAnimalId.get(animal.id_asset) ?? [] : [];

          return (
            <Link className="flex items-start gap-3 rounded-2xl border border-brand-border/60 bg-brand-surface p-3 transition active:bg-brand-surfaceSoft focus:outline-none focus:ring-2 focus:ring-brand-primary/30" key={device.idDevice} to={`/app/collars/${device.idDevice}`}>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-brand-text">{collarName(device)}</p>
                <p className="mt-1 truncate text-sm text-brand-muted">{animal ? `Caravana ${animal.serial}${rodeos.length ? ` · ${rodeos.join(', ')}` : ''}` : 'Sin animal asignado'}</p>
                <div className="mt-2"><CollarConnectionBadge state={device.state} /></div>
              </div>
              <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-brand-muted" aria-hidden="true" />
            </Link>
          );
        })}
      </div>
    </>
  );
}
