import type { AdminClient, AdminDevice, AdminStats, AdminUser } from '../types/admin.types';

export const adminStatsMock: AdminStats = {
  totalDevices: 128,
  activeDevices: 102,
  inactiveDevices: 26,
  onlineDevices: 87,
  offlineDevices: 41,
  totalClients: 18,
  totalUsers: 46,
};

export const adminDevicesMock: AdminDevice[] = [
  {
    id: 1001,
    serial: 'COL-GPS-0237',
    name: 'Collar Norte 0237',
    client: 'Estancia El Norte',
    asset: 'CARAVANA-0237',
    active: true,
    state: 'ON',
  },
  {
    id: 1002,
    serial: 'COL-GPS-0412',
    name: 'Collar Bajo 0412',
    client: 'Campo La Esperanza',
    asset: 'CARAVANA-0412',
    active: true,
    state: 'OFF',
  },
  {
    id: 1003,
    serial: 'TRK-HTTP-3010',
    name: 'Tracker Cisterna',
    client: 'Agroservicios Calamuchita',
    asset: 'CAMIONETA-3010',
    active: false,
    state: 'UNKNOWN',
  },
];

export const adminClientsMock: AdminClient[] = [
  {
    id: 1,
    name: 'Estancia El Norte',
    email: 'operaciones@elnorte.example',
    users: 4,
    devices: 38,
    status: 'Activo',
  },
  {
    id: 2,
    name: 'Campo La Esperanza',
    email: 'campo@laesperanza.example',
    users: 3,
    devices: 24,
    status: 'Activo',
  },
  {
    id: 3,
    name: 'Agroservicios Calamuchita',
    email: 'flota@calamuchita.example',
    users: 2,
    devices: 9,
    status: 'Pausado',
  },
];

export const adminUsersMock: AdminUser[] = [
  {
    id: 1,
    username: 'admin-test',
    client: 'Manea',
    is_admin: true,
    active: true,
    last_login: '2026-05-21 09:12',
  },
  {
    id: 2,
    username: 'productor-norte',
    client: 'Estancia El Norte',
    is_admin: false,
    active: true,
    last_login: '2026-05-20 18:34',
  },
  {
    id: 3,
    username: 'operador-sur',
    client: 'Campo La Esperanza',
    is_admin: false,
    active: false,
  },
];
