export type Position = [number, number];
export type LinearRing = Position[];
export type PolygonCoordinates = LinearRing[];
export type MultiPolygonCoordinates = PolygonCoordinates[];

export type GeoJSONMultiPolygon = {
  type: 'MultiPolygon';
  coordinates: MultiPolygonCoordinates;
};

export type GeoFenceRead = {
  id_geofence: number;
  client_id: number;
  name: string;
  description: string | null;
  shape: GeoJSONMultiPolygon | null;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type GeoFenceAssignedAsset = {
  asset_id: number;
  asset_name?: string | null;
  asset_type?: string | null;
  asset_serial?: string | null;
  device_id?: number | null;
  device_serial?: string | null;
  device_name?: string | null;
  device_active?: boolean | null;
  device_state?: string | null;
};

export type GeoFenceAssignedAssetGroup = {
  id_asset_group: number;
  name: string;
  description?: string | null;
  active?: boolean;
  total_assets?: number;
  created_at?: string;
  updated_at?: string;
};

export type GeoFenceDetailRead = GeoFenceRead & {
  assets_assigned_direct: GeoFenceAssignedAsset[];
  asset_groups_assigned: GeoFenceAssignedAssetGroup[];
  assets_assigned_effective: GeoFenceAssignedAsset[];
  total_assets_direct: number;
  total_asset_groups: number;
  total_assets_effective: number;
};

export type GeoFenceCreate = {
  name: string;
  description?: string | null;
  shape: GeoJSONMultiPolygon;
  active: boolean;
};

export type GeoFenceUpdate = {
  name?: string | null;
  description?: string | null;
  shape?: GeoJSONMultiPolygon | null;
};

export type GeoFenceActivationUpdate = {
  active: boolean;
};

export type GeoFenceAssignmentCreate = {
  asset_ids: number[];
};

export type GeoFenceAssetGroupAssignmentPayload = {
  asset_group_ids: number[];
};

export type GeoFenceAssignmentRead = {
  id_assignment?: number;
  id_geofence_assignment?: number;
  fence_id?: number;
  geofence_id?: number;
  asset_id: number;
  active: boolean;
  assigned_at: string;
  unassigned_at: string | null;
  [key: string]: unknown;
};
