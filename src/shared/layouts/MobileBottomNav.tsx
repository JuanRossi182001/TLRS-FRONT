import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/app/map', label: 'Mapa', marker: 'M' },
  { to: '/app/devices', label: 'Dispositivos', marker: 'D' },
  { to: '/app/alerts', label: 'Alertas', marker: 'A' },
];

export function MobileBottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] lg:hidden">
      <div className="grid h-16 grid-cols-3 gap-1 rounded-full border border-brand-border/70 bg-brand-surface/95 p-1 shadow-xl shadow-brand-primary/10 backdrop-blur-xl">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              [
                'flex flex-col items-center justify-center gap-1 rounded-full text-xs font-semibold transition',
                isActive
                  ? 'text-brand-primary'
                  : 'text-brand-muted hover:bg-brand-surfaceSoft hover:text-brand-primary',
              ].join(' ')
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={[
                    'flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold',
                    isActive
                      ? 'bg-brand-accent text-brand-primary'
                      : 'bg-brand-surfaceSoft text-brand-muted',
                  ].join(' ')}
                >
                  {item.marker}
                </span>
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
