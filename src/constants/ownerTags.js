/** Default label for devices you own. */
export const OWNER_TAG_MINE = 'Mine';

/** Label for Claude Cowork / headless browser visits (anon_* keys). */
export const OWNER_TAG_CLAUDE_COWORK = 'Claude Cowork';

/** Fallback visitor keys when public IP lookup fails (`anon_` + hash). */
export function isAnonVisitorKey(key) {
  return typeof key === 'string' && key.startsWith('anon_');
}

export function isClaudeCoworkLabel(label) {
  return label === OWNER_TAG_CLAUDE_COWORK;
}
