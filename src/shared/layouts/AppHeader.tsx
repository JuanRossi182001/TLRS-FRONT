import { StatusBadge } from '../components';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            GPS / IoT
          </p>
          <h1 className="text-lg font-semibold text-slate-950">TLRS</h1>
        </div>

        <StatusBadge label="Online" tone="success" />
      </div>
    </header>
  );
}
