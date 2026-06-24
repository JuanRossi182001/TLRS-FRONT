export type DeviceLatestLocation = {
  id_device: number;
  serial: string;
  name: string;
  type: string;
  client_id: number | null;
  asset_id: number | null;
  asset_name?: string | null;
  active: boolean;
  id_location: number;
  latitude: number;
  longitude: number;
  altitude: number | null;
  accuracy: number | null;
  device_timestamp: string | null;
  received_at: string;
};
