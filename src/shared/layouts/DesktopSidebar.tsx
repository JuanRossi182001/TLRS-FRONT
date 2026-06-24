import { NavLink } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { BrandLogo } from '../components';

const navItems = [
  { to: '/app/map', label: 'Mapa', marker: 'M' },
  { to: '/app/devices', label: 'Dispositivos', marker: 'D' },
  { to: '/app/rodeos', label: 'Rodeos', marker: 'R' },
  { to: '/app/geofences', label: 'Geocercas', marker: 'G' },
  { to: '/app/alerts', label: 'Alertas', marker: 'A' },
];

export function DesktopSidebar() {
  const { isAdmin } = useAuth();
  const visibleNavItems = isAdmin
    ? [...navItems, { to: '/app/admin/dashboard', label: 'Panel admin', marker: 'P' }]
    : navItems;

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-brand-border/70 bg-brand-surface/80 p-4 shadow-xl shadow-brand-primary/5 backdrop-blur-xl lg:flex lg:flex-col">
      <div className="rounded-3xl bg-brand-primary p-5 shadow-lg shadow-brand-primary/20">
        <BrandLogo variant="default" imageClassName="h-14 max-w-[200px]" />
        <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-brand-accent">
          Plataforma GPS / IoT
        </p>
        <h2 className="mt-1 text-lg font-semibold text-brand-background">
          Tracking inteligente
        </h2>
      </div>

      <nav className="mt-5 flex flex-1 flex-col gap-2">
        {visibleNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 rounded-full px-4 py-3 text-sm font-semibold transition',
                isActive
                  ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/20'
                  : 'text-brand-muted hover:bg-brand-surfaceSoft hover:text-brand-primary',
              ].join(' ')
            }
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-current/20 text-xs font-semibold">
              {item.marker}
            </span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="rounded-3xl bg-brand-primary p-4 text-sm text-brand-background shadow-lg shadow-brand-primary/15">
        <p className="font-semibold text-brand-accent">Manea</p>
        <p className="mt-1 leading-5 text-brand-background/80">
          Tracking inteligente para el campo.
        </p>
      </div>
    </aside>
  );
}
