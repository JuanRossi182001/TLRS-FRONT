import { StatusBadge } from '../../../shared/components';

type Column<T> = {
  key: keyof T;
  label: string;
};

type AdminTablePlaceholderProps<T extends { id: number }> = {
  columns: Column<T>[];
  rows: T[];
  actions: string[];
  note?: string;
};

export function AdminTablePlaceholder<T extends { id: number }>({
  columns,
  rows,
  actions,
  note = 'Las acciones se conectaran cuando existan los endpoints admin.',
}: AdminTablePlaceholderProps<T>) {
  return (
    <div className="overflow-hidden rounded-3xl border border-brand-border/60 bg-brand-surface shadow-sm shadow-brand-primary/5">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-brand-border/60 text-sm">
          <thead className="bg-brand-surfaceSoft text-left text-xs uppercase tracking-wide text-brand-muted">
            <tr>
              {columns.map((column) => (
                <th key={String(column.key)} className="px-5 py-4 font-semibold">
                  {column.label}
                </th>
              ))}
              <th className="px-5 py-4 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border/50">
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-brand-surfaceSoft/60">
                {columns.map((column) => (
                  <td key={String(column.key)} className="whitespace-nowrap px-5 py-4 text-brand-text">
                    {String(row[column.key] ?? 'Sin datos')}
                  </td>
                ))}
                <td className="whitespace-nowrap px-5 py-4">
                  <div className="flex flex-wrap gap-2">
                    {actions.map((action) => (
                      <button
                        key={action}
                        type="button"
                        disabled
                        className="rounded-full border border-brand-border bg-brand-surface px-3 py-1.5 text-xs font-semibold text-brand-muted"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-brand-border/60 bg-brand-surfaceSoft px-5 py-4">
        <p className="text-sm text-brand-muted">{note}</p>
        <StatusBadge label="Mock admin" />
      </div>
    </div>
  );
}
