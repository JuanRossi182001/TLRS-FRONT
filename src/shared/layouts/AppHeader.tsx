import { useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Menu, Shield } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { BrandLogo, StatusBadge } from '../components';

export function AppHeader() {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMapPage = pathname === '/app/map';

  async function handleLogout() {
    await logout();
    setIsMenuOpen(false);
    navigate('/login', { replace: true });
  }

  return (
    <header
      className={[
        'top-0 z-20 border-b border-brand-border/60 bg-white/70 backdrop-blur-xl',
        isMapPage ? 'fixed inset-x-0 lg:sticky' : 'sticky',
      ].join(' ')}
    >
      <div className="flex h-[var(--app-header-height)] items-center justify-between px-4 sm:px-6 lg:px-10">
        <div className="flex items-center gap-2 lg:hidden">
          <BrandLogo variant="mark" imageClassName="h-8 w-8" />
          <span className="text-base font-semibold text-brand-text">Manea</span>
        </div>
        <div className="hidden items-center gap-3 lg:flex">
          <BrandLogo variant="mark" imageClassName="h-9 w-9" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-muted">
              GPS / IoT
            </p>
            <h1 className="text-lg font-semibold text-brand-text">Panel Manea</h1>
          </div>
        </div>

        <div className="flex items-center gap-2 lg:gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-brand-success lg:hidden">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-success" aria-hidden="true" />
            Online
          </span>
          <div className="relative lg:hidden">
            <button
              aria-expanded={isMenuOpen}
              aria-haspopup="menu"
              aria-label="Abrir menu de cuenta"
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-brand-border/70 bg-brand-surface text-brand-primary transition hover:bg-brand-surfaceSoft"
              onClick={() => setIsMenuOpen((current) => !current)}
              type="button"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
            {isMenuOpen ? (
              <div className="absolute right-0 top-12 z-50 w-44 rounded-2xl border border-brand-border/70 bg-brand-surface p-1.5 shadow-lg shadow-brand-primary/15" role="menu">
                {isAdmin ? (
                  <span className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-brand-accentDark" role="menuitem">
                    <Shield className="h-4 w-4" aria-hidden="true" />
                    Admin
                  </span>
                ) : null}
                <button
                  className="flex min-h-10 w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold text-brand-primary transition hover:bg-brand-surfaceSoft"
                  onClick={handleLogout}
                  role="menuitem"
                  type="button"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  Salir
                </button>
              </div>
            ) : null}
          </div>
          <div className="hidden items-center gap-3 lg:flex">
            {isAdmin ? <StatusBadge label="Admin" tone="warning" /> : null}
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
      </div>
    </header>
  );
}
