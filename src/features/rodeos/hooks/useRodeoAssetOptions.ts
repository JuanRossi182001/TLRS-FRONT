import { useQuery } from '@tanstack/react-query';
import { getAllMyDevicesRaw } from '../../devices/api/devices.api';
import { getDeviceAssetName, type DeviceApiResponse } from '../../devices/types/device.types';
import type { RodeoAssetOption } from '../types/rodeo.types';

function buildAssetLabel(device: DeviceApiResponse) {
  return getDeviceAssetName(device, device.name.trim());
}

function mapDeviceToAssetOption(device: DeviceApiResponse): RodeoAssetOption | null {
  if (device.asset_id === null) {
    return null;
  }

  const label = buildAssetLabel(device);
  const search_text = [
    label,
    device.asset_name,
    device.asset_type,
    device.asset_serial,
    device.asset_id,
    device.name,
    device.serial,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return {
    asset_id: device.asset_id,
    asset_name: device.asset_name ?? null,
    asset_type: device.asset_type ?? null,
    asset_serial: device.asset_serial ?? null,
    device_id: device.id_device,
    device_name: device.name,
    device_serial: device.serial,
    device_active: device.active,
    device_state: device.state,
    label,
    search_text,
  };
}

export function useRodeoAssetOptions(enabled = true) {
  return useQuery<RodeoAssetOption[]>({
    queryKey: ['rodeos', 'asset-options'],
    queryFn: async () => {
      const devices = await getAllMyDevicesRaw();
      const seenAssetIds = new Set<number>();

      return devices
        .map(mapDeviceToAssetOption)
        .filter((option): option is RodeoAssetOption => option !== null)
        .filter((option) => {
          if (seenAssetIds.has(option.asset_id)) {
            return false;
          }

          seenAssetIds.add(option.asset_id);
          return true;
        })
        .sort((left, right) => left.label.localeCompare(right.label, 'es'));
    },
    enabled,
  });
}
