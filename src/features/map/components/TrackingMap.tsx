import { useState } from 'react';
import maplibregl, { type StyleSpecification } from 'maplibre-gl';
import Map, { Marker, NavigationControl } from 'react-map-gl/maplibre';
import type { LocatedDeviceTrackingItem } from '../types/map.types';
import { DeviceMapMarker } from './DeviceMapMarker';
import { DeviceMapPopup } from './DeviceMapPopup';
import { MapDeviceBottomSheet } from './MapDeviceBottomSheet';
import { MapEmptyState } from './MapEmptyState';

type TrackingMapProps = {
  devices: LocatedDeviceTrackingItem[];
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

export function TrackingMap({ devices }: TrackingMapProps) {
  const [selectedDevice, setSelectedDevice] = useState<LocatedDeviceTrackingItem | undefined>();

  if (devices.length === 0) {
    return <MapEmptyState />;
  }

  return (
    <div className="relative h-[calc(100dvh-15rem)] min-h-[460px] overflow-hidden rounded-lg border border-slate-200 bg-slate-100 lg:h-[calc(100dvh-10rem)] lg:min-h-[520px]">
      <Map
        mapLib={maplibregl}
        initialViewState={initialViewState}
        mapStyle={mapStyle}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        attributionControl={{ compact: true }}
        onClick={() => setSelectedDevice(undefined)}
      >
        <NavigationControl position="top-right" />

        {devices.map((item) => (
          <Marker
            key={item.device.idDevice}
            latitude={item.lastLocation.latitude}
            longitude={item.lastLocation.longitude}
            anchor="bottom"
          >
            <DeviceMapMarker
              state={item.device.state}
              isSelected={selectedDevice?.device.idDevice === item.device.idDevice}
              onClick={() => setSelectedDevice(item)}
            />
          </Marker>
        ))}

        {selectedDevice ? (
          <DeviceMapPopup item={selectedDevice} onClose={() => setSelectedDevice(undefined)} />
        ) : null}
      </Map>

      <MapDeviceBottomSheet
        item={selectedDevice}
        onClose={() => setSelectedDevice(undefined)}
      />
    </div>
  );
}
