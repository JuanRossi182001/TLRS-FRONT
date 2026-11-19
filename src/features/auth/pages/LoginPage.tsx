import { FormEvent, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../../shared/components';
import { BRAND } from '../../../shared/config/brand';
import { AuthShell } from '../components/AuthShell';
import { useAuth } from '../hooks/useAuth';

export function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = (
    location.state as
      | { from?: { pathname?: string; search?: string; hash?: string } }
      | null
  )?.from;
  const returnTo = from?.pathname?.startsWith('/') && !from.pathname.startsWith('//')
    ? `${from.pathname}${from.search ?? ''}${from.hash ?? ''}`
    : null;

  if (isAuthenticated) {
    return <Navigate to={returnTo ?? '/app/map'} replace />;
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
      navigate(returnTo ?? '/app/map', { replace: true });
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
    <AuthShell>
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

            <div className="mt-4 flex flex-col items-center justify-center gap-2 sm:flex-row sm:justify-between sm:gap-4">
              <Link
                className="inline-flex min-h-10 items-center justify-center text-sm font-semibold text-brand-background underline underline-offset-4 hover:text-brand-accent lg:text-brand-primary"
                to="/forgot-password"
              >
                ¿Olvidaste tu contraseña?
              </Link>
              <Link
                className="inline-flex min-h-10 items-center justify-center text-center text-sm text-brand-background/80 underline underline-offset-4 hover:text-brand-accent lg:text-brand-muted"
                to="/activate-account"
              >
                Activar cuenta o reenviar invitación
              </Link>
            </div>
      </form>
    </AuthShell>
  );
}
