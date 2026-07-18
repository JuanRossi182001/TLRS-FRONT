import { useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../auth/hooks/useAuth';
import { clearAccessToken } from '../../../shared/api/authTokenStore';
import { ApiError } from '../../../shared/api/httpClient';
import {
  buildLocationsWebSocketUrl,
  getMyDevicesLatestLocations,
  requestLocationsWebSocketTicket,
} from '../api/map.api';
import type {
  DeviceLatestLocation,
  DeviceLocationUpdatedEvent,
} from '../types/map.types';

const myDevicesLatestLocationsQueryKey = ['devices', 'my-devices', 'latest-locations'] as const;
const locationsRealtimeDebugStorageKey = 'debug:locations-realtime';

function isLocationsRealtimeDebugEnabled() {
  return import.meta.env.DEV && window.localStorage.getItem(locationsRealtimeDebugStorageKey) === '1';
}

function logLocationsRealtimeDebug(message: string, details?: unknown) {
  if (!isLocationsRealtimeDebugEnabled()) {
    return;
  }

  if (typeof details === 'undefined') {
    console.info(`[locations-realtime] ${message}`);
    return;
  }

  console.info(`[locations-realtime] ${message}`, details);
}

function setLocationsRealtimeDebugValue(key: string, value: unknown) {
  if (!isLocationsRealtimeDebugEnabled()) {
    return;
  }

  (window as Window & { __locationsRealtimeDebug?: Record<string, unknown> }).__locationsRealtimeDebug = {
    ...(window as Window & { __locationsRealtimeDebug?: Record<string, unknown> }).__locationsRealtimeDebug,
    [key]: value,
  };
}

function isDeviceLocationUpdatedEvent(value: unknown): value is DeviceLocationUpdatedEvent {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const event = value as Partial<DeviceLocationUpdatedEvent>;
  const data = event.data;

  if (event.type !== 'device.location.updated' || !data || typeof data !== 'object') {
    return false;
  }

  return (
    typeof data.device_id === 'number' &&
    typeof data.location_id === 'number' &&
    typeof data.device_serial === 'string' &&
    typeof data.latitude === 'number' &&
    typeof data.longitude === 'number' &&
    typeof data.recorded_at === 'string'
  );
}

function mergeDeviceLatestLocation(
  device: DeviceLatestLocation,
  event: DeviceLocationUpdatedEvent,
): DeviceLatestLocation {
  return {
    ...device,
    id_location: event.data.location_id,
    id_device: event.data.device_id,
    serial: event.data.device_serial,
    client_id: event.data.client_id,
    latitude: event.data.latitude,
    longitude: event.data.longitude,
    altitude: event.data.altitude,
    accuracy: event.data.accuracy,
    device_timestamp: event.data.recorded_at,
    received_at: event.data.recorded_at,
  };
}

export function useMyDevicesLatestLocations() {
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const socketRef = useRef<WebSocket | null>(null);
  const connectionAttemptRef = useRef(0);
  const latestLocationsQuery = useQuery<DeviceLatestLocation[]>({
    queryKey: myDevicesLatestLocationsQueryKey,
    queryFn: getMyDevicesLatestLocations,
    staleTime: 15_000,
  });

  useEffect(() => {
    if (!isAuthenticated || isAuthLoading || !latestLocationsQuery.isSuccess) {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }

      return;
    }

    const connectionAttempt = connectionAttemptRef.current + 1;
    connectionAttemptRef.current = connectionAttempt;
    let isCancelled = false;

    async function connect() {
      try {
        logLocationsRealtimeDebug('Solicitando ticket para websocket.');
        const { ticket } = await requestLocationsWebSocketTicket();

        if (isCancelled || connectionAttemptRef.current !== connectionAttempt) {
          logLocationsRealtimeDebug('Ticket descartado por intento obsoleto.');
          return;
        }

        if (socketRef.current) {
          socketRef.current.close();
          socketRef.current = null;
        }

        const socketUrl = buildLocationsWebSocketUrl(ticket);
        logLocationsRealtimeDebug('Abriendo WebSocket.', { socketUrl });
        const socket = new WebSocket(socketUrl);
        socketRef.current = socket;
        setLocationsRealtimeDebugValue('socket', socket);
        setLocationsRealtimeDebugValue('queryClient', queryClient);

        socket.onopen = () => {
          logLocationsRealtimeDebug('WebSocket conectado.', {
            readyState: socket.readyState,
            protocol: socket.protocol,
            extensions: socket.extensions,
            bufferedAmount: socket.bufferedAmount,
          });
        };

        socket.onerror = () => {
          logLocationsRealtimeDebug('WebSocket emitio error.', {
            readyState: socket.readyState,
            bufferedAmount: socket.bufferedAmount,
          });
        };

        socket.onmessage = (messageEvent) => {
          logLocationsRealtimeDebug('Frame recibido.', {
            dataType: typeof messageEvent.data,
            data: messageEvent.data,
          });

          if (typeof messageEvent.data !== 'string') {
            logLocationsRealtimeDebug('Mensaje realtime ignorado por no ser string.');
            return;
          }

          try {
            const parsedEvent = JSON.parse(messageEvent.data) as unknown;

            if (!isDeviceLocationUpdatedEvent(parsedEvent)) {
              logLocationsRealtimeDebug('Mensaje realtime ignorado por tipo o payload invalido.', parsedEvent);
              return;
            }

            let shouldRefetchSnapshot = false;
            let updatedLocationSummary:
              | {
                  device_id: number;
                  previous: { latitude: number; longitude: number; id_location: number };
                  next: { latitude: number; longitude: number; id_location: number };
                }
              | undefined;

            queryClient.setQueryData<DeviceLatestLocation[]>(
              myDevicesLatestLocationsQueryKey,
              (currentDevices) => {
                if (!currentDevices) {
                  logLocationsRealtimeDebug('No habia snapshot en cache al recibir evento realtime.');
                  return currentDevices;
                }

                let hasUpdatedDevice = false;
                const nextDevices = currentDevices.map((device) => {
                  if (device.id_device !== parsedEvent.data.device_id) {
                    return device;
                  }

                  hasUpdatedDevice = true;
                  const nextDevice = mergeDeviceLatestLocation(device, parsedEvent);
                  updatedLocationSummary = {
                    device_id: device.id_device,
                    previous: {
                      latitude: device.latitude,
                      longitude: device.longitude,
                      id_location: device.id_location,
                    },
                    next: {
                      latitude: nextDevice.latitude,
                      longitude: nextDevice.longitude,
                      id_location: nextDevice.id_location,
                    },
                  };
                  return nextDevice;
                });

                if (!hasUpdatedDevice) {
                  shouldRefetchSnapshot = true;
                }

                return nextDevices;
              },
            );

            if (updatedLocationSummary) {
              logLocationsRealtimeDebug('Cache de ubicaciones actualizada desde websocket.', updatedLocationSummary);
            }

            if (shouldRefetchSnapshot) {
              logLocationsRealtimeDebug(
                'Evento recibido para device ausente en snapshot. Invalidando query para resincronizar.',
                parsedEvent.data,
              );
              queryClient.invalidateQueries({ queryKey: myDevicesLatestLocationsQueryKey });
            }
          } catch {
            // Ignore malformed realtime payloads to keep the map usable.
            logLocationsRealtimeDebug('Fallo el parseo del mensaje realtime.', messageEvent.data);
          }
        };

        socket.onclose = (closeEvent) => {
          if (socketRef.current === socket) {
            socketRef.current = null;
          }

          if (isCancelled) {
            return;
          }

          logLocationsRealtimeDebug('WebSocket cerrado.', {
            code: closeEvent.code,
            reason: closeEvent.reason,
            wasClean: closeEvent.wasClean,
            readyState: socket.readyState,
          });

          if (closeEvent.code === 1008) {
            clearAccessToken();
            return;
          }

          if (closeEvent.code === 1011) {
            return;
          }
        };
      } catch (error) {
        if (isCancelled) {
          return;
        }

        logLocationsRealtimeDebug('Fallo la conexion realtime.', error);

        if (error instanceof ApiError && (error.status === 403 || error.status === 503)) {
          return;
        }
      }
    }

    void connect();

    return () => {
      isCancelled = true;

      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [isAuthenticated, isAuthLoading, latestLocationsQuery.isSuccess, queryClient]);

  return latestLocationsQuery;
}
