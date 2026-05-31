import { apiFetch } from '../../../shared/api/httpClient';
import type {
  AdminClient,
  AdminDeviceListItem,
  AdminDeviceUpdateRequest,
  AdminDeviceUpdateResponse,
  AdminStats,
  AdminUser,
} from '../types/admin.types';

export function getAdminStats() {
  return apiFetch<AdminStats>('/admin/stats');
}

export function getAdminDevices() {
  return apiFetch<AdminDeviceListItem[]>('/admin/devices');
}

export function getAdminClients() {
  return apiFetch<AdminClient[]>('/admin/clients');
}

export function getAdminClientUsers(client_id: number) {
  return apiFetch<AdminUser[]>(`/admin/clients/${client_id}/users`);
}

export function updateAdminDevice(device_id: number, payload: AdminDeviceUpdateRequest) {
  return apiFetch<AdminDeviceUpdateResponse>(`/admin/devices/${device_id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function deactivateAdminDevice(device_id: number) {
  return apiFetch<AdminDeviceUpdateResponse>(`/admin/devices/${device_id}/deactivate`, {
    method: 'PATCH',
  });
}

export function deactivateAdminUser(user_id: number) {
  return apiFetch<AdminUser>(`/admin/users/${user_id}/deactivate`, {
    method: 'PATCH',
  });
}
