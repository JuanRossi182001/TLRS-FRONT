import { Button, Card } from '../../../shared/components';

export function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Login</h1>
        <p className="mt-2 text-sm text-slate-600">
          Acceso placeholder para la aplicacion GPS / IoT.
        </p>
        <Button className="mt-6 w-full">Ingresar</Button>
      </Card>
    </main>
  );
}
