import { Card } from '../../../shared/components';
import type { GeoFenceEventRead } from '../types/alert.types';

type AlertStatsProps = {
  events: GeoFenceEventRead[];
};

function countByType(events: GeoFenceEventRead[], type: GeoFenceEventRead['event_type']) {
  return events.filter((event) => event.event_type === type).length;
}

export function AlertStats({ events }: AlertStatsProps) {
  const exited = countByType(events, 'EXITED');
  const nearLimit = countByType(events, 'NEAR_LIMIT');
  const gpsUncertain = countByType(events, 'GPS_UNCERTAIN');
  const enteredReturned = countByType(events, 'ENTERED') + countByType(events, 'RETURNED');

  const stats = [
    { label: 'Total eventos', value: events.length, className: 'bg-brand-primary text-black' },
    { label: 'Salidas', value: exited, className: 'bg-red-50 text-brand-danger' },
    { label: 'Cerca del limite', value: nearLimit, className: 'bg-amber-50 text-brand-accentDark' },
    { label: 'GPS incierto', value: gpsUncertain, className: 'bg-yellow-50 text-brand-accentDark' },
    { label: 'Entradas/retornos', value: enteredReturned, className: 'bg-emerald-50 text-brand-success' },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {stats.map((stat) => (
        <Card className={['p-5', stat.className].join(' ')} key={stat.label}>
          <p className="text-sm font-semibold opacity-80">{stat.label}</p>
          <p className="mt-3 text-3xl font-semibold">{stat.value}</p>
        </Card>
      ))}
    </div>
  );
}
