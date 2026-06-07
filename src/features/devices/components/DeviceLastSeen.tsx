import { formatArgentinaDateTime } from '../../../shared/utils/dateTime';

type DeviceLastSeenProps = {
  value?: string;
};

export function DeviceLastSeen({ value }: DeviceLastSeenProps) {
  if (!value) {
    return <span className="text-slate-500">Sin conexion registrada</span>;
  }

  return <span>{formatArgentinaDateTime(value)}</span>;
}
