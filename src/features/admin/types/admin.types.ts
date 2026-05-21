export type AdminStats = {
  totalDevices: number;
  activeDevices: number;
  inactiveDevices: number;
  onlineDevices: number;
  offlineDevices: number;
  totalClients: number;
  totalUsers: number;
};

export type AdminDevice = {
  id: number;
  serial: string;
  name: string;
  client: string;
  asset: string;
  active: boolean;
  state: string;
};

export type AdminClient = {
  id: number;
  name: string;
  email: string;
  users: number;
  devices: number;
  status: string;
};

export type AdminUser = {
  id: number;
  username: string;
  client: string;
  is_admin: boolean;
  active: boolean;
  last_login?: string;
};
