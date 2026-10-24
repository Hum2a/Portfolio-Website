import { LEAVE_MS, SLASH_MS, type CensorBehaviour } from './constants';
import { prefersReducedMotion } from '@/lib/motion';

type TimerId = ReturnType<typeof setTimeout>;

export { prefersReducedMotion };

export function revealCensorElement(
  node: HTMLElement,
  behaviour: CensorBehaviour,
  /** Extra time for staggered line bars to finish (lineCount - 1) * LINE_STAGGER_MS. */
  tailMs = 0
): { cancel: () => void } {
  const timers: TimerId[] = [];

  const later = (ms: number, fn: () => void) => {
    const id = window.setTimeout(fn, ms);
    timers.push(id);
    return id;
  };

  const cancel = () => {
    for (const id of timers) window.clearTimeout(id);
    timers.length = 0;
  };

  if (prefersReducedMotion()) {
    node.classList.remove('is-striking', 'is-removing');
    node.classList.add('is-clear');
    return { cancel };
  }

  node.classList.remove('is-striking', 'is-removing', 'is-clear');
  const needsSlash = behaviour === 'strike' || behaviour === 'split';

  if (needsSlash) {
    node.classList.add('is-striking');
    later(SLASH_MS + tailMs, () => {
      node.classList.remove('is-striking');
      node.classList.add('is-removing');
      later(LEAVE_MS + tailMs, () => {
        node.classList.remove('is-removing');
        node.classList.add('is-clear');
      });
    });
  } else {
    node.classList.add('is-removing');
    later(LEAVE_MS + tailMs, () => {
      node.classList.remove('is-removing');
      node.classList.add('is-clear');
    });
  }

  return { cancel };
}
