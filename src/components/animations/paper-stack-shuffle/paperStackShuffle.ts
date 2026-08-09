/**
 * Paper Stack Shuffle — tiny portable API.
 * Works inside sandbox="allow-scripts" (no parent / storage / network).
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

export type ShuffleDirection = 'next' | 'prev';

export type PaperStackShuffleContext = {
  sheets: (HTMLElement | null)[];
  order: number[];
  demoEl: HTMLElement | null;
  setBusy: (on: boolean) => void;
  setStatus?: (text: string) => void;
  statusLabel?: (frontSheetId: number) => string;
};

function prefersReducedMotion(): boolean {
  const forced =
    document.documentElement.getAttribute('data-force-reduced-motion') === 'true';
  const media = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return forced || media;
}

function poseTransform(d: number): string {
  const p = DEPTH_POSES[d];
  return `translate(${p.x}px, ${p.y}px) rotate(${p.rot}deg)`;
}

function extractX(demoEl: HTMLElement | null): string {
  if (!demoEl) return '78%';
  return getComputedStyle(demoEl).getPropertyValue('--extract-x').trim() || '78%';
}

function getSheetList(sheets: (HTMLElement | null)[]): HTMLElement[] {
  return sheets.filter((el): el is HTMLElement => el != null);
}

export function applySettled(
  sheets: (HTMLElement | null)[],
  order: number[]
): void {
  const list = getSheetList(sheets);
  list.forEach((el) => {
    el.classList.remove('is-flying', 'is-behind-flight', 'is-active');
    el.getAnimations?.().forEach((a) => a.cancel());
  });
  order.forEach((sheetId, depth) => {
    const el = list[sheetId];
    if (!el) return;
    el.dataset.depth = String(depth);
    el.style.zIndex = String(DEPTH_POSES[depth].z);
    el.style.transform = poseTransform(depth);
    if (depth === 0) el.classList.add('is-active');
  });
}

function animateTo(
  el: HTMLElement,
  keyframes: Keyframe[],
  duration: number,
  delay = 0
): Promise<void> {
  return el
    .animate(keyframes, {
      duration,
      delay,
      easing: EASE,
      fill: 'forwards',
    })
    .finished.then(() => undefined);
}

async function runNext(
  list: HTMLElement[],
  order: number[],
  x: string
): Promise<number[]> {
  const frontId = order[0];
  const front = list[frontId];
  const rest = order.slice(1).map((id) => list[id]);

  front.classList.add('is-flying');
  front.style.zIndex = '50';

  await animateTo(
    front,
    [
      { transform: poseTransform(0) },
      { transform: 'translate(0px, -8px) scale(1.02) rotate(-4deg)' },
    ],
    120
  );

  const extract = animateTo(
    front,
    [
      { transform: 'translate(0px, -8px) scale(1.02) rotate(-4deg)' },
      { transform: `translate(${x}, -14%) rotate(9deg)` },
    ],
    240
  );

  const advances = rest.map((el, i) => {
    const from = i + 1;
    const to = i;
    el.style.zIndex = String(DEPTH_POSES[to].z + 1);
    return animateTo(
      el,
      [{ transform: poseTransform(from) }, { transform: poseTransform(to) }],
      240,
      140
    );
  });

  await extract;

  front.classList.remove('is-flying');
  front.classList.add('is-behind-flight');
  front.style.zIndex = '5';

  await animateTo(
    front,
    [
      { transform: `translate(${x}, -14%) rotate(9deg)` },
      { transform: 'translate(42%, 18%) rotate(4deg)' },
      { transform: poseTransform(3) },
    ],
    290
  );

  await Promise.all(advances);
  await new Promise((r) => window.setTimeout(r, 70));

  return [...order.slice(1), order[0]];
}

async function runPrev(
  list: HTMLElement[],
  order: number[],
  x: string
): Promise<number[]> {
  const backId = order[3];
  const rising = list[backId];
  const others = order.slice(0, 3).map((id) => list[id]);

  rising.classList.add('is-behind-flight');
  rising.style.zIndex = '5';

  await animateTo(
    rising,
    [
      { transform: poseTransform(3) },
      { transform: 'translate(-48%, 12%) rotate(-8deg)' },
    ],
    160
  );

  rising.classList.remove('is-behind-flight');
  rising.classList.add('is-flying');
  rising.style.zIndex = '50';

  const emerge = animateTo(
    rising,
    [
      { transform: 'translate(-48%, 12%) rotate(-8deg)' },
      { transform: `translate(${x}, -12%) rotate(7deg)` },
      { transform: 'translate(0px, -8px) scale(1.02) rotate(-4deg)' },
      { transform: poseTransform(0) },
    ],
    420
  );

  const retreats = others.map((el, i) => {
    const from = i;
    const to = i + 1;
    return animateTo(
      el,
      [{ transform: poseTransform(from) }, { transform: poseTransform(to) }],
      260,
      120
    );
  });

  await emerge;
  await Promise.all(retreats);
  await new Promise((r) => window.setTimeout(r, 40));

  return [order[3], ...order.slice(0, 3)];
}

/**
 * @returns new order array after shuffle
 */
export async function shufflePaperStack(
  direction: ShuffleDirection,
  ctx: PaperStackShuffleContext
): Promise<number[]> {
  const list = getSheetList(ctx.sheets);
  if (list.length < 4) return ctx.order;

  let order = [...ctx.order];

  if (prefersReducedMotion()) {
    if (direction === 'next') order = [...order.slice(1), order[0]];
    else order = [order[order.length - 1], ...order.slice(0, -1)];
    applySettled(ctx.sheets, order);
    if (ctx.setStatus && ctx.statusLabel) {
      ctx.setStatus(`Selected: ${ctx.statusLabel(order[0])}`);
    }
    return order;
  }

  ctx.setBusy(true);
  const x = extractX(ctx.demoEl);

  try {
    if (direction === 'next') order = await runNext(list, order, x);
    else order = await runPrev(list, order, x);
  } finally {
    applySettled(ctx.sheets, order);
    if (ctx.setStatus && ctx.statusLabel) {
      ctx.setStatus(`Selected: ${ctx.statusLabel(order[0])}`);
    }
    ctx.setBusy(false);
  }

  return order;
}

void TOTAL_MS;
