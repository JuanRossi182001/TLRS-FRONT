export type HeatmapSubjectType = 'asset' | 'asset_group';

export type HeatmapRequest = {
  subject_type: HeatmapSubjectType;
  subject_id: number;
  window_start: string;
  window_end: string;
};

export type HeatmapCell = {
  spatial_cell_id: string;
  geometry: {
    type: 'Polygon';
    coordinates: number[][][];
  };
  dwell_seconds: number;
};

export type HeatmapResponse = {
  subject_type: HeatmapSubjectType;
  subject_id: number;
  window_start: string;
  window_end: string;
  availability: 'available' | 'no_data' | 'insufficient_evidence';
  total_dwell_seconds: number;
  coverage: {
    temporal_coverage_ratio: number | null;
    observed_seconds: number;
    eligible_assignment_seconds: number;
    requested_seconds: number;
  };
  crs: string;
  cell_size_meters: number;
  cells: HeatmapCell[];
};

export type HeatmapFeatureProperties = {
  spatial_cell_id: string;
  dwell_seconds: number;
  relative_intensity: number;
};
