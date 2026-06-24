import { apiFetch } from '../../../shared/api/httpClient';
import type {
  RodeoActivationUpdate,
  RodeoCreate,
  RodeoDetail,
  RodeoMembersPayload,
  RodeoSummary,
  RodeoUpdate,
} from '../types/rodeo.types';

export function getMyRodeos() {
  return apiFetch<RodeoSummary[]>('/asset-groups/my-asset-groups');
}

export function getRodeo(id_asset_group: number) {
  return apiFetch<RodeoDetail>(`/asset-groups/${id_asset_group}`);
}

export function createRodeo(payload: RodeoCreate) {
  return apiFetch<unknown>('/asset-groups', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateRodeo(id_asset_group: number, payload: RodeoUpdate) {
  return apiFetch<unknown>(`/asset-groups/${id_asset_group}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function setRodeoActivation(
  id_asset_group: number,
  payload: RodeoActivationUpdate,
) {
  return apiFetch<unknown>(`/asset-groups/${id_asset_group}/activation`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function addRodeoMembers(id_asset_group: number, payload: RodeoMembersPayload) {
  return apiFetch<unknown>(`/asset-groups/${id_asset_group}/members`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function removeRodeoMembers(id_asset_group: number, payload: RodeoMembersPayload) {
  return apiFetch<unknown>(`/asset-groups/${id_asset_group}/members`, {
    method: 'DELETE',
    body: JSON.stringify(payload),
  });
}
