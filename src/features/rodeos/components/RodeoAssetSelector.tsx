import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import type { RodeoAssetOption } from '../types/rodeo.types';

function getPrimaryAssetLabel(option: RodeoAssetOption) {
  return option.asset_name || option.asset_serial || option.label;
}

function getSecondaryAssetLabel(option: RodeoAssetOption) {
  return option.device_serial;
}

type RodeoAssetSelectorProps = {
  title: string;
  options: RodeoAssetOption[];
  selected_asset_ids: number[];
  on_change: (asset_ids: number[]) => void;
  empty_message: string;
  search_placeholder?: string;
  max_visible_items?: number;
};

export function RodeoAssetSelector({
  title,
  options,
  selected_asset_ids,
  on_change,
  empty_message,
  search_placeholder = 'Buscar por asset, device o serial',
  max_visible_items,
}: RodeoAssetSelectorProps) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const deferredSearch = useDeferredValue(search);

  const filteredOptions = useMemo(() => {
    const normalizedSearch = deferredSearch.trim().toLowerCase();

    if (!normalizedSearch) {
      return options;
    }

    return options.filter((option) => option.search_text.includes(normalizedSearch));
  }, [deferredSearch, options]);

  const pagedOptions = useMemo(() => {
    if (!max_visible_items || filteredOptions.length <= max_visible_items) {
      return filteredOptions;
    }

    const startIndex = (page - 1) * max_visible_items;
    return filteredOptions.slice(startIndex, startIndex + max_visible_items);
  }, [filteredOptions, max_visible_items, page]);

  const totalPages = max_visible_items ? Math.ceil(filteredOptions.length / max_visible_items) : 1;

  useEffect(() => {
    setPage(1);
  }, [deferredSearch, options.length, max_visible_items]);

  useEffect(() => {
    if (totalPages > 0 && page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  function handleToggle(asset_id: number, checked: boolean) {
    if (checked) {
      on_change([...selected_asset_ids, asset_id]);
      return;
    }

    on_change(selected_asset_ids.filter((selected_asset_id) => selected_asset_id !== asset_id));
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-sm font-semibold text-brand-text">{title}</h3>
        <span className="text-xs font-medium text-brand-muted">
          {selected_asset_ids.length} seleccionados
        </span>
      </div>

      <input
        className="w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
        onChange={(event) => setSearch(event.target.value)}
        placeholder={search_placeholder}
        value={search}
      />

      {filteredOptions.length === 0 ? (
        <p className="rounded-2xl bg-white px-4 py-3 text-sm text-brand-muted">{empty_message}</p>
      ) : (
        <>
          <div className="grid gap-2 sm:grid-cols-2">
            {pagedOptions.map((option) => (
            <label
              className="flex items-start gap-3 rounded-2xl border border-brand-border bg-white p-3 text-sm text-brand-text"
              key={option.asset_id}
            >
              <input
                checked={selected_asset_ids.includes(option.asset_id)}
                className="mt-1 h-4 w-4 accent-brand-primary"
                onChange={(event) => handleToggle(option.asset_id, event.target.checked)}
                type="checkbox"
              />

              <span>
                <span className="block font-semibold">{getPrimaryAssetLabel(option)}</span>
                <span className="block text-brand-muted">{getSecondaryAssetLabel(option)}</span>
              </span>
            </label>
            ))}
          </div>

          {max_visible_items && filteredOptions.length > max_visible_items ? (
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-brand-border bg-brand-surfaceSoft px-3 py-2 text-sm text-brand-muted">
              <span>
                Página {page} de {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  className="rounded-full border border-brand-border bg-white px-3 py-1.5 font-semibold text-brand-text transition hover:border-brand-primary hover:text-brand-primary disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={page === 1}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  type="button"
                >
                  Anterior
                </button>
                <button
                  className="rounded-full border border-brand-border bg-white px-3 py-1.5 font-semibold text-brand-text transition hover:border-brand-primary hover:text-brand-primary disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={page === totalPages}
                  onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                  type="button"
                >
                  Siguiente
                </button>
              </div>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
