const ARGENTINA_TIME_ZONE = 'America/Argentina/Buenos_Aires';
const explicitTimeZonePattern = /(Z|[+-]\d{2}:?\d{2})$/i;

const argentinaDateTimeFormatter = new Intl.DateTimeFormat('es-AR', {
  dateStyle: 'short',
  timeStyle: 'short',
  timeZone: ARGENTINA_TIME_ZONE,
});

function normalizeUtcTimestamp(value: string) {
  const normalizedValue = value.trim().replace(' ', 'T');

  if (explicitTimeZonePattern.test(normalizedValue)) {
    return normalizedValue;
  }

  return `${normalizedValue}Z`;
}

export function parseUtcTimestamp(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const timestamp = normalizeUtcTimestamp(value);
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

export function getUtcTimestampTime(value: string | null | undefined) {
  return parseUtcTimestamp(value)?.getTime() ?? 0;
}

export function formatArgentinaDateTime(
  value: string | null | undefined,
  fallback = 'Sin datos',
) {
  const date = parseUtcTimestamp(value);

  if (!date) {
    return fallback;
  }

  return argentinaDateTimeFormatter.format(date);
}
