import { useEffect, useState } from 'react';

/** Mirrors `--ease-out-expo` in globals.css. */
export const EASE_OUT_EXPO = 'cubic-bezier(0.16, 1, 0.3, 1)';

const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';
const FORCE_ATTR = 'data-force-reduced-motion';

/** Media query or `[data-force-reduced-motion='true']` on <html>. */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  const forced = document.documentElement.getAttribute(FORCE_ATTR) === 'true';
  return forced || window.matchMedia(REDUCED_QUERY).matches;
}

/** Reactive version of `prefersReducedMotion`, tracking both sources. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(REDUCED_QUERY);
    const update = () => setReduced(prefersReducedMotion());
    update();
    mq.addEventListener('change', update);
    const mo = new MutationObserver(update);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: [FORCE_ATTR] });
    return () => {
      mq.removeEventListener('change', update);
      mo.disconnect();
    };
  }, []);
  return reduced;
}

/** Resolves once every animation on `el` (and optionally its subtree) settles, or after `timeoutMs`. */
export function waitForAnimations(el: Element, subtree = true, timeoutMs = 2000): Promise<void> {
  const anims = typeof el.getAnimations === 'function' ? el.getAnimations({ subtree }) : [];
  if (anims.length === 0) return Promise.resolve();
  const settled = Promise.allSettled(anims.map((a) => a.finished)).then(() => undefined);
  const timeout = new Promise<void>((resolve) => window.setTimeout(resolve, timeoutMs));
  return Promise.race([settled, timeout]);
}

/** Double rAF: resolves after the next frame has painted. */
export function nextPaint(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
}
