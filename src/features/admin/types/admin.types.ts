export type AdminStats = {
  devices_data: {
    all_devices: number;
    active_devices: number;
    inactive_devices: number;
    online_devices: number;
    offline_devices: number;
  };
  clients_data: number;
  users_data: number;
};

export type AdminDeviceListItem = {
  id_device: number;
  serial: string;
  name: string;
  client_name: string | null;
  asset_name: string | null;
  active: boolean;
  state: string;
};

export type AdminClient = {
  id_client: number;
  name: string;
  email: string;
  device_count: number;
  user_count: number;
};

export type AdminUser = {
  id_user: number;
  name: string;
  email: string;
  id_client: number;
  is_admin: boolean;
};

export type AdminDeviceUpdateRequest = {
  serial: string;
  name: string;
  type: string;
  state: string;
  communication_protocol: string;
  client_id: number | null;
  asset_id: number | null;
  active: boolean;
  last_seen_at: string | null;
};

export type AdminDeviceUpdateResponse = AdminDeviceUpdateRequest & {
  id_device: number;
};
