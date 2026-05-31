import { StatusBadge } from '../../../shared/components';

type GeofenceBadgeProps = {
  active: boolean;
};

export function GeofenceBadge({ active }: GeofenceBadgeProps) {
  return (
    <StatusBadge
      label={active ? 'Activa' : 'Inactiva'}
      tone={active ? 'success' : 'default'}
    />
  );
}
