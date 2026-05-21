import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from './authTokenStore';

type ApiFetchOptions = RequestInit & {
  headers?: HeadersInit;
  skipAuth?: boolean;
  skipRefresh?: boolean;
};

type TokenResponse = {
  access_token: string;
  token_type?: string;
};

let refreshPromise: Promise<string | null> | null = null;

function getApiBaseUrl() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  if (!baseUrl) {
    throw new Error('VITE_API_BASE_URL no esta configurada.');
  }

  return baseUrl;
}

function isAuthPath(path: string) {
  return path === '/user/auth/login' || path === '/user/auth/refresh' || path === '/user/auth/logout';
}

async function getErrorMessage(response: Response) {
  const fallback = `Request failed with status ${response.status}`;

  try {
    const data = await response.json();

    if (typeof data?.detail === 'string') {
      return data.detail;
    }

    if (typeof data?.message === 'string') {
      return data.message;
    }

    return fallback;
  } catch {
    return fallback;
  }
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();

  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}

async function request(path: string, options: ApiFetchOptions) {
  const { skipAuth, skipRefresh, ...fetchOptions } = options;
  const token = getAccessToken();
  const headers = new Headers(options.headers);

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (token && !skipAuth) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return fetch(`${getApiBaseUrl()}${path}`, {
    credentials: 'include',
    ...fetchOptions,
    headers,
  });
}

async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = fetch(`${getApiBaseUrl()}/user/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          clearAccessToken();
          return null;
        }

        const data = await parseResponse<TokenResponse>(response);
        setAccessToken(data.access_token);
        return data.access_token;
      })
      .catch(() => {
        clearAccessToken();
        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const response = await request(path, options);

  if (
    response.status === 401 &&
    !options.skipRefresh &&
    !isAuthPath(path)
  ) {
    const refreshedToken = await refreshAccessToken();

    if (refreshedToken) {
      const retryResponse = await request(path, options);

      if (!retryResponse.ok) {
        throw new Error(await getErrorMessage(retryResponse));
      }

      return parseResponse<T>(retryResponse);
    }
  }

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return parseResponse<T>(response);
}
