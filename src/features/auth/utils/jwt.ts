function base64UrlToBase64(value: string) {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);

  return `${base64}${padding}`;
}

export function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const [, payload] = token.split('.');

    if (!payload) {
      return null;
    }

    const decoded = atob(base64UrlToBase64(payload));
    return JSON.parse(decoded) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function getIsAdminFromToken(token: string | null) {
  if (!token) {
    return false;
  }

  const payload = decodeJwtPayload(token);

  return Boolean(payload?.is_admin || payload?.admin);
}
