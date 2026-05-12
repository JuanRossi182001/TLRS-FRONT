import type { Client } from '../types/device.types';

type ClientBadgeProps = {
  client?: Client;
};

export function ClientBadge({ client }: ClientBadgeProps) {
  if (!client) {
    return (
      <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
        Sin client asociado
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">
      {client.name}
    </span>
  );
}
