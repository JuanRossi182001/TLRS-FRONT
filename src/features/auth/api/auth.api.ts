import { apiFetch } from '../../../shared/api/httpClient';
import type { LoginRequest, TokenResponse } from '../types/auth.types';

export function loginRequest(payload: LoginRequest) {
  const formData = new URLSearchParams({
    grant_type: 'password',
    username: payload.username,
    password: payload.password,
    scope: '',
  });

  return apiFetch<TokenResponse>('/user/auth/login', {
    method: 'POST',
    skipAuth: true,
    skipRefresh: true,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData,
  });
}

export function refreshRequest() {
  return apiFetch<TokenResponse>('/user/auth/refresh', {
    method: 'POST',
    skipAuth: true,
    skipRefresh: true,
    credentials: 'include',
  });
}

export function logoutRequest() {
  return apiFetch<void>('/user/auth/logout', {
    method: 'POST',
    skipAuth: true,
    skipRefresh: true,
    credentials: 'include',
  });
}
