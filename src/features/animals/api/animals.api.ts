import { createAsset } from '../../admin/api/admin.api';
import { apiFetch } from '../../../shared/api/httpClient';
import type { AssetListItem, CreateAnimalRequest } from '../types/animal.types';

export function getMyAssets() {
  return apiFetch<AssetListItem[]>('/assets/my-assets');
}

export function createAnimal({ serial, client_id }: CreateAnimalRequest) {
  return createAsset({
    asset_type: 'CATTLE',
    serial,
    client_id,
    status: 'ACTIVE',
  });
}
