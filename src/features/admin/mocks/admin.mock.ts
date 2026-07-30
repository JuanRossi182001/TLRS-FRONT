import type { AdminClient, AdminDeviceListItem, AdminStats, AdminUser } from '../types/admin.types';

export const adminStatsMock: AdminStats = {
  devices_data: {
    all_devices: 128,
    active_devices: 102,
    inactive_devices: 26,
    online_devices: 87,
    offline_devices: 41,
  },
  clients_data: 18,
  users_data: 46,
};

export const adminDevicesMock: AdminDeviceListItem[] = [
  {
    id_device: 1001,
    serial: 'COL-GPS-0237',
    name: 'Collar Norte 0237',
    client_id: 1,
    client_name: 'Estancia El Norte',
    asset_id: 201,
    asset_name: 'CARAVANA-0237',
    active: true,
    state: 'ON',
    communication_protocol: 'LORAWAN',
    chirpstack_dev_eui: '0102030405060708',
    chirpstack_application_id: 'app-norte',
    chirpstack_device_profile_id: 'profile-collar',
    status: 'SAFE',
  },
  {
    id_device: 1002,
    serial: 'COL-GPS-0412',
    name: 'Collar Bajo 0412',
    client_id: 2,
    client_name: 'Campo La Esperanza',
    asset_id: 202,
    asset_name: 'CARAVANA-0412',
    active: true,
    state: 'OFF',
    communication_protocol: 'LORAWAN',
    chirpstack_dev_eui: '1112131415161718',
    chirpstack_application_id: 'app-esperanza',
    chirpstack_device_profile_id: 'profile-collar',
    status: 'NEAR_LIMIT',
  },
  {
    id_device: 1003,
    serial: 'TRK-HTTP-3010',
    name: 'Tracker Cisterna',
    client_id: 3,
    client_name: 'Agroservicios Calamuchita',
    asset_id: null,
    asset_name: null,
    active: false,
    state: 'UNKNOWN',
    communication_protocol: 'HTTP',
    chirpstack_dev_eui: null,
    chirpstack_application_id: null,
    chirpstack_device_profile_id: null,
    status: 'GPS_UNCERTAIN',
  },
];

export const adminClientsMock: AdminClient[] = [
  {
    id_client: 1,
    name: 'Estancia El Norte',
    email: 'operaciones@elnorte.example',
    user_count: 4,
    device_count: 38,
  },
  {
    id_client: 2,
    name: 'Campo La Esperanza',
    email: 'campo@laesperanza.example',
    user_count: 3,
    device_count: 24,
  },
  {
    id_client: 3,
    name: 'Agroservicios Calamuchita',
    email: 'flota@calamuchita.example',
    user_count: 2,
    device_count: 9,
  },
];

export const adminUsersMock: AdminUser[] = [
  {
    id_user: 1,
    name: 'admin-test',
    email: 'admin@manea.example',
    id_client: 1,
    is_admin: true,
  },
  {
    id_user: 2,
    name: 'productor-norte',
    email: 'productor@elnorte.example',
    id_client: 1,
    is_admin: false,
  },
  {
    id_user: 3,
    name: 'operador-sur',
    email: 'operador@laesperanza.example',
    id_client: 2,
    is_admin: false,
  },
];
