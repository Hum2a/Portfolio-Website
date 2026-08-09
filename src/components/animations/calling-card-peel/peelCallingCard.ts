import { LIFT_MS, PEEL_MS, PHASES, RELEASE_MS, TENSION_MS, TOTAL_MS } from './constants';

type TimerId = ReturnType<typeof setTimeout>;

let busy = false;

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  const forced =
    document.documentElement.getAttribute('data-force-reduced-motion') === 'true';
  return forced || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function isPeelBusy(): boolean {
  return busy;
}

function clearTimers(timers: TimerId[]) {
  for (const id of timers) window.clearTimeout(id);
  timers.length = 0;
}

function clearPhases(root: HTMLElement) {
  root.classList.remove(...PHASES);
}

function setStatus(root: HTMLElement, text: string) {
  const status = root.querySelector('[data-calling-card-peel-status]');
  if (status) status.textContent = text;
}

function later(timers: TimerId[], ms: number, fn: () => void) {
  const id = window.setTimeout(fn, ms);
  timers.push(id);
  return id;
}

/**
 * Peel the attached notice away. Content stays in the DOM underneath.
 */
export function peelCallingCard(
  root: HTMLElement,
  onRevealed?: () => void
): Promise<void> {
  if (!root || busy) return Promise.resolve();

  busy = true;
  const timers: TimerId[] = [];
  clearPhases(root);
  root.classList.add('ccp--busy');
  void root.offsetWidth;

  const finish = (statusText: string) => {
    clearTimers(timers);
    busy = false;
    setStatus(root, statusText);
    try {
      onRevealed?.();
    } catch {
      /* keep portable */
    }
  };

  if (prefersReducedMotion()) {
    root.classList.add('ccp--reduced', 'ccp--revealed');
    finish('Material revealed. Restricted notice removed.');
    return Promise.resolve();
  }

  root.classList.add('ccp--lift');

  return new Promise((resolve) => {
    later(timers, LIFT_MS, () => {
      root.classList.add('ccp--tension');
    });

    later(timers, LIFT_MS + TENSION_MS, () => {
      root.classList.add('ccp--peel');
    });

    later(timers, LIFT_MS + TENSION_MS + PEEL_MS, () => {
      root.classList.add('ccp--release');
    });

    later(timers, TOTAL_MS, () => {
      root.classList.remove(
        'ccp--lift',
        'ccp--tension',
        'ccp--peel',
        'ccp--release',
        'ccp--busy'
      );
      root.classList.add('ccp--revealed');
      setStatus(root, 'Material revealed. Restricted notice removed.');
      try {
        onRevealed?.();
      } catch {
        /* ignore */
      }
      clearTimers(timers);
      busy = false;
      resolve();
    });
  });
}
