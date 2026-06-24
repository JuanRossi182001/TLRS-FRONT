export type RodeoSummary = {
  id_asset_group: number;
  client_id: number;
  name: string;
  description: string | null;
  active: boolean;
  total_assets: number;
  created_at: string;
  updated_at: string;
};

export type RodeoMember = {
  asset_id: number;
  asset_name?: string | null;
  asset_type: string | null;
  asset_serial: string | null;
  device_id: number | null;
  device_serial: string | null;
  device_name: string | null;
  device_active: boolean | null;
  device_state: string | null;
};

export type RodeoDetail = RodeoSummary & {
  members: RodeoMember[];
};

export type RodeoCreate = {
  name: string;
  description?: string | null;
  asset_ids: number[];
};

export type RodeoUpdate = {
  name: string;
  description?: string | null;
  asset_ids: number[];
};

export type RodeoActivationUpdate = {
  active: boolean;
};

export type RodeoMembersPayload = {
  asset_ids: number[];
};

export type RodeoAssetOption = {
  asset_id: number;
  asset_name: string | null;
  asset_type: string | null;
  asset_serial: string | null;
  device_id: number;
  device_name: string;
  device_serial: string;
  device_active: boolean;
  device_state: string;
  label: string;
  search_text: string;
};
