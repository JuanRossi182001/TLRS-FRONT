import { EmptyState } from '../../../shared/components';

export function AlertEmptyState() {
  return (
    <EmptyState
      title="No hay eventos de geocercas"
      message="Cuando un dispositivo entre, salga o se acerque al limite de una geocerca, los eventos apareceran aca."
    />
  );
}
