import { Card, EmptyState, PageHeader, StatusBadge } from '../../../shared/components';

export function AlertsPage() {
  return (
    <section className="space-y-4">
      <PageHeader
        title="Alertas"
        description="Eventos operativos y notificaciones de dispositivos."
        actions={<StatusBadge label="0 pendientes" tone="success" />}
      />

      <Card>
        <h2 className="text-lg font-semibold text-slate-950">Centro de eventos</h2>
        <p className="mt-1 text-sm text-slate-600">
          Placeholder para la futura bandeja de alertas.
        </p>
      </Card>

      <EmptyState title="Sin alertas" message="Aun no hay eventos para mostrar." />
    </section>
  );
}
