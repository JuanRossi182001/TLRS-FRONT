import { apiFetch } from '../../../shared/api/httpClient';
import type {
  AdminClient,
  AdminDeviceListItem,
  AdminDeviceUpdateRequest,
  AdminDeviceUpdateResponse,
  AdminStats,
  AdminUser,
  AvailableAsset,
  CreateAssetRequest,
  ProvisionDeviceRequest,
} from '../types/admin.types';

export function getAdminStats() {
  return apiFetch<AdminStats>('/admin/stats');
}

export function getAdminDevices(skip = 0, limit = 100) {
  return apiFetch<AdminDeviceListItem[]>(`/admin/devices?skip=${skip}&limit=${limit}`);
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

export function getAvailableAssets(client_id: number) {
  return apiFetch<AvailableAsset[]>(`/assets?client_id=${client_id}&unassigned=true`);
}

export function createAsset(payload: CreateAssetRequest) {
  return apiFetch<AvailableAsset>('/assets', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function provisionDevice(payload: ProvisionDeviceRequest) {
  return apiFetch<AdminDeviceListItem>('/devices', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function reassignDeviceAsset(device_id: number, asset_id: number) {
  return apiFetch<AdminDeviceListItem>(`/devices/${device_id}/asset`, {
    method: 'PUT',
    body: JSON.stringify({ asset_id }),
  });
}

export function releaseDeviceAsset(device_id: number) {
  return apiFetch<void>(`/devices/${device_id}/asset`, {
    method: 'DELETE',
  });
}
