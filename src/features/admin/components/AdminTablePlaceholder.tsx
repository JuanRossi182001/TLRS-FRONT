import type { ReactNode } from 'react';
import { StatusBadge } from '../../../shared/components';

type Column<T> = {
  key: keyof T;
  label: string;
  render?: (row: T) => ReactNode;
};

type AdminTablePlaceholderProps<T> = {
  columns: Column<T>[];
  rows: T[];
  getRowId: (row: T) => string | number;
  renderActions?: (row: T) => ReactNode;
  note?: string;
  badgeLabel?: string;
};

export function AdminTablePlaceholder<T>({
  columns,
  rows,
  getRowId,
  renderActions,
  note = 'Datos obtenidos desde los endpoints admin.',
  badgeLabel = 'Admin API',
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
              <tr key={getRowId(row)} className="hover:bg-brand-surfaceSoft/60">
                {columns.map((column) => (
                  <td key={String(column.key)} className="whitespace-nowrap px-5 py-4 text-brand-text">
                    {column.render ? column.render(row) : String(row[column.key] ?? 'Sin datos')}
                  </td>
                ))}
                <td className="whitespace-nowrap px-5 py-4">
                  {renderActions ? renderActions(row) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-brand-border/60 bg-brand-surfaceSoft px-5 py-4">
        <p className="text-sm text-brand-muted">{note}</p>
        <StatusBadge label={badgeLabel} />
      </div>
    </div>
  );
}
