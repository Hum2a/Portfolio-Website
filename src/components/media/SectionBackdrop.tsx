import React, { useEffect, useRef } from 'react';
import imageManifest from '../../data/imageManifest.json';
import { encodePublicPath } from './Img';
import './SectionBackdrop.css';
import { useReducedMotion } from '@/lib/motion';

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

const usePrefersReducedMotion = useReducedMotion;

/** Time constant (ms) for parallax easing — frame-rate independent. */
const PARALLAX_TAU_MS = 90;

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

    const parent = el.parentElement;
    if (!parent) return;

    // Cached rect (refreshed on enter / resize / scroll) and one rAF that eases toward the target.
    let rect: DOMRect | null = null;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let raf = 0;
    let last: number | null = null;

    const frame = (now: number) => {
      const dt = last == null ? 16 : Math.min(64, now - last);
      last = now;
      const k = 1 - Math.exp(-dt / PARALLAX_TAU_MS);
      current.x += (target.x - current.x) * k;
      current.y += (target.y - current.y) * k;
      el.style.transform = `translate3d(${current.x.toFixed(2)}px, ${current.y.toFixed(2)}px, 0)`;
      if (Math.abs(target.x - current.x) > 0.05 || Math.abs(target.y - current.y) > 0.05) {
        raf = requestAnimationFrame(frame);
      } else {
        raf = 0;
        last = null;
      }
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const onEnter = () => {
      rect = parent.getBoundingClientRect();
    };
    const invalidate = () => {
      rect = null;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      rect ??= parent.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      target.x = px * 12;
      target.y = py * 8;
      queue();
    };

    const onLeave = () => {
      target.x = 0;
      target.y = 0;
      queue();
    };

    parent.addEventListener('pointerenter', onEnter);
    parent.addEventListener('pointermove', onMove);
    parent.addEventListener('pointerleave', onLeave);
    window.addEventListener('resize', invalidate, { passive: true });
    window.addEventListener('scroll', invalidate, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      parent.removeEventListener('pointerenter', onEnter);
      parent.removeEventListener('pointermove', onMove);
      parent.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('resize', invalidate);
      window.removeEventListener('scroll', invalidate);
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
