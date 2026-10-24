export const SLASH_MS = 90;
export const LEAVE_MS = 180;
export const STAGGER_MS = 130;
/** Cap on cumulative stagger so late items do not wait forever. */
export const MAX_STAGGER_MS = 520;
/** Per-line offset when one value wraps onto several bars. */
export const LINE_STAGGER_MS = 25;

export const BEHAVIOURS = ['split', 'strike', 'peel', 'split', 'strike'] as const;

export type CensorBehaviour = (typeof BEHAVIOURS)[number];

export function getBehaviour(index: number): CensorBehaviour {
  return BEHAVIOURS[index % BEHAVIOURS.length];
}

export function getVariantIndex(index: number): number {
  return index % 5;
}
