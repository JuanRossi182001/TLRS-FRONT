import { apiFetch } from '../../../shared/api/httpClient';
import type { HeatmapRequest, HeatmapResponse } from '../types/heatmap.types';

export function requestHeatmap(payload: HeatmapRequest) {
  return apiFetch<HeatmapResponse>('/analytics/heatmaps', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
