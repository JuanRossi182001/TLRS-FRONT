import { useEffect, useMemo, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import Map, { Layer, NavigationControl, Popup, Source, type MapRef } from 'react-map-gl/maplibre';
import type { HeatmapCell, HeatmapFeatureProperties, HeatmapResponse } from '../types/heatmap.types';

type HeatmapMapProps = {
  result: HeatmapResponse;
};

type SelectedCell = {
  properties: HeatmapFeatureProperties;
  longitude: number;
  latitude: number;
};

const mapStyle: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: 'OpenStreetMap contributors',
    },
  },
  layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
};

function buildHeatmapData(cells: HeatmapCell[]) {
  const maximum = Math.max(...cells.map((cell) => cell.dwell_seconds), 0);
  const features = cells.map((cell) => {
    // Render-only anchor derived from the cell polygon, not an observed GPS fix.
    const ring = cell.geometry.coordinates[0].slice(0, -1);
    const anchor: [number, number] = [
      ring.reduce((total, point) => total + point[0], 0) / ring.length,
      ring.reduce((total, point) => total + point[1], 0) / ring.length,
    ];
    const relative_intensity = maximum > 0 ? cell.dwell_seconds / maximum : 0;
    const properties = {
      spatial_cell_id: cell.spatial_cell_id,
      dwell_seconds: cell.dwell_seconds,
      relative_intensity,
    };

    return {
      polygon: {
        type: 'Feature' as const,
        id: cell.spatial_cell_id,
        geometry: cell.geometry,
        properties,
      },
      point: {
        type: 'Feature' as const,
        id: cell.spatial_cell_id,
        geometry: { type: 'Point' as const, coordinates: anchor },
        properties,
      },
    };
  });

  return {
    polygons: {
      type: 'FeatureCollection' as const,
      features: features.map(({ polygon }) => polygon),
    },
    heatmapPoints: {
      type: 'FeatureCollection' as const,
      features: features.map(({ point }) => point),
    },
  };
}

function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours} h ${minutes} min`;
  if (minutes > 0) return `${minutes} min`;
  return `${Math.round(seconds)} s`;
}

export function HeatmapMap({ result }: HeatmapMapProps) {
  const mapRef = useRef<MapRef>(null);
  const [selectedCell, setSelectedCell] = useState<SelectedCell | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const data = useMemo(() => buildHeatmapData(result.cells), [result.cells]);

  useEffect(() => {
    setSelectedCell(null);
    if (!isMapLoaded || result.cells.length === 0) return;
    const map = mapRef.current;
    if (!map) return;

    const bounds = result.cells.flatMap((cell) => cell.geometry.coordinates[0]).reduce(
      (current, coordinate) => current.extend([coordinate[0], coordinate[1]]),
      new maplibregl.LngLatBounds(
        [result.cells[0].geometry.coordinates[0][0][0], result.cells[0].geometry.coordinates[0][0][1]],
        [result.cells[0].geometry.coordinates[0][0][0], result.cells[0].geometry.coordinates[0][0][1]],
      ),
    );
    map.fitBounds(bounds, {
      padding: { top: 64, bottom: 72, left: 64, right: 64 },
      maxZoom: 18.5,
      duration: 0,
    });
  }, [isMapLoaded, result]);

  return (
    <div className="relative h-[min(58vh,34rem)] min-h-[19rem] overflow-hidden rounded-2xl border border-brand-border/70 bg-brand-surface shadow-lg shadow-brand-primary/10 lg:h-[calc(100dvh-18rem)] lg:min-h-[28rem]">
      <Map
        ref={mapRef}
        mapLib={maplibregl}
        initialViewState={{ latitude: -33, longitude: -65, zoom: 5 }}
        mapStyle={mapStyle}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        interactiveLayerIds={['heatmap-cells-hit']}
        onLoad={() => setIsMapLoaded(true)}
        onClick={(event) => {
          const feature = event.features?.[0];
          if (!feature?.properties) {
            setSelectedCell(null);
            return;
          }
          setSelectedCell({
            properties: feature.properties as HeatmapFeatureProperties,
            longitude: event.lngLat.lng,
            latitude: event.lngLat.lat,
          });
        }}
      >
        <NavigationControl position="bottom-right" />
        <Source id="heatmap-cell-anchors" type="geojson" data={data.heatmapPoints}>
          <Layer
            id="heatmap-cloud"
            type="heatmap"
            paint={{
              'heatmap-weight': ['get', 'relative_intensity'],
              'heatmap-intensity': 0.9,
              'heatmap-radius': [
                'interpolate', ['linear'], ['zoom'],
                11, 10, 13, 20, 15, 36, 17, 60, 19, 76,
              ],
              'heatmap-opacity': 0.88,
              'heatmap-color': [
                'interpolate', ['linear'], ['heatmap-density'],
                0, 'rgba(44,76,160,0)',
                0.025, '#4059ad',
                0.07, '#2b83ba',
                0.14, '#22a884',
                0.24, '#8bd646',
                0.34, '#f5d547',
                0.48, '#fdae32',
                0.64, '#f46d43',
                1, '#cf2e2e',
              ],
            }}
          />
        </Source>
        <Source id="heatmap-cells" type="geojson" data={data.polygons}>
          <Layer
            id="heatmap-cells-fill"
            type="fill"
            paint={{
              'fill-color': [
                'interpolate', ['linear'], ['get', 'relative_intensity'],
                0, '#fff1c2', 0.5, '#ffae42', 1, '#c43d22',
              ],
              'fill-opacity': 0.015,
            }}
          />
          <Layer
            id="heatmap-cells-outline"
            type="line"
            filter={selectedCell
              ? ['==', ['get', 'spatial_cell_id'], selectedCell.properties.spatial_cell_id]
              : ['==', ['get', 'spatial_cell_id'], '__no_selected_cell__']}
            paint={{ 'line-color': '#7f311e', 'line-opacity': 0.95, 'line-width': 2 }}
          />
          <Layer
            id="heatmap-cells-hit"
            type="fill"
            paint={{ 'fill-color': '#000000', 'fill-opacity': 0.01 }}
          />
        </Source>
        {selectedCell ? (
          <Popup
            longitude={selectedCell.longitude}
            latitude={selectedCell.latitude}
            closeButton
            closeOnClick={false}
            onClose={() => setSelectedCell(null)}
            anchor="bottom"
          >
            <div className="min-w-36 space-y-1 text-sm text-slate-800">
              <p><strong>Permanencia estimada:</strong> {formatDuration(selectedCell.properties.dwell_seconds)}</p>
              <p><strong>Intensidad relativa:</strong> {Math.round(selectedCell.properties.relative_intensity * 100)}% del máximo</p>
            </div>
          </Popup>
        ) : null}
      </Map>
      <div className="pointer-events-none absolute bottom-3 left-3 z-10 rounded-xl border border-white/70 bg-white/95 px-3 py-2 text-xs font-medium text-slate-700 shadow">
        <div className="flex items-center gap-2">
          <span>Menor</span>
          <span
            className="h-2.5 w-20 rounded-full"
            style={{ background: 'linear-gradient(to right, #4059ad, #2b83ba, #22a884, #8bd646, #f5d547, #fdae32, #f46d43, #cf2e2e)' }}
          />
          <span>Mayor permanencia</span>
        </div>
        <p className="mt-1 text-[10px] font-normal text-slate-500">Nube suavizada por celda; los clics consultan los valores exactos.</p>
      </div>
    </div>
  );
}
