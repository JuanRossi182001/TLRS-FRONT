import { ApiError } from '../../../shared/api/httpClient';

export function getProvisioningErrorMessage(error: unknown, fallback: string) {
  if (error instanceof ApiError) {
    const messages: Record<number, string> = {
      400: 'Revisa los datos ingresados. El dispositivo o activo no pudo procesarse.',
      404: 'No encontramos el dispositivo, cliente o activo seleccionado.',
      409: 'El dispositivo o activo ya esta asociado o existe con esos datos.',
      502: 'ChirpStack no respondio al intentar completar la operacion. Intentalo nuevamente.',
      503: 'ChirpStack no esta disponible temporalmente. Intentalo mas tarde.',
    };

    return messages[error.status] ?? error.message;
  }

  return error instanceof Error ? error.message : fallback;
}
