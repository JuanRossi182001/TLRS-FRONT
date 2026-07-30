import type { HTMLAttributes, ReactNode } from 'react';

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  density?: 'default' | 'compact';
};

export function Card({ children, className = '', density = 'default', ...props }: CardProps) {
  return (
    <div
      className={[
        'rounded-2xl border border-brand-border/60 bg-brand-surface shadow-sm shadow-brand-primary/5 lg:rounded-3xl',
        density === 'compact' ? 'p-3 lg:p-4' : 'p-4 lg:p-6',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </div>
  );
}
