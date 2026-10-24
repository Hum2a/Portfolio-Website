import { motionDebug, nextPaint, prefersReducedMotion, waitForAnimations } from '@/lib/motion';
/**
 * Comic Panel Wipe — tiny portable API.
 * Works inside sandbox="allow-scripts" (no parent / storage / network).
 *
 * Phases are driven by real animation completion, not timers:
 * attack → (all panels landed) covered → await onCovered → paint → exit → done.
 */

/** Safety nets in case animation events never fire (throttled tab, display:none). */
const ATTACK_FALLBACK_MS = 900;
const EXIT_FALLBACK_MS = 1000;
const RM_FLASH_MS = 40;
/** Max time to hold the cover while the new page finishes mounting (effects, images). */
const SETTLE_MAX_MS = 200;

let busy = false;

/** Resolves when the main thread is idle, or after `timeoutMs`. */
function idle(timeoutMs: number): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(() => resolve(), { timeout: timeoutMs });
    } else {
      window.setTimeout(resolve, Math.min(50, timeoutMs));
    }
  });
}

type CoveredCallback = () => void | Promise<void>;

async function callCovered(onCovered?: CoveredCallback): Promise<void> {
  try {
    await onCovered?.();
  } catch {
    /* keep transition resilient */
  }
}

async function runReduced(root: Element, onCovered?: CoveredCallback): Promise<void> {
  root.classList.add('comic-wipe--active', 'comic-wipe--rm-flash');
  await new Promise((r) => window.setTimeout(r, RM_FLASH_MS));
  await callCovered(onCovered);
  root.classList.remove(
    'comic-wipe--active',
    'comic-wipe--covered',
    'comic-wipe--rm-flash',
    'comic-wipe--exit'
  );
}

/**
 * @param onCovered — awaited while the viewport is fully obscured (swap route, scroll, etc.)
 * @param signal — aborting skips straight to cleanup
 * @returns whether the wipe actually started (false when busy or overlay missing)
 */
export async function runComicWipe(
  onCovered?: CoveredCallback,
  signal?: AbortSignal
): Promise<boolean> {
  if (busy) return false;

  const root = document.querySelector<HTMLElement>('[data-comic-wipe]');
  if (!root) return false;

  busy = true;
  try {
    if (prefersReducedMotion()) {
      await runReduced(root, onCovered);
      return true;
    }

    root.classList.remove('comic-wipe--exit', 'comic-wipe--covered', 'comic-wipe--rm-flash');
    root.classList.add('comic-wipe--active');

    // Let the attack animations get created before collecting them.
    await new Promise((r) => requestAnimationFrame(r));
    await waitForAnimations(root, true, ATTACK_FALLBACK_MS);
    if (signal?.aborted) return true;

    // Pin panels before exit class drops the enter animations (prevents off-screen snap).
    root.classList.add('comic-wipe--covered');
    motionDebug('wipe:covered');
    await callCovered(onCovered);
    if (signal?.aborted) return true;
    await nextPaint();
    // Let the incoming page's post-commit work run while still covered, so it can't stall the tear-away.
    await idle(SETTLE_MAX_MS);

    void root.offsetHeight;
    root.classList.add('comic-wipe--exit');
    motionDebug('wipe:exit');
    await new Promise((r) => requestAnimationFrame(r));
    await waitForAnimations(root, true, EXIT_FALLBACK_MS);
    return true;
  } finally {
    root.classList.remove(
      'comic-wipe--active',
      'comic-wipe--covered',
      'comic-wipe--exit',
      'comic-wipe--rm-flash'
    );
    busy = false;
  }
}

export function isComicWipeBusy(): boolean {
  return busy;
}
