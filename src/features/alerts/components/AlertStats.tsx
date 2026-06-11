import { Card } from '../../../shared/components';
import type { AlertRelevanceFilter, MyGeofenceEventsStats } from '../types/alert.types';

type AlertStatsProps = {
  stats: MyGeofenceEventsStats;
  relevanceFilter: AlertRelevanceFilter;
};

export function AlertStats({ stats, relevanceFilter }: AlertStatsProps) {
  const cards = [
    {
      label: 'Total eventos',
      value: stats.totalEvents,
      className: 'bg-brand-primary text-white',
      labelClassName: 'text-brand-primary/70',
      valueClassName: 'text-brand-primary',
      isImportant: true,
    },
    {
      label: 'Salidas',
      value: stats.exitedEvents,
      className: 'bg-brand-surface',
      labelClassName: 'text-brand-muted',
      valueClassName: 'text-brand-danger',
      isImportant: true,
    },
    {
      label: 'Cerca del limite',
      value: stats.nearLimitEvents,
      className: 'bg-brand-accent',
      labelClassName: 'text-brand-primary/70',
      valueClassName: 'text-brand-primary',
      isImportant: true,
    },
    {
      label: 'GPS incierto',
      value: stats.gpsUnknownEvents,
      className: '',
      labelClassName: 'text-brand-muted',
      valueClassName: 'text-brand-accentDark',
      isImportant: false,
    },
    {
      label: 'Retornos',
      value: stats.returnedEvents,
      className: 'bg-brand-surfaceSoft',
      labelClassName: 'text-brand-muted',
      valueClassName: 'text-brand-success',
      isImportant: false,
    },
  ];
  const visibleCards = relevanceFilter === 'important_only'
    ? cards.filter((card) => card.isImportant)
    : cards;
  const gridClassName = relevanceFilter === 'important_only'
    ? 'grid-cols-2 xl:grid-cols-3'
    : 'grid-cols-2 xl:grid-cols-5';

  return (
    <div className={['grid gap-2 xl:gap-3', gridClassName].join(' ')}>
      {visibleCards.map((stat) => (
        <Card className={['p-3 text-center xl:p-3', stat.className].join(' ').trim()} key={stat.label}>
          <p className={['text-xs font-medium xl:text-[11px]', stat.labelClassName].join(' ')}>{stat.label}</p>
          <p className={['mt-1.5 text-xl font-semibold xl:text-xl', stat.valueClassName].join(' ')}>{stat.value}</p>
        </Card>
      ))}
    </div>
  );
}
