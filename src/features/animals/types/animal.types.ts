export type AssetListItem = {
  id_asset: number;
  asset_type: string;
  serial: string;
  client_id: number;
  status: string;
  assigned_device_id: number | null;
};

export type CreateAnimalRequest = {
  serial: string;
  client_id: number;
};
