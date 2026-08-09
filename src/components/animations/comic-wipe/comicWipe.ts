/**
 * Comic Panel Wipe — tiny portable API.
 * Works inside sandbox="allow-scripts" (no parent / storage / network).
 */

const COVERED_MS = 450;
/** Last attack stagger (180) + attack duration (380) — panel 5 fully in */
const EXIT_MS = 560;
const EXIT_DURATION_MS = 530;
const TOTAL_MS = EXIT_MS + EXIT_DURATION_MS;
const RM_FLASH_MS = 40;

let busy = false;

function prefersReducedMotion(): boolean {
  const forced =
    document.documentElement.getAttribute('data-force-reduced-motion') === 'true';
  const media = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return forced || media;
}

function runReduced(
  root: Element,
  onCovered?: () => void
): Promise<void> {
  return new Promise((resolve) => {
    root.classList.add('comic-wipe--active', 'comic-wipe--rm-flash');
    window.setTimeout(() => {
      try {
        onCovered?.();
      } catch {
        /* ignore */
      }
      root.classList.remove(
        'comic-wipe--active',
        'comic-wipe--covered',
        'comic-wipe--rm-flash',
        'comic-wipe--exit'
      );
      busy = false;
      resolve();
    }, RM_FLASH_MS);
  });
}

/**
 * @param onCovered — called once while the viewport is fully obscured
 * @returns whether the wipe actually started (false when busy or overlay missing)
 */
export function runComicWipe(onCovered?: () => void): Promise<boolean> {
  if (busy) return Promise.resolve(false);

  const root = document.querySelector('[data-comic-wipe]');
  if (!root) return Promise.resolve(false);

  busy = true;

  if (prefersReducedMotion()) {
    return runReduced(root, onCovered).then(() => true);
  }

  return new Promise((resolve) => {
    root.classList.remove(
      'comic-wipe--exit',
      'comic-wipe--covered',
      'comic-wipe--rm-flash'
    );
    root.classList.add('comic-wipe--active');

    let covered = false;
    const coverTimer = window.setTimeout(() => {
      covered = true;
      try {
        onCovered?.();
      } catch {
        /* keep transition resilient */
      }
    }, COVERED_MS);

    const exitTimer = window.setTimeout(() => {
      // Pin panels before exit class drops the enter animations (prevents off-screen snap).
      root.classList.add('comic-wipe--covered');
      void (root as HTMLElement).offsetHeight;
      root.classList.add('comic-wipe--exit');
    }, EXIT_MS);

    window.setTimeout(() => {
      window.clearTimeout(coverTimer);
      window.clearTimeout(exitTimer);
      if (!covered) {
        try {
          onCovered?.();
        } catch {
          /* ignore */
        }
      }
      root.classList.remove(
        'comic-wipe--active',
        'comic-wipe--covered',
        'comic-wipe--exit'
      );
      busy = false;
      resolve(true);
    }, TOTAL_MS);
  });
}

export function isComicWipeBusy(): boolean {
  return busy;
}
