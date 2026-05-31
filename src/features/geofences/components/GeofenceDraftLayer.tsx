import { useRef } from 'react';
import type { FeatureCollection, LineString, Polygon } from 'geojson';
import { Layer, Marker, Source } from 'react-map-gl/maplibre';
import type { Position } from '../types/geofence.types';

type GeofenceDraftLayerProps = {
  points: Position[];
  on_move_point: (index: number, point: Position) => void;
  on_remove_point: (index: number) => void;
};

function closeRing(points: Position[]) {
  if (points.length < 3) {
    return points;
  }

  return [...points, points[0]];
}

export function GeofenceDraftLayer({
  points,
  on_move_point,
  on_remove_point,
}: GeofenceDraftLayerProps) {
  const long_press_timeout = useRef<number | null>(null);

  if (points.length === 0) {
    return null;
  }

  const geometry: LineString | Polygon = points.length >= 3
    ? {
        type: 'Polygon',
        coordinates: [closeRing(points)],
      }
    : {
        type: 'LineString',
        coordinates: points,
      };

  const lineData: FeatureCollection<LineString | Polygon> = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry,
      },
    ],
  };

  return (
    <>
      <Source id="geofence-draft" type="geojson" data={lineData}>
        {points.length >= 3 ? (
          <Layer
            id="geofence-draft-fill"
            type="fill"
            paint={{
              'fill-color': '#7dd3fc',
              'fill-opacity': 0.16,
            }}
          />
        ) : null}
        <Layer
          id="geofence-draft-line"
          type="line"
          paint={{
            'line-color': '#dc2626',
            'line-width': 3,
            'line-dasharray': [2, 1],
          }}
        />
      </Source>

      {points.map(([longitude, latitude], index) => (
        <Marker
          // The index is stable enough for this short-lived drawing draft.
          key={`${longitude}-${latitude}-${index}`}
          longitude={longitude}
          latitude={latitude}
          anchor="center"
          draggable
          onDragEnd={(event) => {
            on_move_point(index, [event.lngLat.lng, event.lngLat.lat]);
          }}
        >
          <button
            aria-label={`Punto ${index + 1}. Arrastrar para mover o mantener presionado para eliminar.`}
            className="flex h-8 w-8 touch-none items-center justify-center rounded-full border-2 border-white bg-brand-danger text-xs font-bold text-white shadow-lg transition hover:scale-110"
            onContextMenu={(event) => {
              event.preventDefault();
              event.stopPropagation();
              on_remove_point(index);
            }}
            onPointerDown={() => {
              long_press_timeout.current = window.setTimeout(() => {
                on_remove_point(index);
              }, 650);
            }}
            onPointerLeave={() => {
              if (long_press_timeout.current) {
                window.clearTimeout(long_press_timeout.current);
              }
            }}
            onPointerMove={() => {
              if (long_press_timeout.current) {
                window.clearTimeout(long_press_timeout.current);
              }
            }}
            onPointerUp={() => {
              if (long_press_timeout.current) {
                window.clearTimeout(long_press_timeout.current);
              }
            }}
            type="button"
          >
            {index + 1}
          </button>
        </Marker>
      ))}
    </>
  );
}
