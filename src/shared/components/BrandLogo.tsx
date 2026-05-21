import { useState } from 'react';
import { BRAND } from '../config/brand';

type BrandLogoProps = {
  variant?: 'default' | 'mark';
  showText?: boolean;
  className?: string;
  imageClassName?: string;
};

function getLogoSources(variant: 'default' | 'mark') {
  if (variant === 'mark') {
    return [BRAND.logoMark, BRAND.fallbackLogoMark, BRAND.logo, BRAND.fallbackLogo];
  }

  return [BRAND.logo, BRAND.fallbackLogo, BRAND.logoJpeg, BRAND.fallbackLogoJpeg];
}

export function BrandLogo({
  variant = 'default',
  showText = false,
  className = '',
  imageClassName = '',
}: BrandLogoProps) {
  const sources = getLogoSources(variant);
  const [sourceIndex, setSourceIndex] = useState(0);
  const [hasImageError, setHasImageError] = useState(false);
  const currentSource = sources[sourceIndex];

  function handleImageError() {
    const nextIndex = sourceIndex + 1;

    if (nextIndex < sources.length) {
      setSourceIndex(nextIndex);
      return;
    }

    setHasImageError(true);
  }

  return (
    <div className={['flex items-center gap-3', className].join(' ')}>
      {hasImageError ? (
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-primary text-sm font-bold text-brand-background">
          M
        </div>
      ) : (
        <img
          src={currentSource}
          alt={BRAND.name}
          onError={handleImageError}
          className={[
            variant === 'mark' ? 'h-10 w-10 object-contain' : 'h-11 w-auto object-contain',
            imageClassName,
          ].join(' ')}
        />
      )}

      {showText ? (
        <div className="min-w-0">
          <p className="text-base font-semibold leading-tight text-brand-text">{BRAND.name}</p>
          <p className="text-xs leading-tight text-brand-muted">{BRAND.tagline}</p>
        </div>
      ) : null}
    </div>
  );
}
