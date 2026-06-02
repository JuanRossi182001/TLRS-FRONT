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
  geofences = [],
  geofenceStates = [],
  isDrawingGeofence = false,
  draftPoints = [],
  onAddDraftPoint,
  onMoveDraftPoint,
  onRemoveDraftPoint,
}: TrackingMapProps) {
  const mapRef = useRef<MapRef>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<DeviceLatestLocation | undefined>();
  const selectedDeviceState = selectedDevice
    ? geofenceStates.find(
        (state) =>
          state.device_id === selectedDevice.id_device ||
          (selectedDevice.asset_id !== null && state.asset_id === selectedDevice.asset_id),
      )
    : undefined;

  useEffect(() => {
    if (!isMapLoaded || devices.length === 0) {
      return;
    }

    const map = mapRef.current;

    if (!map) {
      return;
    }

    if (devices.length === 1) {
      const [device] = devices;
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

    map.fitBounds(bounds, {
      padding: { top: 80, bottom: 120, left: 60, right: 60 },
      duration: 700,
      maxZoom: 14,
    });
  }, [devices, isMapLoaded]);

  return (
    <div className="relative h-[calc(100dvh-15rem)] min-h-[460px] overflow-hidden rounded-[2rem] border border-brand-border/70 bg-brand-surface shadow-xl shadow-brand-primary/10 lg:h-[calc(100dvh-10rem)] lg:min-h-[520px]">
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

          setSelectedDevice(undefined);
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
            key={device.id_location}
            latitude={device.latitude}
            longitude={device.longitude}
            anchor="bottom"
          >
            <DeviceMapMarker
              device={device}
              geofenceState={geofenceStates.find(
                (state) =>
                  state.device_id === device.id_device ||
                  (device.asset_id !== null && state.asset_id === device.asset_id),
              )}
              isSelected={selectedDevice?.id_device === device.id_device}
              onClick={() => setSelectedDevice(device)}
            />
          </Marker>
        ))}

        {selectedDevice && !isDrawingGeofence ? (
          <DeviceMapPopup
            device={selectedDevice}
            geofenceState={selectedDeviceState}
            onClose={() => setSelectedDevice(undefined)}
          />
        ) : null}
      </Map>

      <MapDeviceBottomSheet
        device={isDrawingGeofence ? undefined : selectedDevice}
        geofenceState={selectedDeviceState}
        onClose={() => setSelectedDevice(undefined)}
      />
    </div>
  );
}
