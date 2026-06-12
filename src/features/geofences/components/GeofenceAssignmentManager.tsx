import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import {
  Button,
  EmptyState,
  ErrorState,
  LoadingState,
  StatusBadge,
} from '../../../shared/components';
import { formatArgentinaDateTime } from '../../../shared/utils/dateTime';
import { useAssignAssetsToGeofence } from '../hooks/useAssignAssetsToGeofence';
import { useDeactivateGeofenceAssignment } from '../hooks/useDeactivateGeofenceAssignment';
import { useGeofenceAssignableDevices } from '../hooks/useGeofenceAssignableDevices';
import { useGeofenceAssignments } from '../hooks/useGeofenceAssignments';
import type { GeoFenceAssignmentRead } from '../types/geofence.types';

type GeofenceAssignmentManagerProps = {
  geofence_id: number;
  is_open: boolean;
};

const devicesPerPage = 3;
type PageTransitionDirection = 'next' | 'previous' | null;

function getAssignmentId(assignment: GeoFenceAssignmentRead) {
  return assignment.id_assignment ?? assignment.id_geofence_assignment ?? null;
}

function getTotalPages(totalItems: number) {
  return Math.max(1, Math.ceil(totalItems / devicesPerPage));
}

function getVisibleItems<T>(items: T[], page: number) {
  const start = (page - 1) * devicesPerPage;
  return items.slice(start, start + devicesPerPage);
}

function getPageTransitionClass(direction: PageTransitionDirection) {
  if (!direction) {
    return 'translate-x-0 opacity-100';
  }

  return direction === 'next' ? '-translate-x-4 opacity-60' : 'translate-x-4 opacity-60';
}

export function GeofenceAssignmentManager({
  geofence_id,
  is_open,
}: GeofenceAssignmentManagerProps) {
  const [selected_asset_ids, setSelectedAssetIds] = useState<number[]>([]);
  const [assignedPage, setAssignedPage] = useState(1);
  const [assignablePage, setAssignablePage] = useState(1);
  const [assignedTouchStartX, setAssignedTouchStartX] = useState<number | null>(null);
  const [assignableTouchStartX, setAssignableTouchStartX] = useState<number | null>(null);
  const [assignedTransitionDirection, setAssignedTransitionDirection] =
    useState<PageTransitionDirection>(null);
  const [assignableTransitionDirection, setAssignableTransitionDirection] =
    useState<PageTransitionDirection>(null);
  const assignments = useGeofenceAssignments(geofence_id, is_open);
  const devices = useGeofenceAssignableDevices(is_open);
  const assignAssets = useAssignAssetsToGeofence();
  const deactivateAssignment = useDeactivateGeofenceAssignment();

  const active_assignments = useMemo(
    () => (assignments.data ?? []).filter((assignment) => assignment.active),
    [assignments.data],
  );

  const assigned_asset_ids = useMemo(
    () => new Set(active_assignments.map((assignment) => assignment.asset_id)),
    [active_assignments],
  );

  const assignable_devices = useMemo(
    () =>
      (devices.data ?? []).filter(
        (device) => device.asset_id !== null && !assigned_asset_ids.has(device.asset_id),
      ),
    [assigned_asset_ids, devices.data],
  );
  const assignedTotalPages = getTotalPages(active_assignments.length);
  const assignableTotalPages = getTotalPages(assignable_devices.length);
  const currentAssignedPage = Math.min(assignedPage, assignedTotalPages);
  const currentAssignablePage = Math.min(assignablePage, assignableTotalPages);
  const visibleAssignedAssignments = useMemo(
    () => getVisibleItems(active_assignments, currentAssignedPage),
    [active_assignments, currentAssignedPage],
  );
  const visibleAssignableDevices = useMemo(
    () => getVisibleItems(assignable_devices, currentAssignablePage),
    [assignable_devices, currentAssignablePage],
  );
  const canGoPreviousAssigned = currentAssignedPage > 1;
  const canGoNextAssigned = currentAssignedPage < assignedTotalPages;
  const canGoPreviousAssignable = currentAssignablePage > 1;
  const canGoNextAssignable = currentAssignablePage < assignableTotalPages;
  const isAssignedTransitioning = assignedTransitionDirection !== null;
  const isAssignableTransitioning = assignableTransitionDirection !== null;
  const assignedTransitionClass = getPageTransitionClass(assignedTransitionDirection);
  const assignableTransitionClass = getPageTransitionClass(assignableTransitionDirection);

  useEffect(() => {
    setAssignedPage((current) => Math.min(current, assignedTotalPages));
  }, [assignedTotalPages]);

  useEffect(() => {
    setAssignablePage((current) => Math.min(current, assignableTotalPages));
  }, [assignableTotalPages]);

  useEffect(() => {
    if (!isAssignedTransitioning) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setAssignedTransitionDirection(null);
    }, 180);

    return () => window.clearTimeout(timeoutId);
  }, [isAssignedTransitioning]);

  useEffect(() => {
    if (!isAssignableTransitioning) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setAssignableTransitionDirection(null);
    }, 180);

    return () => window.clearTimeout(timeoutId);
  }, [isAssignableTransitioning]);

  function handleSelection(asset_id: number, checked: boolean) {
    setSelectedAssetIds((current) =>
      checked ? [...current, asset_id] : current.filter((selected) => selected !== asset_id),
    );
  }

  async function handleAssign(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (selected_asset_ids.length === 0) {
      return;
    }

    await assignAssets.mutateAsync({
      geofence_id,
      payload: { asset_ids: selected_asset_ids },
    });
    setSelectedAssetIds([]);
  }

  async function handleDeactivate(assignment: GeoFenceAssignmentRead) {
    const assignment_id = getAssignmentId(assignment);

    if (!assignment_id) {
      return;
    }

    await deactivateAssignment.mutateAsync({ assignment_id, geofence_id });
  }

  function goToPreviousAssignedPage() {
    setAssignedTransitionDirection('previous');
    setAssignedPage((page) => Math.max(1, page - 1));
  }

  function goToNextAssignedPage() {
    setAssignedTransitionDirection('next');
    setAssignedPage((page) => Math.min(assignedTotalPages, page + 1));
  }

  function goToPreviousAssignablePage() {
    setAssignableTransitionDirection('previous');
    setAssignablePage((page) => Math.max(1, page - 1));
  }

  function goToNextAssignablePage() {
    setAssignableTransitionDirection('next');
    setAssignablePage((page) => Math.min(assignableTotalPages, page + 1));
  }

  function handleAssignedTouchEnd(clientX: number) {
    if (assignedTouchStartX === null) {
      return;
    }

    const distance = assignedTouchStartX - clientX;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance && canGoNextAssigned) {
      goToNextAssignedPage();
    }

    if (distance < -minSwipeDistance && canGoPreviousAssigned) {
      goToPreviousAssignedPage();
    }

    setAssignedTouchStartX(null);
  }

  function handleAssignableTouchEnd(clientX: number) {
    if (assignableTouchStartX === null) {
      return;
    }

    const distance = assignableTouchStartX - clientX;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance && canGoNextAssignable) {
      goToNextAssignablePage();
    }

    if (distance < -minSwipeDistance && canGoPreviousAssignable) {
      goToPreviousAssignablePage();
    }

    setAssignableTouchStartX(null);
  }

  const assignedFirstVisible =
    active_assignments.length === 0 ? 0 : (currentAssignedPage - 1) * devicesPerPage + 1;
  const assignedLastVisible = Math.min(
    currentAssignedPage * devicesPerPage,
    active_assignments.length,
  );
  const assignableFirstVisible =
    assignable_devices.length === 0 ? 0 : (currentAssignablePage - 1) * devicesPerPage + 1;
  const assignableLastVisible = Math.min(
    currentAssignablePage * devicesPerPage,
    assignable_devices.length,
  );

  if (!is_open) {
    return null;
  }

  return (
    <div className="space-y-4 rounded-2xl border border-brand-border bg-brand-surfaceSoft p-4">
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-brand-text">Dispositivos asignados</h3>

        {assignments.isLoading ? <LoadingState message="Cargando asignaciones..." /> : null}

        {assignments.isError ? (
          <ErrorState
            title="No pudimos cargar las asignaciones"
            message={
              assignments.error instanceof Error
                ? assignments.error.message
                : 'Intentalo nuevamente.'
            }
          />
        ) : null}

        {!assignments.isLoading && !assignments.isError && active_assignments.length === 0 ? (
          <EmptyState
            title="Sin dispositivos asignados"
            message="Todavia no hay dispositivos activos en esta geocerca."
          />
        ) : null}

        {active_assignments.length > 0 ? (
          <div className="space-y-3">
            <div
              className="space-y-2 touch-pan-y"
              onTouchEnd={(event) => handleAssignedTouchEnd(event.changedTouches[0].clientX)}
              onTouchStart={(event) => setAssignedTouchStartX(event.touches[0].clientX)}
            >
              <div className="flex items-center justify-between gap-3 text-xs font-medium text-brand-muted">
                <span>
                  Mostrando {assignedFirstVisible}-{assignedLastVisible} de{' '}
                  {active_assignments.length}
                </span>
                <span>
                  Pagina {currentAssignedPage} de {assignedTotalPages}
                </span>
              </div>

              <div className="relative overflow-hidden rounded-3xl">
                <div className={['grid gap-3 transition duration-400 ease-out', assignedTransitionClass].join(' ')}>
                  {visibleAssignedAssignments.map((assignment) => {
                    const device = (devices.data ?? []).find(
                      (candidate) => candidate.asset_id === assignment.asset_id,
                    );
                    const assignment_id = getAssignmentId(assignment);
                    const is_deactivating =
                      deactivateAssignment.isPending &&
                      deactivateAssignment.variables?.assignment_id === assignment_id;

                    return (
                      <div
                        className="flex flex-col gap-3 rounded-2xl border border-brand-border bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
                        key={assignment_id ?? assignment.asset_id}
                      >
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold text-brand-text">
                              {device ? device.name : `Asset ${assignment.asset_id}`}
                            </p>
                            <StatusBadge label="Activo" tone="success" />
                          </div>
                          <p className="mt-1 text-sm text-brand-muted">
                            {device
                              ? `${device.serial} - Asset ${assignment.asset_id}`
                              : `Asset ${assignment.asset_id}`}
                          </p>
                          <p className="mt-1 text-xs text-brand-muted">
                            Asignado {formatArgentinaDateTime(assignment.assigned_at)}
                          </p>
                        </div>

                        <Button
                          className="w-full sm:w-auto"
                          disabled={!assignment_id || is_deactivating}
                          onClick={() => handleDeactivate(assignment)}
                          type="button"
                          variant="secondary"
                        >
                          {is_deactivating ? 'Desactivando...' : 'Desactivar'}
                        </Button>
                      </div>
                    );
                  })}
                </div>

                {isAssignedTransitioning ? (
                  <div className="pointer-events-none absolute inset-x-0 top-3 flex justify-center xl:hidden">
                    <span className="rounded-full bg-brand-primary/90 px-3 py-1 text-xs font-semibold text-white shadow-lg shadow-brand-primary/20">
                      Cambiando pagina...
                    </span>
                  </div>
                ) : null}
              </div>
            </div>

            {assignedTotalPages > 1 ? (
              <div className="flex items-center justify-between gap-2">
                <Button
                  className="px-3 py-2 text-xs"
                  disabled={!canGoPreviousAssigned}
                  onClick={goToPreviousAssignedPage}
                  type="button"
                >
                  Anterior
                </Button>
                <Button
                  className="px-3 py-2 text-xs"
                  disabled={!canGoNextAssigned}
                  onClick={goToNextAssignedPage}
                  type="button"
                >
                  Siguiente
                </Button>
              </div>
            ) : null}

            {assignedTotalPages > 1 ? (
              <p className="text-center text-xs font-medium text-brand-muted xl:hidden">
                Desliza los dispositivos asignados hacia la izquierda o derecha para cambiar de pagina.
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      <form className="space-y-3" onSubmit={handleAssign}>
        <h3 className="text-sm font-semibold text-brand-text">Agregar dispositivos</h3>

        {devices.isLoading ? <LoadingState message="Cargando dispositivos..." /> : null}

        {devices.isError ? (
          <ErrorState
            title="No pudimos cargar los dispositivos"
            message={
              devices.error instanceof Error ? devices.error.message : 'Intentalo nuevamente.'
            }
          />
        ) : null}

        {!devices.isLoading && !devices.isError && assignable_devices.length === 0 ? (
          <p className="rounded-2xl bg-white px-4 py-3 text-sm text-brand-muted">
            No hay dispositivos con asset disponible para agregar.
          </p>
        ) : null}

        {assignable_devices.length > 0 ? (
          <div className="space-y-3">
            <div
              className="space-y-2 touch-pan-y"
              onTouchEnd={(event) => handleAssignableTouchEnd(event.changedTouches[0].clientX)}
              onTouchStart={(event) => setAssignableTouchStartX(event.touches[0].clientX)}
            >
              <div className="flex items-center justify-between gap-3 text-xs font-medium text-brand-muted">
                <span>
                  Mostrando {assignableFirstVisible}-{assignableLastVisible} de{' '}
                  {assignable_devices.length}
                </span>
                <span>
                  Pagina {currentAssignablePage} de {assignableTotalPages}
                </span>
              </div>

              <div className="relative overflow-hidden rounded-3xl">
                <div
                  className={[
                    'grid gap-2 transition duration-400 ease-out sm:grid-cols-2',
                    assignableTransitionClass,
                  ].join(' ')}
                >
                  {visibleAssignableDevices.map((device) => {
                    const asset_id = device.asset_id;

                    if (asset_id === null) {
                      return null;
                    }

                    return (
                      <label
                        className="flex items-start gap-3 rounded-2xl border border-brand-border bg-white p-3 text-sm text-brand-text"
                        key={device.id_device}
                      >
                        <input
                          checked={selected_asset_ids.includes(asset_id)}
                          className="mt-1 h-4 w-4 accent-brand-primary"
                          onChange={(event) => handleSelection(asset_id, event.target.checked)}
                          type="checkbox"
                        />
                        <span>
                          <span className="block font-semibold">{device.name}</span>
                          <span className="block text-brand-muted">
                            {device.serial} - Asset {asset_id}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>

                {isAssignableTransitioning ? (
                  <div className="pointer-events-none absolute inset-x-0 top-3 flex justify-center xl:hidden">
                    <span className="rounded-full bg-brand-primary/90 px-3 py-1 text-xs font-semibold text-white shadow-lg shadow-brand-primary/20">
                      Cambiando pagina...
                    </span>
                  </div>
                ) : null}
              </div>
            </div>

            {assignableTotalPages > 1 ? (
              <div className="flex items-center justify-between gap-2">
                <Button
                  className="px-3 py-2 text-xs"
                  disabled={!canGoPreviousAssignable}
                  onClick={goToPreviousAssignablePage}
                  type="button"
                >
                  Anterior
                </Button>
                <Button
                  className="px-3 py-2 text-xs"
                  disabled={!canGoNextAssignable}
                  onClick={goToNextAssignablePage}
                  type="button"
                >
                  Siguiente
                </Button>
              </div>
            ) : null}

            {assignableTotalPages > 1 ? (
              <p className="text-center text-xs font-medium text-brand-muted xl:hidden">
                Desliza los dispositivos disponibles hacia la izquierda o derecha para cambiar de pagina.
              </p>
            ) : null}
          </div>
        ) : null}

        {assignAssets.isError ? (
          <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-brand-danger">
            {assignAssets.error.message}
          </p>
        ) : null}

        {deactivateAssignment.isError ? (
          <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-brand-danger">
            {deactivateAssignment.error.message}
          </p>
        ) : null}

        <Button
          className="w-full sm:w-auto"
          disabled={selected_asset_ids.length === 0 || assignAssets.isPending}
          type="submit"
        >
          {assignAssets.isPending ? 'Agregando...' : 'Agregar seleccionados'}
        </Button>
      </form>
    </div>
  );
}
