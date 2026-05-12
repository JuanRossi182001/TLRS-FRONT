export type DeviceState = 'online' | 'offline' | 'unknown';

export type CommunicationProtocol = 'mqtt' | 'http' | 'unknown';

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
  state: DeviceState;
  communicationProtocol: CommunicationProtocol;
  clientId?: number;
  assetId?: number;
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
