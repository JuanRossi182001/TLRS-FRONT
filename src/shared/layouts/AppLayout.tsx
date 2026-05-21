import { Outlet } from 'react-router-dom';
import { AppHeader } from './AppHeader';
import { DesktopSidebar } from './DesktopSidebar';
import { MobileBottomNav } from './MobileBottomNav';

export function AppLayout() {
  return (
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

        <main className="flex min-h-0 flex-1 flex-col px-4 pb-28 pt-5 sm:px-6 lg:px-10 lg:pb-10 lg:pt-8">
          <Outlet />
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
}
