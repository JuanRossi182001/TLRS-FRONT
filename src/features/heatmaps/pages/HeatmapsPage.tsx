import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Info } from 'lucide-react';
import { Button, ErrorState, LoadingState, PageHeader, ResponsiveDialog } from '../../../shared/components';
import { useAnimals } from '../../animals/hooks/useAnimals';
import { useMyRodeos } from '../../rodeos/hooks/useMyRodeos';
import { requestHeatmap } from '../api/heatmaps.api';
import { HeatmapMap } from '../components/HeatmapMap';
import type { HeatmapRequest, HeatmapResponse, HeatmapSubjectType } from '../types/heatmap.types';

function localDateTimeInput(date: Date) {
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return offsetDate.toISOString().slice(0, 16);
}

function toUtcNaive(value: string) {
  return new Date(value).toISOString().replace(/Z$/, '');
}

function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours} h ${minutes} min`;
  if (minutes > 0) return `${minutes} min`;
  return `${Math.round(seconds)} s`;
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'No pudimos completar el análisis. Inténtalo nuevamente.';
}

export function HeatmapsPage() {
  const animals = useAnimals();
  const rodeos = useMyRodeos();
  const [subject, setSubject] = useState('');
  const [windowStart, setWindowStart] = useState(() => localDateTimeInput(new Date(Date.now() - 24 * 60 * 60 * 1000)));
  const [windowEnd, setWindowEnd] = useState(() => localDateTimeInput(new Date()));
  const [result, setResult] = useState<HeatmapResponse | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const analysis = useMutation({
    mutationFn: (payload: HeatmapRequest) => requestHeatmap(payload),
    onSuccess: setResult,
  });
  const [subjectType, subjectIdText] = subject.split(':');
  const optionsReady = !animals.isLoading && !rodeos.isLoading;
  const loadError = animals.error ?? rodeos.error;
  const hasSubjects = (animals.data?.length ?? 0) + (rodeos.data?.length ?? 0) > 0;
  const coveragePercent = useMemo(() => {
    const ratio = result?.coverage.temporal_coverage_ratio;
    return ratio === null || ratio === undefined ? null : Math.max(0, Math.min(100, ratio * 100));
  }, [result]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    analysis.reset();
    setResult(null);
    if (!subjectType || !subjectIdText || !windowStart || !windowEnd) return;
    analysis.mutate({
      subject_type: subjectType as HeatmapSubjectType,
      subject_id: Number(subjectIdText),
      window_start: toUtcNaive(windowStart),
      window_end: toUtcNaive(windowEnd),
    });
  }

  return (
    <section className="flex min-h-0 flex-1 flex-col gap-4">
      <PageHeader
        title="Mapas de calor"
        description="Explora la permanencia estimada por zonas durante el período seleccionado."
        actions={(
          <button
            aria-label="Cómo leer este mapa de calor"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-brand-border bg-brand-surface px-4 py-2 text-sm font-semibold text-brand-primary shadow-sm transition hover:bg-brand-surfaceSoft focus:outline-none focus:ring-2 focus:ring-brand-primary/25"
            onClick={() => setIsHelpOpen(true)}
            type="button"
          >
            <Info className="h-4 w-4" aria-hidden="true" />
            ¿Cómo leer este mapa?
          </button>
        )}
      />

      <ResponsiveDialog
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        title="Cómo leer este mapa"
        subtitle="Qué representan el tiempo, los colores y la cobertura."
      >
        <div className="mx-auto grid max-w-3xl gap-3 sm:grid-cols-2">
          <section className="rounded-2xl border border-brand-border/70 bg-white p-4">
            <h3 className="font-semibold text-brand-text">Permanencia estimada</h3>
            <p className="mt-2 text-sm leading-6 text-brand-muted">
              Tiempo que el análisis asigna a una celda cuando los reportes cercanos en el tiempo
              y el espacio son compatibles. Es una estimación: posiciones próximas no prueban por
              sí solas que el animal estuviera inmóvil. Los intervalos de movimiento o con evidencia
              insuficiente pueden no sumar permanencia.
            </p>
          </section>

          <section className="rounded-2xl border border-brand-border/70 bg-white p-4">
            <h3 className="font-semibold text-brand-text">Intensidad relativa</h3>
            <p className="mt-2 text-sm leading-6 text-brand-muted">
              Compara los segundos de permanencia de una celda con el máximo de esta consulta.
              El 100 % identifica la celda con más permanencia del mapa; no es un porcentaje del
              período ni se calcula contando mensajes GPS.
            </p>
          </section>

          <section className="rounded-2xl border border-brand-border/70 bg-white p-4">
            <h3 className="font-semibold text-brand-text">Cobertura temporal</h3>
            <p className="mt-2 text-sm leading-6 text-brand-muted">
              Compara el tiempo observado con el tiempo asignado durante el período. En un rodeo,
              el tiempo se suma por animal: 24 horas para tres animales representan 72 horas-animal.
            </p>
          </section>

          <section className="rounded-2xl border border-brand-border/70 bg-white p-4">
            <h3 className="font-semibold text-brand-text">Nube y celdas</h3>
            <p className="mt-2 text-sm leading-6 text-brand-muted">
              La nube suaviza visualmente la intensidad de las celdas cercanas; no agrega tiempo
              estimado fuera de ellas. Selecciona una celda para consultar su permanencia exacta y
              su intensidad relativa.
            </p>
          </section>
        </div>
      </ResponsiveDialog>

      <div className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[minmax(18rem,22rem)_minmax(0,1fr)]">
        <aside className="h-fit space-y-4 rounded-2xl border border-brand-border/70 bg-brand-surface/95 p-4 shadow-lg shadow-brand-primary/5 lg:rounded-3xl lg:p-5">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block text-sm font-semibold text-brand-text">
              Animal o rodeo
              <select
                className="mt-2 min-h-12 w-full rounded-xl border border-brand-border bg-white px-3 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
                onChange={(event) => setSubject(event.target.value)}
                value={subject}
                required
                disabled={!optionsReady || !hasSubjects}
              >
                <option value="">Selecciona un animal o rodeo</option>
                <optgroup label="Animales">
                  {(animals.data ?? []).map((animal) => (
                    <option key={animal.id_asset} value={`asset:${animal.id_asset}`}>
                      {animal.serial}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Rodeos">
                  {(rodeos.data ?? []).map((rodeo) => (
                    <option key={rodeo.id_asset_group} value={`asset_group:${rodeo.id_asset_group}`}>
                      {rodeo.name}
                    </option>
                  ))}
                </optgroup>
              </select>
            </label>

            <label className="block text-sm font-semibold text-brand-text">
              Desde
              <input
                className="mt-2 min-h-12 w-full rounded-xl border border-brand-border bg-white px-3 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
                type="datetime-local"
                value={windowStart}
                onChange={(event) => setWindowStart(event.target.value)}
                required
              />
            </label>

            <label className="block text-sm font-semibold text-brand-text">
              Hasta
              <input
                className="mt-2 min-h-12 w-full rounded-xl border border-brand-border bg-white px-3 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
                type="datetime-local"
                value={windowEnd}
                onChange={(event) => setWindowEnd(event.target.value)}
                required
              />
            </label>

            <Button className="w-full" type="submit" disabled={!subject || analysis.isPending || !optionsReady}>
              {analysis.isPending ? 'Analizando…' : 'Solicitar mapa'}
            </Button>
          </form>

          {!optionsReady ? <LoadingState message="Cargando animales y rodeos…" /> : null}
          {loadError ? <ErrorState title="No pudimos cargar los sujetos" message={getErrorMessage(loadError)} /> : null}
          {optionsReady && !loadError && !hasSubjects ? (
            <p className="rounded-xl bg-brand-surfaceSoft p-3 text-sm text-brand-muted">
              No hay animales ni rodeos disponibles para analizar.
            </p>
          ) : null}
          {analysis.error ? <ErrorState title="No se pudo generar el mapa" message={getErrorMessage(analysis.error)} /> : null}

          {result ? (
            <div className="space-y-3 border-t border-brand-border pt-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-semibold text-brand-text">Cobertura temporal</h2>
                <span className="text-sm font-semibold text-brand-primary">
                  {coveragePercent === null ? 'Sin estimar' : `${Math.round(coveragePercent)}%`}
                </span>
              </div>
              {coveragePercent !== null ? (
                <div className="h-2 overflow-hidden rounded-full bg-brand-surfaceSoft" aria-label={`Cobertura temporal ${Math.round(coveragePercent)}%`}>
                  <div className="h-full rounded-full bg-brand-primary" style={{ width: `${coveragePercent}%` }} />
                </div>
              ) : null}
              <p className="text-sm text-brand-muted">
                {formatDuration(result.coverage.observed_seconds)} con observaciones de un período asignado de {formatDuration(result.coverage.eligible_assignment_seconds)}.
              </p>
              {result.availability === 'no_data' ? (
                <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900">
                  No encontramos ubicaciones para este sujeto en el período seleccionado.
                </p>
              ) : null}
              {result.availability === 'insufficient_evidence' ? (
                <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900">
                  Hay ubicaciones, pero no alcanzan para estimar permanencia espacial en celdas.
                </p>
              ) : null}
              {result.availability === 'available' ? (
                <p className="text-sm text-brand-muted">
                  Permanencia estimada total: <strong className="text-brand-text">{formatDuration(result.total_dwell_seconds)}</strong>
                </p>
              ) : null}
            </div>
          ) : null}
        </aside>

        <div className="min-h-[19rem] min-w-0">
          {result?.availability === 'available' ? (
            <HeatmapMap result={result} />
          ) : (
            <div className="flex h-[min(58vh,34rem)] min-h-[19rem] items-center justify-center rounded-2xl border border-dashed border-brand-border bg-brand-surface/70 p-6 text-center text-sm text-brand-muted">
              {result ? 'No hay celdas para mostrar en este análisis.' : 'Selecciona un animal o rodeo y un período para ver su mapa de calor.'}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
