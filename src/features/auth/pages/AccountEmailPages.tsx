import { useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../../shared/components';
import { AuthShell } from '../components/AuthShell';
import {
  confirmEmailVerification,
  confirmPasswordReset,
  activateAccount,
  requestAccountActivation,
  requestEmailVerification,
  requestPasswordReset,
} from '../api/auth.api';

const inputClassName =
  'mt-2 w-full rounded-2xl border border-white/20 bg-white/95 px-4 py-3 text-sm text-brand-text outline-none transition focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/20 lg:border-brand-border lg:bg-brand-surfaceSoft lg:focus:border-brand-primary lg:focus:ring-brand-primary/10';

function AuthPageShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <AuthShell>
      <div className="mt-6 text-center lg:mt-0">
        <h1 className="text-3xl font-semibold tracking-tight text-brand-background lg:text-brand-text">
          {title}
        </h1>
      </div>
      <div className="mt-5 text-sm leading-6 text-brand-background/75 lg:text-brand-muted">
        {children}
      </div>
        <Link
          className="mt-6 block text-center text-sm font-semibold text-brand-background underline underline-offset-4 hover:text-brand-accent lg:text-brand-primary"
          to="/login"
        >
          Volver al inicio de sesión
        </Link>
    </AuthShell>
  );
}

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setIsSubmitting(true);
    try {
      const response = await requestPasswordReset(email.trim());
      setMessage(response.message);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'No pudimos procesar la solicitud. Inténtalo nuevamente.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthPageShell title="Recuperar contraseña">
      <p className="mt-5 text-sm leading-6 text-brand-muted">
        Ingresa el correo asociado a tu cuenta. Si existe, recibirás un enlace para
        cambiar tu contraseña.
      </p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <label className="block text-sm font-semibold text-brand-text" htmlFor="email">
          Correo electrónico
          <input
            className={inputClassName}
            id="email"
            type="email"
            autoComplete="email"
            required
            maxLength={320}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        {message ? <p className="text-sm text-brand-primary">{message}</p> : null}
        {error ? <p className="text-sm text-brand-danger">{error}</p> : null}
        <Button className="w-full" disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Enviando…' : 'Enviar enlace'}
        </Button>
      </form>
    </AuthPageShell>
  );
}

export function ResetPasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = new URLSearchParams(location.hash.slice(1)).get('token') ?? '';
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (!token) {
      setError('El enlace no es válido. Solicita uno nuevo.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await confirmPasswordReset(token, newPassword);
      setMessage(response.message);
      window.history.replaceState({}, document.title, window.location.pathname);
      setTimeout(() => navigate('/login', { replace: true }), 1800);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'El enlace no es válido o venció. Solicita uno nuevo.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthPageShell title="Establecer contraseña nueva">
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <label className="block text-sm font-semibold text-brand-text" htmlFor="new-password">
          Nueva contraseña
          <input
            className={inputClassName}
            id="new-password"
            type="password"
            autoComplete="new-password"
            minLength={12}
            maxLength={72}
            required
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
          />
        </label>
        <label className="block text-sm font-semibold text-brand-text" htmlFor="confirm-password">
          Confirmar contraseña
          <input
            className={inputClassName}
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            minLength={12}
            maxLength={72}
            required
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
        </label>
        {message ? <p className="text-sm text-brand-primary">{message}</p> : null}
        {error ? <p className="text-sm text-brand-danger">{error}</p> : null}
        <Button className="w-full" disabled={isSubmitting || !token} type="submit">
          {isSubmitting ? 'Actualizando…' : 'Guardar contraseña'}
        </Button>
      </form>
    </AuthPageShell>
  );
}

export function VerifyEmailPage() {
  const location = useLocation();
  const token = new URLSearchParams(location.hash.slice(1)).get('token') ?? '';
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      if (token) {
        const response = await confirmEmailVerification(token);
        setMessage(response.message);
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        const response = await requestEmailVerification(email.trim());
        setMessage(response.message);
      }
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'No pudimos verificar el correo. Solicita un enlace nuevo.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthPageShell title="Verificar correo electrónico">
      <p className="mt-5 text-sm leading-6 text-brand-muted">
        {token
          ? 'Confirma que tienes acceso a esta dirección de correo.'
          : 'Solicita un enlace nuevo para verificar tu dirección.'}
      </p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        {!token ? (
          <label className="block text-sm font-semibold text-brand-text" htmlFor="verify-email">
            Correo electrónico
            <input
              className={inputClassName}
              id="verify-email"
              type="email"
              autoComplete="email"
              required
              maxLength={320}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
        ) : null}
        {message ? <p className="text-sm text-brand-primary">{message}</p> : null}
        {error ? <p className="text-sm text-brand-danger">{error}</p> : null}
        <Button className="w-full" disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Procesando…' : token ? 'Verificar correo' : 'Enviar enlace'}
        </Button>
      </form>
    </AuthPageShell>
  );
}

export function ActivateAccountPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = new URLSearchParams(location.hash.slice(1)).get('token') ?? '';
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setIsSubmitting(true);
    try {
      if (!token) {
        const response = await requestAccountActivation(email.trim());
        setMessage(response.message);
      } else {
        if (newPassword !== confirmPassword) {
          setError('Las contraseñas no coinciden.');
          return;
        }
        const response = await activateAccount(token, newPassword);
        setMessage(response.message);
        window.history.replaceState({}, document.title, window.location.pathname);
        setTimeout(() => navigate('/login', { replace: true }), 1800);
      }
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'No pudimos completar la activación. Solicita un enlace nuevo.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthPageShell title={token ? 'Activa tu cuenta' : 'Reenviar invitación'}>
      <p className="mt-5 text-sm leading-6 text-brand-muted">
        {token
          ? 'Elige una contraseña personal para activar tu cuenta.'
          : 'Ingresa el correo que recibió la invitación. Si la cuenta está pendiente, enviaremos un enlace nuevo.'}
      </p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        {!token ? (
          <label className="block text-sm font-semibold text-brand-text" htmlFor="activation-email">
            Correo electrónico
            <input
              className={inputClassName}
              id="activation-email"
              type="email"
              autoComplete="email"
              required
              maxLength={320}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
        ) : (
          <>
            <label className="block text-sm font-semibold text-brand-text" htmlFor="activation-password">
              Nueva contraseña
              <input
                className={inputClassName}
                id="activation-password"
                type="password"
                autoComplete="new-password"
                minLength={12}
                maxLength={72}
                required
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
              />
            </label>
            <label className="block text-sm font-semibold text-brand-text" htmlFor="activation-password-confirm">
              Confirmar contraseña
              <input
                className={inputClassName}
                id="activation-password-confirm"
                type="password"
                autoComplete="new-password"
                minLength={12}
                maxLength={72}
                required
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </label>
          </>
        )}
        {message ? <p className="text-sm text-brand-primary">{message}</p> : null}
        {error ? <p className="text-sm text-brand-danger">{error}</p> : null}
        <Button className="w-full" disabled={isSubmitting} type="submit">
          {isSubmitting
            ? token ? 'Activando…' : 'Enviando…'
            : token ? 'Activar cuenta' : 'Enviar invitación'}
        </Button>
      </form>
      {token ? (
        <Link
          className="mt-4 block text-center text-sm font-semibold text-brand-primary underline underline-offset-4"
          to="/activate-account"
        >
          ¿El enlace venció? Solicitar otro
        </Link>
      ) : null}
    </AuthPageShell>
  );
}
