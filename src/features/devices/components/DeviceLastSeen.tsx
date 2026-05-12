type DeviceLastSeenProps = {
  value?: string;
};

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function DeviceLastSeen({ value }: DeviceLastSeenProps) {
  if (!value) {
    return <span className="text-slate-500">Sin conexion registrada</span>;
  }

  return <span>{formatDateTime(value)}</span>;
}
