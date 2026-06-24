export type DeviceState = 'online' | 'offline' | 'unknown';

export type CommunicationProtocol = 'mqtt' | 'http' | 'unknown';

export type DeviceApiResponse = {
  id_device: number;
  serial: string;
  name: string;
  type: string;
  state: string;
  communication_protocol: string;
  client_id: number | null;
  asset_id: number | null;
  asset_name?: string | null;
  asset_type?: string | null;
  asset_serial?: string | null;
  active: boolean;
};

export type MyDevicesApiResponse = {
  total: number;
  skip: number;
  limit: number;
  stats: MyDevicesStatsApiResponse;
  items: DeviceApiResponse[];
};

export type MyDevicesResponse = {
  total: number;
  skip: number;
  limit: number;
  stats: MyDevicesStats;
  items: Device[];
};

export type MyDevicesStatsApiResponse = {
  total_devices: number;
  active_devices: number;
  inactive_devices: number;
  online_devices: number;
  offline_devices: number;
};

export type MyDevicesStats = {
  totalDevices: number;
  activeDevices: number;
  inactiveDevices: number;
  onlineDevices: number;
  offlineDevices: number;
};

export type Client = {
  idClient: number;
  name: string;
  email: string;
};

export type AssetStatus = 'active' | 'inactive' | 'unknown';

export type Asset = {
  idAsset: number;
  assetType: string;
  serial: string;
  clientId?: number;
  status: AssetStatus;
};

export type Device = {
  idDevice: number;
  serial: string;
  name: string;
  type: string;
  state: string;
  communicationProtocol: string;
  clientId: number | null;
  assetId: number | null;
  assetName?: string | null;
  assetSerial?: string | null;
  active: boolean;
  lastSeenAt?: string;
};

type DeviceAssetReference = {
  assetId?: number | null;
  assetName?: string | null;
  assetSerial?: string | null;
  asset_id?: number | null;
  asset_name?: string | null;
  asset_serial?: string | null;
};

export function getDeviceAssetName(
  device: DeviceAssetReference,
  fallback = 'Sin asset',
) {
  const assetName = device.assetName ?? device.asset_name;

  if (typeof assetName === 'string' && assetName.trim()) {
    return assetName.trim();
  }

  const assetSerial = device.assetSerial ?? device.asset_serial;

  if (typeof assetSerial === 'string' && assetSerial.trim()) {
    return assetSerial.trim();
  }

  return fallback;
}

export type DeviceLocation = {
  idLocation: number;
  deviceId: number;
  latitude: number;
  longitude: number;
  altitude?: number;
  accuracy?: number;
  geometry?: string;
  deviceTimestamp?: string;
  receivedAt: string;
};

export type DeviceTrackingItem = {
  device: Device;
  asset?: Asset;
  client?: Client;
  lastLocation?: DeviceLocation;
};

export function mapDeviceFromApi(device: DeviceApiResponse): Device {
  return {
    idDevice: device.id_device,
    serial: device.serial,
    name: device.name,
    type: device.type,
    state: device.state,
    communicationProtocol: device.communication_protocol,
    clientId: device.client_id,
    assetId: device.asset_id,
    assetName: device.asset_name ?? null,
    assetSerial: device.asset_serial ?? null,
    active: device.active,
  };
}

export function mapMyDevicesStatsFromApi(stats: MyDevicesStatsApiResponse): MyDevicesStats {
  return {
    totalDevices: stats.total_devices,
    activeDevices: stats.active_devices,
    inactiveDevices: stats.inactive_devices,
    onlineDevices: stats.online_devices,
    offlineDevices: stats.offline_devices,
  };
}
