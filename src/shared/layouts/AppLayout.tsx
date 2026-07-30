import { Outlet, useLocation } from 'react-router-dom';
import { AppHeader } from './AppHeader';
import { AppOverlayProvider } from './AppOverlayContext';
import { DesktopSidebar } from './DesktopSidebar';
import { MobileBottomNav } from './MobileBottomNav';

export function AppLayout() {
  const { pathname } = useLocation();
  const isMapPage = pathname === '/app/map';

  return (
    <AppOverlayProvider>
      <div
        className="min-h-dvh text-brand-text"
        style={{
          background:
            'radial-gradient(circle at top left, rgba(255, 160, 44, 0.12), transparent 28%), linear-gradient(135deg, #f8faf4 0%, #eef5ef 46%, #f9f6ec 100%)',
        }}
      >
        <DesktopSidebar />

        <div className="flex min-h-dvh flex-col lg:pl-72">
          <AppHeader />

          <main
            className={[
              'flex min-h-0 flex-1 flex-col',
              isMapPage
                ? 'p-0 lg:px-10 lg:pb-10 lg:pt-8'
                : 'px-4 pb-[var(--mobile-nav-clearance)] pt-4 sm:px-6 lg:px-10 lg:pb-10 lg:pt-8',
            ].join(' ')}
          >
            <Outlet />
          </main>
        </div>

        <MobileBottomNav />
      </div>
    </AppOverlayProvider>
  );
}
