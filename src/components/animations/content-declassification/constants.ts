export const SLASH_MS = 90;
export const LEAVE_MS = 180;
export const STAGGER_MS = 130;

export const BEHAVIOURS = ['split', 'strike', 'peel', 'split', 'strike'] as const;

export type CensorBehaviour = (typeof BEHAVIOURS)[number];

export function getBehaviour(index: number): CensorBehaviour {
  return BEHAVIOURS[index % BEHAVIOURS.length];
}

export function getVariantIndex(index: number): number {
  return index % 5;
}
