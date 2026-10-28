import { Link, useParams } from 'react-router-dom';
import { EmptyState, ErrorState, LoadingState, PageHeader } from '../../../shared/components';
import { ApiError } from '../../../shared/api/httpClient';
import { useResolveCollarQr } from '../hooks/useResolveCollarQr';
import { CollarDetailPage } from './CollarDetailPage';

export function QrCollarPage() {
  const { token = '' } = useParams<{ token: string }>();
  const query = useResolveCollarQr(token);

  if (query.isLoading) {
    return <LoadingState message="Identificando collar..." />;
  }

  if (query.isError) {
    if (query.error instanceof ApiError && query.error.status === 404) {
      return (
        <section className="space-y-4">
          <PageHeader title="Collar no encontrado" description="No encontramos un collar disponible para este código QR." />
          <EmptyState
            title="No pudimos identificar este collar"
            message="Verifica que el QR esté completo o vuelve a collares."
          />
          <Link className="text-sm font-semibold text-brand-primary" to="/app/collars">
            Volver a collares
          </Link>
        </section>
      );
    }

    const message =
      query.error instanceof ApiError && query.error.status === 403
        ? 'Tu usuario no tiene permiso para consultar este collar.'
        : 'No pudimos identificar el collar. Inténtalo nuevamente.';

    return <ErrorState title="No pudimos abrir el collar" message={message} />;
  }

  if (!query.data) {
    return <ErrorState title="No pudimos abrir el collar" message="Inténtalo nuevamente." />;
  }

  return <CollarDetailPage resolvedDevice={query.data} />;
}
