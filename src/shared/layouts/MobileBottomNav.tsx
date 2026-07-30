import { NavLink } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { useAppOverlay } from './AppOverlayContext';
import { getAppNavigation } from './navigation';

export function MobileBottomNav() {
  const { isAdmin } = useAuth();
  const { isFullScreenDialogOpen } = useAppOverlay();
  const visibleNavItems = getAppNavigation(isAdmin);

  if (isFullScreenDialogOpen) {
    return null;
  }

  return (
    <nav aria-label="Navegacion principal" className="fixed inset-x-0 bottom-0 z-40 px-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] lg:hidden">
      <div
        className={[
          'grid h-[var(--mobile-nav-height)] gap-0.5 rounded-2xl border border-brand-border/70 bg-brand-surface/95 p-1 shadow-lg shadow-brand-primary/10 backdrop-blur-xl',
          isAdmin ? 'grid-cols-6' : 'grid-cols-5',
        ].join(' ')}
      >
        {visibleNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              [
                'flex min-w-0 flex-col items-center justify-center gap-0.5 rounded-xl text-[10px] font-semibold leading-none transition',
                isActive
                  ? 'text-brand-primary'
                  : 'text-brand-muted hover:bg-brand-surfaceSoft hover:text-brand-primary',
              ].join(' ')
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={[
                    'h-5 w-5',
                    isActive
                      ? 'text-brand-primary'
                      : 'text-brand-muted',
                  ].join(' ')}
                  aria-hidden="true"
                />
                <span className="max-w-full truncate">{item.mobileLabel}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
