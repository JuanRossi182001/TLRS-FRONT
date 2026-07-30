import type { ReactNode } from 'react';

export function StickyActionFooter({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={['sticky bottom-0 z-10 -mx-4 border-t border-brand-border/70 bg-brand-surface/95 px-4 py-3 backdrop-blur md:static md:mx-0 md:border-0 md:bg-transparent md:p-0', className].join(' ')}>
      {children}
    </div>
  );
}
