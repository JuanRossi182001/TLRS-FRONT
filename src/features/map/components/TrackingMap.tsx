import { useEffect, useRef, useState } from 'react';
import maplibregl, { type StyleSpecification } from 'maplibre-gl';
import Map, { Marker, NavigationControl, type MapRef } from 'react-map-gl/maplibre';
import { GeofenceDraftLayer } from '../../geofences/components/GeofenceDraftLayer';
import { GeofenceLayer } from '../../geofences/components/GeofenceLayer';
import type { GeoFenceAssetState } from '../../geofences/types/geofenceState.types';
import type { GeoFenceRead, Position } from '../../geofences/types/geofence.types';
import type { DeviceLatestLocation } from '../types/map.types';
import { DeviceMapMarker } from './DeviceMapMarker';
import { DeviceMapPopup } from './DeviceMapPopup';
import { MapDeviceBottomSheet } from './MapDeviceBottomSheet';

type TrackingMapProps = {
  devices: DeviceLatestLocation[];
  editingGeofenceId?: number;
  geofences?: GeoFenceRead[];
  geofenceStates?: GeoFenceAssetState[];
  isDrawingGeofence?: boolean;
  draftPoints?: Position[];
  onAddDraftPoint?: (point: Position) => void;
  onMoveDraftPoint?: (index: number, point: Position) => void;
  onRemoveDraftPoint?: (index: number) => void;
};

const initialViewState = {
  latitude: -31.4201,
  longitude: -64.1888,
  zoom: 11.5,
};

const popupViewportPadding = 24;
const popupWidth = 280;
const popupHeight = 190;

function isLocationsRealtimeDebugEnabled() {
  return import.meta.env.DEV && window.localStorage.getItem('debug:locations-realtime') === '1';
}

const mapStyle: StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: 'OpenStreetMap contributors',
    },
  },
  layers: [
    {
      id: 'osm',
      type: 'raster',
      source: 'osm',
    },
  ],
};

export function TrackingMap({
  devices,
  editingGeofenceId,
  geofences = [],
  geofenceStates = [],
  isDrawingGeofence = false,
  draftPoints = [],
  onAddDraftPoint,
  onMoveDraftPoint,
  onRemoveDraftPoint,
}: TrackingMapProps) {
  const mapRef = useRef<MapRef>(null);
  const hasFitInitialLocationsRef = useRef(false);
  const lastFocusedGeofenceIdRef = useRef<number | undefined>();
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | undefined>();
  const selectedDevice = selectedDeviceId
    ? devices.find((device) => device.id_device === selectedDeviceId)
    : undefined;
  const selectedDeviceState = selectedDevice
    ? geofenceStates.find(
        (state) =>
          state.device_id === selectedDevice.id_device ||
          (selectedDevice.asset_id !== null && state.asset_id === selectedDevice.asset_id),
      )
    : undefined;

  useEffect(() => {
    if (!isMapLoaded || !editingGeofenceId || draftPoints.length === 0) {
      return;
    }

    if (lastFocusedGeofenceIdRef.current === editingGeofenceId) {
      return;
    }

    const map = mapRef.current;

    if (!map) {
      return;
    }

    lastFocusedGeofenceIdRef.current = editingGeofenceId;
    hasFitInitialLocationsRef.current = true;

    if (draftPoints.length === 1) {
      const [point] = draftPoints;
      map.flyTo({
        center: point,
        zoom: 15,
        duration: 700,
      });
      return;
    }

    const bounds = draftPoints.reduce(
      (currentBounds, point) => currentBounds.extend(point),
      new maplibregl.LngLatBounds(draftPoints[0], draftPoints[0]),
    );

    map.fitBounds(bounds, {
      padding: { top: 80, bottom: 80, left: 80, right: 80 },
      duration: 700,
      maxZoom: 15,
    });
  }, [draftPoints, editingGeofenceId, isMapLoaded]);

  useEffect(() => {
    if (
      !isMapLoaded ||
      devices.length === 0 ||
      hasFitInitialLocationsRef.current ||
      (editingGeofenceId && draftPoints.length > 0)
    ) {
      return;
    }

    const map = mapRef.current;

    if (!map) {
      return;
    }

    if (devices.length === 1) {
      const [device] = devices;
      hasFitInitialLocationsRef.current = true;
      map.flyTo({
        center: [device.longitude, device.latitude],
        zoom: 13,
        duration: 700,
      });
      return;
    }

    const bounds = devices.reduce(
      (currentBounds, device) =>
        currentBounds.extend([device.longitude, device.latitude]),
      new maplibregl.LngLatBounds(
        [devices[0].longitude, devices[0].latitude],
        [devices[0].longitude, devices[0].latitude],
      ),
    );

    hasFitInitialLocationsRef.current = true;
    map.fitBounds(bounds, {
      padding: { top: 80, bottom: 120, left: 60, right: 60 },
      duration: 700,
      maxZoom: 14,
    });
  }, [devices, draftPoints.length, editingGeofenceId, isMapLoaded]);

  useEffect(() => {
    if (!isLocationsRealtimeDebugEnabled()) {
      return;
    }

    console.info(
      '[tracking-map] Render con devices:',
      devices.map((device) => ({
        id_device: device.id_device,
        id_location: device.id_location,
        latitude: device.latitude,
        longitude: device.longitude,
      })),
    );
  }, [devices]);

  useEffect(() => {
    if (!isMapLoaded || isDrawingGeofence || !selectedDeviceId || !window.matchMedia('(min-width: 768px)').matches) {
      return;
    }

    const selectedMapDevice = devices.find((device) => device.id_device === selectedDeviceId);
    const map = mapRef.current;

    if (!selectedMapDevice || !map) {
      return;
    }

    const point = map.project([selectedMapDevice.longitude, selectedMapDevice.latitude]);
    const container = map.getContainer();
    const horizontalHalfWidth = popupWidth / 2;
    const leftEdge = point.x - horizontalHalfWidth;
    const rightEdge = point.x + horizontalHalfWidth;
    const topEdge = point.y - popupHeight;

    let deltaX = 0;
    let deltaY = 0;

    if (leftEdge < popupViewportPadding) {
      deltaX = popupViewportPadding - leftEdge;
    } else if (rightEdge > container.clientWidth - popupViewportPadding) {
      deltaX = container.clientWidth - popupViewportPadding - rightEdge;
    }

    if (topEdge < popupViewportPadding) {
      deltaY = popupViewportPadding - topEdge;
    }

    if (deltaX === 0 && deltaY === 0) {
      return;
    }

    const currentCenterPoint = map.project(map.getCenter());
    const nextCenter = map.unproject([currentCenterPoint.x - deltaX, currentCenterPoint.y - deltaY]);

    map.easeTo({
      center: nextCenter,
      duration: 250,
    });
  }, [isDrawingGeofence, isMapLoaded, selectedDeviceId]);

  return (
    <div className="relative min-h-0 flex-1 overflow-hidden rounded-[2rem] border border-brand-border/70 bg-brand-surface shadow-xl shadow-brand-primary/10">
      <Map
        ref={mapRef}
        mapLib={maplibregl}
        initialViewState={initialViewState}
        mapStyle={mapStyle}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        attributionControl={{ compact: true }}
        cursor={isDrawingGeofence ? 'crosshair' : 'grab'}
        onClick={(event) => {
          if (isDrawingGeofence) {
            onAddDraftPoint?.([event.lngLat.lng, event.lngLat.lat]);
            return;
          }

          setSelectedDeviceId(undefined);
        }}
        onLoad={() => setIsMapLoaded(true)}
      >
        <NavigationControl position="top-right" />

        <GeofenceLayer geofences={geofences} />
        <GeofenceDraftLayer
          on_move_point={(index, point) => onMoveDraftPoint?.(index, point)}
          on_remove_point={(index) => onRemoveDraftPoint?.(index)}
          points={draftPoints}
        />

        {devices.map((device) => (
          <Marker
            key={device.id_device}
            latitude={device.latitude}
            longitude={device.longitude}
            anchor="bottom"
          >
            <DeviceMapMarker
              device={device}
              isSelected={selectedDeviceId === device.id_device}
              onClick={() => setSelectedDeviceId(device.id_device)}
            />
          </Marker>
        ))}

        {selectedDevice && !isDrawingGeofence ? (
          <DeviceMapPopup
            device={selectedDevice}
            geofenceState={selectedDeviceState}
            onClose={() => setSelectedDeviceId(undefined)}
          />
        ) : null}
      </Map>

      <MapDeviceBottomSheet
        device={isDrawingGeofence ? undefined : selectedDevice}
        geofenceState={selectedDeviceState}
        onClose={() => setSelectedDeviceId(undefined)}
      />
    </div>
  );
}
