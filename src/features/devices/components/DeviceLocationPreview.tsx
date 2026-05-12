import type { DeviceLocation } from '../types/device.types';

type DeviceLocationPreviewProps = {
  location?: DeviceLocation;
};

export function DeviceLocationPreview({ location }: DeviceLocationPreviewProps) {
  if (!location) {
    return <span className="text-slate-500">Sin ubicacion registrada</span>;
  }

  return (
    <span>
      {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
    </span>
  );
}
