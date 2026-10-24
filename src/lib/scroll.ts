import { useLayoutEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const positions = new Map<string, number>();

/** How long a back/forward restore keeps re-applying while the page is still growing. */
const RESTORE_WINDOW_MS = 1500;

/**
 * Scroll reset for every navigation (wiped or not): PUSH/REPLACE go to the top,
 * POP (back/forward) restores the position saved for that history entry.
 */
export function useScrollManager(): void {
  const location = useLocation();
  const navType = useNavigationType();

  useLayoutEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  }, []);

  useLayoutEffect(() => {
    const key = location.key;
    const saved = navType === 'POP' ? positions.get(key) : undefined;
    const top = saved ?? 0;
    window.scrollTo({ top, left: 0, behavior: 'instant' });

    // The restored page may still be growing (lazy sections, images), which clamps the
    // first scrollTo and lets scroll anchoring drift. Re-apply while it grows, until the
    // user takes over or RESTORE_WINDOW_MS passes.
    let stopRestore = () => {};
    if (top > 0) {
      const until = performance.now() + RESTORE_WINDOW_MS;
      const reapply = () => {
        if (performance.now() > until) return stopRestore();
        if (Math.abs(window.scrollY - top) > 1) {
          window.scrollTo({ top, left: 0, behavior: 'instant' });
        }
      };
      const ro = new ResizeObserver(reapply);
      ro.observe(document.body);
      const timer = window.setTimeout(() => stopRestore(), RESTORE_WINDOW_MS);
      const userEvents = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const;
      stopRestore = () => {
        ro.disconnect();
        window.clearTimeout(timer);
        userEvents.forEach((t) => window.removeEventListener(t, stopRestore));
      };
      userEvents.forEach((t) => window.addEventListener(t, stopRestore, { passive: true }));
    }

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => positions.set(key, window.scrollY));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      stopRestore();
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, [location.key, navType]);
}

/** Moves focus to the new page's h1 (or #main-content) without scrolling. */
export function focusMainContent(): void {
  const main = document.getElementById('main-content');
  const target = main?.querySelector<HTMLElement>('h1') ?? main;
  if (!target) return;
  if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
}

export function ScrollManager(): null {
  useScrollManager();
  return null;
}

/** Short opacity fade on #main-content for navigations that skip the wipe. */
export function playPageEnter(): void {
  const main = document.getElementById('main-content');
  if (!main) return;
  main.removeAttribute('data-enter');
  void main.offsetWidth;
  main.setAttribute('data-enter', '');
  const clear = () => {
    main.removeAttribute('data-enter');
    main.removeEventListener('animationend', onEnd);
  };
  const onEnd = (e: AnimationEvent) => {
    if (e.target === main) clear();
  };
  main.addEventListener('animationend', onEnd);
  window.setTimeout(clear, 400);
}
