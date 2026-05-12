import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/app/map', label: 'Mapa', marker: 'M' },
  { to: '/app/devices', label: 'Dispositivos', marker: 'D' },
  { to: '/app/alerts', label: 'Alertas', marker: 'A' },
];

export function MobileBottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white px-2 pb-[env(safe-area-inset-bottom)] shadow-lg lg:hidden">
      <div className="grid h-16 grid-cols-3 gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              [
                'flex flex-col items-center justify-center gap-1 rounded-md text-xs font-medium transition',
                isActive
                  ? 'text-slate-950'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800',
              ].join(' ')
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={[
                    'flex h-7 w-7 items-center justify-center rounded-md text-xs font-semibold',
                    isActive ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-600',
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
