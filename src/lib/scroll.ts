import { useLayoutEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const positions = new Map<string, number>();

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
    window.scrollTo({ top: saved ?? 0, left: 0, behavior: 'instant' });

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => positions.set(key, window.scrollY));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
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
