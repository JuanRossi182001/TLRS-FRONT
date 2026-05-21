import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { BrandLogo, StatusBadge } from '../components';

export function AppHeader() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <header className="sticky top-0 z-20 border-b border-brand-border/60 bg-white/70 backdrop-blur-xl">
      <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-10">
        <BrandLogo variant="mark" showText className="lg:hidden" imageClassName="h-9 w-9" />
        <div className="hidden items-center gap-3 lg:flex">
          <BrandLogo variant="mark" imageClassName="h-9 w-9" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">
              GPS / IoT
            </p>
            <h1 className="text-lg font-semibold text-brand-text">Panel Manea</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <StatusBadge label="Online" tone="success" />
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-brand-border/70 bg-brand-surface px-4 py-2.5 text-sm font-semibold text-brand-primary shadow-sm transition hover:bg-brand-surfaceSoft hover:shadow-md"
          >
            Salir
          </button>
        </div>
      </div>
    </header>
  );
}
