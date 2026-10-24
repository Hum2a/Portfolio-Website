import { prefersReducedMotion } from '@/lib/motion';
/**
 * Paper Stack Shuffle — tiny portable API.
 * Works inside sandbox="allow-scripts" (no parent / storage / network).
 *
 * Each sheet's path is ONE `el.animate()` with offset keyframes, so velocity never
 * drops to zero mid-flight. `zIndex` lives in the keyframes too, so the "goes behind"
 * swap happens at an exact offset.
 */

/** Frozen depth contract: index 0 = front … 3 = back */
export const DEPTH_POSES = [
  { x: 0, y: 0, rot: -2, z: 40 },
  { x: 8, y: 8, rot: 3, z: 30 },
  { x: -5, y: 16, rot: -4, z: 20 },
  { x: 11, y: 23, rot: 2, z: 10 },
] as const;

export const TOTAL_MS = 720;
const EASE = 'cubic-bezier(0.7, 0, 0.3, 1)';
/** Gentler whole-path easing for multi-segment flights (linear between keyframes). */
const FLIGHT_EASE = 'cubic-bezier(0.55, 0, 0.35, 1)';

export type ShuffleDirection = 'next' | 'prev';

export type PaperStackShuffleContext = {
  sheets: (HTMLElement | null)[];
  order: number[];
  demoEl: HTMLElement | null;
  setBusy: (on: boolean) => void;
  setStatus?: (text: string) => void;
  statusLabel?: (frontSheetId: number) => string;
};

/** Animations of the shuffle in flight, so callers can fast-forward them. */
let running: Animation[] = [];

function poseTransform(d: number): string {
  const p = DEPTH_POSES[d];
  return `translate(${p.x}px, ${p.y}px) rotate(${p.rot}deg)`;
}

function extractX(demoEl: HTMLElement | null): string {
  if (!demoEl) return '78%';
  return getComputedStyle(demoEl).getPropertyValue('--extract-x').trim() || '78%';
}

export function applySettled(
  sheets: (HTMLElement | null)[],
  order: number[]
): void {
  sheets.forEach((el) => {
    if (!el) return;
    el.classList.remove('is-flying', 'is-behind-flight', 'is-active');
    el.getAnimations?.().forEach((a) => a.cancel());
  });
  // Index the raw array by sheet id — filtering nulls would shift ids.
  order.forEach((sheetId, depth) => {
    const el = sheets[sheetId];
    if (!el) return;
    el.dataset.depth = String(depth);
    el.style.zIndex = String(DEPTH_POSES[depth].z);
    el.style.transform = poseTransform(depth);
    if (depth === 0) el.classList.add('is-active');
  });
}

function play(
  el: HTMLElement,
  keyframes: Keyframe[],
  duration: number,
  delay = 0,
  easing = EASE
): Promise<void> {
  const anim = el.animate(keyframes, { duration, delay, easing, fill: 'forwards' });
  running.push(anim);
  return anim.finished.then(
    () => undefined,
    () => undefined
  );
}

/** Instantly completes any shuffle in flight (its promise then settles normally). */
export function finishPaperStack(): void {
  for (const a of running) {
    try {
      a.finish();
    } catch {
      /* already cancelled */
    }
  }
}

function runNext(list: (HTMLElement | null)[], order: number[], x: string): Promise<void> {
  const front = list[order[0]];
  const rest = order.slice(1).map((id) => list[id]);
  if (!front) return Promise.resolve();

  // Timeline (ms): lift 0–120, extract 120–360, tuck behind 360–650.
  const D = 650;
  const at = (ms: number) => ms / D;
  const lifted = 'translate(0px, -8px) scale(1.02) rotate(-4deg)';
  const out = `translate(${x}, -14%) rotate(9deg)`;
  front.classList.add('is-flying');

  const flight = play(
    front,
    [
      { offset: 0, transform: poseTransform(0), zIndex: 50 },
      { offset: at(120), transform: lifted, zIndex: 50 },
      { offset: at(359), transform: out, zIndex: 50 },
      { offset: at(361), transform: out, zIndex: 5 },
      { offset: at(505), transform: 'translate(42%, 18%) rotate(4deg)', zIndex: 5 },
      { offset: 1, transform: poseTransform(3), zIndex: 5 },
    ],
    D,
    0,
    FLIGHT_EASE
  );

  const advances = rest.map((el, i) => {
    if (!el) return Promise.resolve();
    const z = DEPTH_POSES[i].z + 1;
    return play(
      el,
      [
        { transform: poseTransform(i + 1), zIndex: z },
        { transform: poseTransform(i), zIndex: z },
      ],
      240,
      140
    );
  });

  return Promise.all([flight, ...advances]).then(() => undefined);
}

function runPrev(list: (HTMLElement | null)[], order: number[], x: string): Promise<void> {
  const rising = list[order[3]];
  const others = order.slice(0, 3).map((id) => list[id]);
  if (!rising) return Promise.resolve();

  // Timeline (ms): slip out behind 0–160, arc over the top 160–580.
  const D = 580;
  const at = (ms: number) => ms / D;
  const side = 'translate(-48%, 12%) rotate(-8deg)';
  rising.classList.add('is-flying');

  const flight = play(
    rising,
    [
      { offset: 0, transform: poseTransform(3), zIndex: 5 },
      { offset: at(159), transform: side, zIndex: 5 },
      { offset: at(161), transform: side, zIndex: 50 },
      { offset: at(330), transform: `translate(${x}, -12%) rotate(7deg)`, zIndex: 50 },
      { offset: at(480), transform: 'translate(0px, -8px) scale(1.02) rotate(-4deg)', zIndex: 50 },
      { offset: 1, transform: poseTransform(0), zIndex: 50 },
    ],
    D,
    0,
    FLIGHT_EASE
  );

  const retreats = others.map((el, i) => {
    if (!el) return Promise.resolve();
    const z = DEPTH_POSES[i + 1].z;
    return play(
      el,
      [
        { transform: poseTransform(i), zIndex: z },
        { transform: poseTransform(i + 1), zIndex: z },
      ],
      260,
      120
    );
  });

  return Promise.all([flight, ...retreats]).then(() => undefined);
}

export function rotateOrder(order: number[], direction: ShuffleDirection): number[] {
  return direction === 'next'
    ? [...order.slice(1), order[0]]
    : [order[order.length - 1], ...order.slice(0, -1)];
}

/**
 * @returns new order array after shuffle
 */
export async function shufflePaperStack(
  direction: ShuffleDirection,
  ctx: PaperStackShuffleContext
): Promise<number[]> {
  if (ctx.sheets.filter(Boolean).length < 4) return ctx.order;

  const order = rotateOrder(ctx.order, direction);
  const announce = () => {
    if (ctx.setStatus && ctx.statusLabel) {
      ctx.setStatus(`Selected: ${ctx.statusLabel(order[0])}`);
    }
  };

  if (prefersReducedMotion()) {
    applySettled(ctx.sheets, order);
    announce();
    return order;
  }

  ctx.setBusy(true);
  const x = extractX(ctx.demoEl);
  running = [];

  try {
    if (direction === 'next') await runNext(ctx.sheets, ctx.order, x);
    else await runPrev(ctx.sheets, ctx.order, x);
  } finally {
    running = [];
    applySettled(ctx.sheets, order);
    announce();
    ctx.setBusy(false);
  }

  return order;
}
