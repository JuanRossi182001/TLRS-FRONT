import { Outlet } from 'react-router-dom';
import { AppHeader } from './AppHeader';
import { DesktopSidebar } from './DesktopSidebar';
import { MobileBottomNav } from './MobileBottomNav';

export function AppLayout() {
  return (
    <div className="min-h-dvh bg-slate-50 text-slate-950">
      <DesktopSidebar />

      <div className="flex min-h-dvh flex-col lg:pl-64">
        <AppHeader />

        <main className="flex min-h-0 flex-1 flex-col px-4 pb-24 pt-4 sm:px-6 lg:px-8 lg:pb-8">
          <Outlet />
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
}
