import type { GeoFenceStatus } from '../../geofences/types/geofenceState.types';

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
  client_id: number | null;
  client_name: string | null;
  asset_id: number | null;
  asset_name: string | null;
  active: boolean;
  state: string;
  communication_protocol: string | null;
  chirpstack_dev_eui: string | null;
  chirpstack_application_id: string | null;
  chirpstack_device_profile_id: string | null;
  status: GeoFenceStatus;
};

export type AdminDeviceQrTokenResponse = {
  qr_token: string;
};

export type AdminClient = {
  id_client: number;
  name: string;
  email: string;
  device_count: number;
  user_count: number;
};

export type AdminClientDetails = Pick<AdminClient, 'id_client' | 'name' | 'email'>;

export type AdminClientCreateRequest = Pick<AdminClient, 'name' | 'email'>;

export type AdminClientUpdateRequest = Partial<AdminClientCreateRequest>;

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

export type AvailableAsset = {
  id_asset: number;
  asset_type: string;
  serial: string;
  client_id: number;
  status: string;
  assigned_device_id: number | null;
};

export type CreateAssetRequest = {
  asset_type: string;
  serial: string;
  client_id: number;
  status: 'ACTIVE';
};

type ProvisionDeviceBase = {
  serial: string;
  name: string;
  type: string;
  client_id: number;
  dev_eui: string;
  join_eui: string;
  app_key: string;
  chirpstack_application_id: string;
  chirpstack_device_profile_id: string;
  description?: string;
  is_disabled: boolean;
};

export type ProvisionDeviceRequest =
  | (ProvisionDeviceBase & {
      asset_id: number;
      asset?: never;
    })
  | (ProvisionDeviceBase & {
      asset: {
        asset_type: string;
        serial: string;
        status: 'ACTIVE';
      };
      asset_id?: never;
    });
