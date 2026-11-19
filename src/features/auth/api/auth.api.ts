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

export function requestPasswordReset(email: string) {
  return apiFetch<{ message: string }>('/user/auth/password-reset/request', {
    method: 'POST',
    skipAuth: true,
    skipRefresh: true,
    body: JSON.stringify({ email }),
  });
}

export function confirmPasswordReset(token: string, new_password: string) {
  return apiFetch<{ message: string }>('/user/auth/password-reset/confirm', {
    method: 'POST',
    skipAuth: true,
    skipRefresh: true,
    body: JSON.stringify({ token, new_password }),
  });
}

export function confirmEmailVerification(token: string) {
  return apiFetch<{ message: string }>('/user/auth/email-verification/confirm', {
    method: 'POST',
    skipAuth: true,
    skipRefresh: true,
    body: JSON.stringify({ token }),
  });
}

export function requestEmailVerification(email: string) {
  return apiFetch<{ message: string }>('/user/auth/email-verification/request', {
    method: 'POST',
    skipAuth: true,
    skipRefresh: true,
    body: JSON.stringify({ email }),
  });
}

export function requestAccountActivation(email: string) {
  return apiFetch<{ message: string }>('/user/auth/account-activation/request', {
    method: 'POST',
    skipAuth: true,
    skipRefresh: true,
    body: JSON.stringify({ email }),
  });
}

export function activateAccount(token: string, new_password: string) {
  return apiFetch<{ message: string }>('/user/auth/account-activation/confirm', {
    method: 'POST',
    skipAuth: true,
    skipRefresh: true,
    body: JSON.stringify({ token, new_password }),
  });
}
