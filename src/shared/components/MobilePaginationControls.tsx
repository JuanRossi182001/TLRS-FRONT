import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

type MobilePaginationControlsProps = {
  canGoNext: boolean;
  canGoPrevious: boolean;
  isLoading?: boolean;
  onNext: () => void;
  onPrevious: () => void;
};

export function MobilePaginationControls({
  canGoNext,
  canGoPrevious,
  isLoading = false,
  onNext,
  onPrevious,
}: MobilePaginationControlsProps) {
  return (
    <div className="flex items-center justify-between gap-2 xl:hidden">
      <Button
        aria-label="Pagina anterior"
        className="gap-1.5 px-3 text-xs"
        disabled={!canGoPrevious || isLoading}
        onClick={onPrevious}
        type="button"
        variant="secondary"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        Anterior
      </Button>
      <Button
        aria-label="Pagina siguiente"
        className="gap-1.5 px-3 text-xs"
        disabled={!canGoNext || isLoading}
        onClick={onNext}
        type="button"
      >
        Siguiente
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </Button>
    </div>
  );
}
