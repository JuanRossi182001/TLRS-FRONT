import type { GeoJSONMultiPolygon, Position } from '../types/geofence.types';

function areSamePosition(first: Position, second: Position) {
  return first[0] === second[0] && first[1] === second[1];
}

export function getDraftPointsFromShape(shape: GeoJSONMultiPolygon | null | undefined) {
  const ring = shape?.coordinates[0]?.[0] ?? [];

  if (ring.length > 1 && areSamePosition(ring[0], ring[ring.length - 1])) {
    return ring.slice(0, -1);
  }

  return ring;
}

export function buildShapeFromDraftPoints(points: Position[]): GeoJSONMultiPolygon {
  return {
    type: 'MultiPolygon',
    coordinates: [[[...points, points[0]]]],
  };
}
