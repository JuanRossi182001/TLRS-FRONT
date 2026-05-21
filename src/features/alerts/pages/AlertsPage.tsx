import { Card, EmptyState, PageHeader, StatusBadge } from '../../../shared/components';

export function AlertsPage() {
  return (
    <section className="space-y-6">
      <PageHeader
        title="Alertas"
        description="Eventos operativos y notificaciones de dispositivos."
        actions={<StatusBadge label="0 pendientes" tone="success" />}
      />

      <Card>
        <h2 className="text-xl font-semibold tracking-tight text-brand-text">Centro de eventos</h2>
        <p className="mt-2 text-sm leading-6 text-brand-muted">
          Placeholder para la futura bandeja de alertas.
        </p>
      </Card>

      <EmptyState title="Sin alertas" message="Aun no hay eventos para mostrar." />
    </section>
  );
}
