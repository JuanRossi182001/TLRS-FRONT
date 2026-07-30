import { X } from 'lucide-react';
import { useEffect, useId, useRef } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useAppOverlay } from '../layouts/AppOverlayContext';

type ResponsiveDialogProps = {
  isOpen: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
};

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export function ResponsiveDialog({
  isOpen,
  title,
  subtitle,
  onClose,
  children,
  footer,
}: ResponsiveDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const { setIsFullScreenDialogOpen } = useAppOverlay();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    previouslyFocusedElementRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    setIsFullScreenDialogOpen(true);

    const focusInitialElement = window.setTimeout(() => {
      const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(focusableSelector);
      focusableElements?.[0]?.focus();
    }, 0);

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      const focusableElements = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? [],
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (!firstElement || !lastElement) {
        event.preventDefault();
        return;
      }

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.clearTimeout(focusInitialElement);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      setIsFullScreenDialogOpen(false);
      previouslyFocusedElementRef.current?.focus();
    };
  }, [isOpen, onClose, setIsFullScreenDialogOpen]);

  if (!isOpen || typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[60] bg-slate-950/45 md:flex md:items-center md:justify-center md:p-6" onMouseDown={onClose}>
      <div
        aria-labelledby={titleId}
        aria-modal="true"
        className="flex h-[100dvh] w-full flex-col overflow-hidden bg-brand-surface shadow-2xl shadow-brand-primary/20 md:h-auto md:max-h-[94dvh] md:max-w-6xl md:rounded-[2rem] md:border md:border-brand-border/70"
        onMouseDown={(event) => event.stopPropagation()}
        ref={dialogRef}
        role="dialog"
      >
        <header className="flex shrink-0 items-start justify-between gap-3 border-b border-brand-border/70 bg-brand-surface px-4 py-3 md:px-5 md:py-3.5">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-brand-text md:text-[1.05rem]" id={titleId}>
              {title}
            </h2>
            {subtitle ? <p className="mt-0.5 truncate text-xs text-brand-muted md:text-[13px]">{subtitle}</p> : null}
          </div>
          <button
            aria-label={`Cerrar ${title.toLowerCase()}`}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-brand-border/70 text-brand-muted transition hover:bg-brand-surfaceSoft hover:text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
            onClick={onClose}
            type="button"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto p-3 md:p-5">{children}</div>
        {footer ? <footer className="shrink-0 border-t border-brand-border/70 bg-brand-surface px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 md:px-5 md:py-3">{footer}</footer> : null}
      </div>
    </div>,
    document.body,
  );
}
