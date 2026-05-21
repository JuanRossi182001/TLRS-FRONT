import type { HTMLAttributes, ReactNode } from 'react';

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={[
        'rounded-3xl border border-brand-border/60 bg-brand-surface p-6 shadow-sm shadow-brand-primary/5',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </div>
  );
}
