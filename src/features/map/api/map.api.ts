import { apiFetch, getApiBaseUrl } from '../../../shared/api/httpClient';
import type {
  DeviceLatestLocation,
  WebSocketTicketResponse,
} from '../types/map.types';

export function getMyDevicesLatestLocations(): Promise<DeviceLatestLocation[]> {
  return apiFetch<DeviceLatestLocation[]>('/devices/my-devices/latest-locations');
}

export function requestLocationsWebSocketTicket(): Promise<WebSocketTicketResponse> {
  return apiFetch<WebSocketTicketResponse>('/auth/websocket-ticket', {
    method: 'POST',
  });
}

export function buildLocationsWebSocketUrl(ticket: string) {
  const apiUrl = new URL(getApiBaseUrl());
  const protocol = apiUrl.protocol === 'https:' ? 'wss:' : 'ws:';
  const socketUrl = new URL(`${protocol}//${apiUrl.host}/ws/locations`);

  socketUrl.searchParams.set('ticket', ticket);

  return socketUrl.toString();
}
