import React, { useEffect, useRef, useState } from 'react';
import imageManifest from '../../data/imageManifest.json';
import { encodePublicPath } from './Img';
import './SectionBackdrop.css';

type ManifestMap = Record<
  string,
  { blur?: string; src: string; webp?: string }
>;

const manifest = imageManifest as ManifestMap;

export type SectionBackdropPlacement = 'left' | 'right' | 'center';

export type SectionBackdropProps = {
  src: string;
  placement?: SectionBackdropPlacement;
  /** Opacity 0.10–0.18; values outside are clamped */
  intensity?: number;
  tint?: 'accent';
  className?: string;
};

const INTENSITY_MIN = 0.1;
const INTENSITY_MAX = 0.18;

function normalizeSrc(src: string): string {
  if (!src) return src;
  try {
    const decoded = decodeURIComponent(src);
    return decoded.startsWith('/') ? decoded : `/${decoded}`;
  } catch {
    return src.startsWith('/') ? src : `/${src}`;
  }
}

/** Prefer build-time blur placeholder; fall back to source path */
export function getBackdropImageUrl(src: string): string {
  const key = normalizeSrc(src);
  const entry = manifest[key];
  if (entry?.blur) return encodePublicPath(entry.blur);
  if (entry?.webp) return encodePublicPath(entry.webp);
  return encodePublicPath(key);
}

function clampIntensity(value: number): number {
  if (Number.isNaN(value)) return 0.14;
  if (value < INTENSITY_MIN || value > INTENSITY_MAX) {
    if (import.meta.env.DEV) {
      console.warn(
        `[SectionBackdrop] intensity ${value} outside ${INTENSITY_MIN}–${INTENSITY_MAX}; clamping.`
      );
    }
    return Math.min(INTENSITY_MAX, Math.max(INTENSITY_MIN, value));
  }
  return value;
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

/**
 * Soft blended section backdrop. Always dual-masked (radial + linear),
 * opacity-clamped, duotone-tinted. Uses build-time blur assets — no backdrop-filter.
 */
const SectionBackdrop: React.FC<SectionBackdropProps> = ({
  src,
  placement = 'right',
  intensity = 0.14,
  tint = 'accent',
  className = '',
}) => {
  const reducedMotion = usePrefersReducedMotion();
  const layerRef = useRef<HTMLDivElement>(null);
  const opacity = clampIntensity(intensity);
  const imageUrl = getBackdropImageUrl(src);

  useEffect(() => {
    if (reducedMotion) return;
    const el = layerRef.current;
    if (!el) return;

    const onMove = (e: PointerEvent) => {
      const rect = el.parentElement?.getBoundingClientRect();
      if (!rect) return;
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `translate3d(${px * 12}px, ${py * 8}px, 0)`;
    };

    const onLeave = () => {
      el.style.transform = 'translate3d(0, 0, 0)';
    };

    const parent = el.parentElement;
    parent?.addEventListener('pointermove', onMove);
    parent?.addEventListener('pointerleave', onLeave);
    return () => {
      parent?.removeEventListener('pointermove', onMove);
      parent?.removeEventListener('pointerleave', onLeave);
    };
  }, [reducedMotion]);

  return (
    <div
      className={[
        'section-backdrop',
        `section-backdrop--${placement}`,
        tint === 'accent' ? 'section-backdrop--tint' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-hidden="true"
      style={{ opacity }}
    >
      <div
        ref={layerRef}
        className="section-backdrop-layer"
        style={{ backgroundImage: `url("${imageUrl}")` }}
      />
    </div>
  );
};

export default SectionBackdrop;
