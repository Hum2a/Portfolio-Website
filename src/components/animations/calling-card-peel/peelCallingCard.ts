import { LIFT_MS, PEEL_MS, PHASES, RELEASE_MS, TENSION_MS } from './constants';
import { prefersReducedMotion } from '@/lib/motion';

/** Roots currently peeling — per instance, so two tiles never block each other. */
const busyRoots = new WeakSet<HTMLElement>();

/** Extra slack before a phase's fallback fires if `transitionend` never arrives. */
const FALLBACK_SLACK_MS = 120;

export { prefersReducedMotion };

export function isPeelBusy(root?: HTMLElement | null): boolean {
  return !!root && busyRoots.has(root);
}

function clearPhases(root: HTMLElement) {
  root.classList.remove(...PHASES);
}

function setStatus(root: HTMLElement, text: string) {
  const status = root.querySelector('[data-calling-card-peel-status]');
  if (status) status.textContent = text;
}

/** Resolves on `transitionend` for `property` on `el`, or after the fallback. */
function waitTransition(el: Element | null, property: string, ms: number): Promise<void> {
  return new Promise((resolve) => {
    if (!el) {
      window.setTimeout(resolve, ms);
      return;
    }
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      el.removeEventListener('transitionend', onEnd);
      window.clearTimeout(timer);
      resolve();
    };
    const onEnd = (event: Event) => {
      const e = event as TransitionEvent;
      if (e.target === el && e.propertyName === property) finish();
    };
    el.addEventListener('transitionend', onEnd);
    const timer = window.setTimeout(finish, ms + FALLBACK_SLACK_MS);
  });
}

type PeelCallbacks = {
  /** Fires as the sheet starts its final release — the moment to start navigating. */
  onRelease?: () => void;
};

/**
 * Peel the attached notice away. Content stays in the DOM underneath.
 * Phases chain on real transition completion rather than fixed timers.
 */
export async function peelCallingCard(
  root: HTMLElement,
  onRevealed?: () => void,
  { onRelease }: PeelCallbacks = {}
): Promise<void> {
  if (!root || busyRoots.has(root)) return;

  busyRoots.add(root);
  clearPhases(root);
  root.classList.add('ccp--busy');
  void root.offsetWidth;

  const safe = (fn?: () => void) => {
    try {
      fn?.();
    } catch {
      /* keep portable */
    }
  };

  if (prefersReducedMotion()) {
    root.classList.add('ccp--reduced', 'ccp--revealed');
    busyRoots.delete(root);
    setStatus(root, 'Material revealed. Restricted notice removed.');
    safe(onRelease);
    safe(onRevealed);
    return;
  }

  const paper = root.querySelector('.ccp__paper');
  const surface = root.querySelector('.ccp__surface');

  root.classList.add('ccp--lift');
  await waitTransition(surface, 'clip-path', LIFT_MS);

  root.classList.add('ccp--tension');
  await waitTransition(paper, 'transform', TENSION_MS);

  root.classList.add('ccp--peel');
  await waitTransition(paper, 'transform', PEEL_MS);

  root.classList.add('ccp--release');
  safe(onRelease);
  await waitTransition(paper, 'transform', RELEASE_MS);

  root.classList.remove('ccp--lift', 'ccp--tension', 'ccp--peel', 'ccp--release', 'ccp--busy');
  root.classList.add('ccp--revealed');
  setStatus(root, 'Material revealed. Restricted notice removed.');
  busyRoots.delete(root);
  safe(onRevealed);
}
