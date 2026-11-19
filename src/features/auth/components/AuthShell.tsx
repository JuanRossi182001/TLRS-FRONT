import type { ReactNode } from 'react';
import { BrandLogo, Card } from '../../../shared/components';
import { BRAND } from '../../../shared/config/brand';

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <main
      className="flex min-h-screen items-center justify-center bg-brand-background bg-cover bg-center px-4 py-8"
      style={{
        backgroundImage:
          'linear-gradient(rgba(0, 69, 61, 0.58), rgba(0, 53, 47, 0.72)), url("/images/background-login.jpg")',
      }}
    >
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-brand-border/60 bg-brand-surface shadow-2xl shadow-brand-primary/10 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden bg-brand-primary p-10 text-brand-background lg:flex lg:flex-col lg:justify-between">
          <div>
            <BrandLogo imageClassName="h-16 max-w-[240px]" />
            <p className="mt-8 max-w-sm text-3xl font-semibold leading-tight">
              Visibilidad GPS clara para operar mejor en el campo.
            </p>
            <p className="mt-4 max-w-sm text-sm leading-6 text-brand-background/75">
              Dispositivos, assets y ubicaciones reunidos en una experiencia simple,
              moderna y preparada para crecer.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/10 p-4 text-sm text-brand-background/80">
            {BRAND.tagline}
          </div>
        </section>

        <Card className="w-full rounded-none border-0 !bg-brand-primary p-8 text-brand-background shadow-none sm:p-10 lg:!bg-brand-surface lg:text-brand-text">
          <BrandLogo className="justify-center lg:hidden" imageClassName="h-16 max-w-[220px]" />
          {children}
        </Card>
      </div>
    </main>
  );
}
