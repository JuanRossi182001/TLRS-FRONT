import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/app/map', label: 'Mapa', marker: 'M' },
  { to: '/app/devices', label: 'Dispositivos', marker: 'D' },
  { to: '/app/alerts', label: 'Alertas', marker: 'A' },
];

export function DesktopSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-slate-200 bg-white lg:flex lg:flex-col">
      <div className="border-b border-slate-200 px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Plataforma
        </p>
        <h2 className="mt-1 text-xl font-semibold text-slate-950">Monitoreo GPS</h2>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition',
                isActive
                  ? 'bg-slate-950 text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
              ].join(' ')
            }
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-current/20 text-xs font-semibold">
              {item.marker}
            </span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
