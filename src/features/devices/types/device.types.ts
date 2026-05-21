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
  active: boolean;
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
  active: boolean;
  lastSeenAt?: string;
};

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
    active: device.active,
  };
}
