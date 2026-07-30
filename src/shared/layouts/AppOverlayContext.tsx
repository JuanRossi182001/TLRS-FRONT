import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type AppOverlayContextValue = {
  isFullScreenDialogOpen: boolean;
  setIsFullScreenDialogOpen: (isOpen: boolean) => void;
};

const AppOverlayContext = createContext<AppOverlayContextValue | null>(null);

export function AppOverlayProvider({ children }: { children: ReactNode }) {
  const [isFullScreenDialogOpen, setIsFullScreenDialogOpen] = useState(false);

  return (
    <AppOverlayContext.Provider value={{ isFullScreenDialogOpen, setIsFullScreenDialogOpen }}>
      {children}
    </AppOverlayContext.Provider>
  );
}

export function useAppOverlay() {
  const context = useContext(AppOverlayContext);

  if (!context) {
    throw new Error('useAppOverlay must be used within AppOverlayProvider.');
  }

  return context;
}
