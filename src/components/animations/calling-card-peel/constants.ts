export const LIFT_MS = 180;
export const TENSION_MS = 160;
export const PEEL_MS = 460;
export const RELEASE_MS = 240;
export const TOTAL_MS = LIFT_MS + TENSION_MS + PEEL_MS + RELEASE_MS;

export const PHASES = [
  'ccp--lift',
  'ccp--tension',
  'ccp--peel',
  'ccp--release',
  'ccp--revealed',
  'ccp--reduced',
  'ccp--busy',
] as const;
