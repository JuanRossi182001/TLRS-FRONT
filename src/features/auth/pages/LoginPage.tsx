import { FormEvent, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { BrandLogo, Button, Card } from '../../../shared/components';
import { BRAND } from '../../../shared/config/brand';
import { useAuth } from '../hooks/useAuth';

export function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;

  if (isAuthenticated) {
    return <Navigate to="/app/map" replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!username.trim()) {
      setError('El username es requerido.');
      return;
    }

    if (!password) {
      setError('La password es requerida.');
      return;
    }

    try {
      setIsSubmitting(true);
      await login(username.trim(), password);
      navigate(from ?? '/app/map', { replace: true });
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : 'No pudimos iniciar sesion. Intentalo nuevamente.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main
      className="flex min-h-screen items-center justify-center bg-brand-background bg-cover bg-center px-4 py-8"
      style={{
        backgroundImage:
          'linear-gradient(rgba(0, 69, 61, 0.58), rgba(0, 53, 47, 0.72)), url("/images/background-login.jpg")',
      }}
    >
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-brand-border/60 bg-brand-surface shadow-2xl shadow-brand-primary/10 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden bg-brand-primary p-10 text-brand-background lg:flex lg:flex-col lg:justify-between">
          <div>
            <BrandLogo imageClassName="h-16 max-w-[240px]" />
            <p className="mt-8 max-w-sm text-3xl font-semibold leading-tight">
              Visibilidad GPS clara para operar mejor en el campo.
            </p>
            <p className="mt-4 max-w-sm text-sm leading-6 text-brand-background/75">
              Dispositivos, assets y ubicaciones reunidos en una experiencia simple,
              moderna y preparada para crecer.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/10 p-4 text-sm text-brand-background/80">
            {BRAND.tagline}
          </div>
        </section>

        <Card className="w-full rounded-none border-0 !bg-brand-primary p-8 text-brand-background shadow-none sm:p-10 lg:!bg-brand-surface lg:text-brand-text">
          <BrandLogo className="justify-center lg:hidden" imageClassName="h-16 max-w-[220px]" />
          <div className="mt-6 text-center lg:mt-0">
            <h1 className="text-3xl font-semibold tracking-tight text-brand-background lg:text-brand-text">
              Ingresar a {BRAND.name}
            </h1>
            <p className="mt-3 text-sm leading-6 text-brand-background/75 lg:text-brand-muted">
              {BRAND.tagline}
            </p>
          </div>
          <p className="mt-5 text-center text-sm text-brand-background/75 lg:text-brand-muted">
            Ingresa con tus credenciales para acceder a tu panel de gestión.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-semibold text-brand-background lg:text-brand-text" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/20 bg-white/95 px-4 py-3 text-sm text-brand-text outline-none transition placeholder:text-brand-muted/70 focus:border-brand-accent focus:bg-white focus:ring-4 focus:ring-brand-accent/20 lg:border-brand-border lg:bg-brand-surfaceSoft lg:focus:border-brand-primary lg:focus:ring-brand-primary/10"
                placeholder="usuario"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-brand-background lg:text-brand-text" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/20 bg-white/95 px-4 py-3 text-sm text-brand-text outline-none transition placeholder:text-brand-muted/70 focus:border-brand-accent focus:bg-white focus:ring-4 focus:ring-brand-accent/20 lg:border-brand-border lg:bg-brand-surfaceSoft lg:focus:border-brand-primary lg:focus:ring-brand-primary/10"
                placeholder="password"
              />
            </div>

            {error ? (
              <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-brand-danger">
                {error}
              </p>
            ) : null}

            <Button
              className="w-full !bg-brand-accent py-3 text-brand-primary hover:!bg-brand-accentDark"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? 'Ingresando...' : 'Ingresar'}
            </Button>
          </form>
        </Card>
      </div>
    </main>
  );
}
