import { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button, ErrorState, LoadingState } from '../../../shared/components';
import { useAdminDeviceQrToken } from '../hooks/useAdminDeviceQrToken';

function getPublicAppUrl() {
  const configuredUrl = import.meta.env.VITE_PUBLIC_APP_URL?.trim();
  const baseUrl = configuredUrl || window.location.origin;
  return baseUrl.replace(/\/+$/, '');
}

export function AdminDeviceQrSection({
  deviceId,
  serial,
}: {
  deviceId: number;
  serial: string;
}) {
  const qrCodeRef = useRef<SVGSVGElement>(null);
  const qrTokenQuery = useAdminDeviceQrToken(deviceId);

  function downloadQrCode() {
    const qrCode = qrCodeRef.current;
    if (!qrCode) return;

    const svg = new XMLSerializer().serializeToString(qrCode);
    const file = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const downloadUrl = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `${serial.replace(/[^a-zA-Z0-9._-]/g, '_')}-qr.svg`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
  }

  if (qrTokenQuery.isLoading) {
    return <LoadingState message="Cargando identidad QR..." />;
  }

  if (qrTokenQuery.isError || !qrTokenQuery.data) {
    return (
      <ErrorState
        title="No pudimos generar el QR"
        message={qrTokenQuery.error instanceof Error ? qrTokenQuery.error.message : 'Inténtalo nuevamente.'}
      />
    );
  }

  const qrUrl = `${getPublicAppUrl()}/c/${encodeURIComponent(qrTokenQuery.data.qr_token)}`;

  return (
    <section aria-labelledby="device-qr-heading" className="border-t border-brand-border/60 pt-5">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-muted" id="device-qr-heading">
        Identificación del collar
      </h3>
      <div className="mt-3 flex flex-col items-center gap-4 rounded-2xl border border-brand-border/60 bg-white p-4 sm:flex-row sm:items-start">
        <div className="rounded-xl bg-white p-2">
          <QRCodeSVG
            bgColor="#ffffff"
            fgColor="#111827"
            level="M"
            marginSize={4}
            ref={qrCodeRef}
            size={192}
            title={`Código QR del collar ${serial}`}
            value={qrUrl}
          />
        </div>
        <div className="min-w-0 space-y-3 text-center sm:text-left">
          <div>
            <p className="font-semibold text-brand-text">{serial}</p>
            <p className="mt-1 break-all text-xs text-brand-muted">{qrUrl}</p>
          </div>
          <Button onClick={downloadQrCode} type="button" variant="secondary">
            Descargar QR (SVG)
          </Button>
          <p className="text-xs text-brand-muted">
            Este código identifica el collar en Manea. No contiene credenciales de provisioning.
          </p>
        </div>
      </div>
    </section>
  );
}
