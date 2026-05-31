import type { FeatureCollection, MultiPolygon } from 'geojson';
import { Layer, Source } from 'react-map-gl/maplibre';
import type { GeoFenceRead, GeoJSONMultiPolygon } from '../types/geofence.types';

type GeofenceLayerProps = {
  geofences: GeoFenceRead[];
};

export function GeofenceLayer({ geofences }: GeofenceLayerProps) {
  const active_geofences = geofences.filter(
    (geofence): geofence is GeoFenceRead & { shape: GeoJSONMultiPolygon } =>
      geofence.active && geofence.shape !== null,
  );

  const features = active_geofences.map((geofence) => ({
    type: 'Feature' as const,
    properties: {
      id_geofence: geofence.id_geofence,
      name: geofence.name,
      active: geofence.active,
    },
    geometry: geofence.shape as MultiPolygon,
  }));

  if (active_geofences.length === 0) {
    return null;
  }

  const data: FeatureCollection<MultiPolygon> = {
    type: 'FeatureCollection',
    features,
  };

  return (
    <Source id="geofences" type="geojson" data={data}>
      <Layer
        id="geofences-fill"
        type="fill"
        paint={{
          'fill-color': '#7dd3fc',
          'fill-opacity': 0.16,
        }}
      />
      <Layer
        id="geofences-outline"
        type="line"
        paint={{
          'line-color': '#dc2626',
          'line-width': 2,
          'line-opacity': 0.82,
        }}
      />
    </Source>
  );
}
