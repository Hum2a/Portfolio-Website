export const DEFAULT_NOTIFY_TO_EMAIL = 'humzab1711@hotmail.com';
export const MAX_RECIPIENTS = 20;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(email: unknown): string | null {
  if (typeof email !== 'string') return null;
  const trimmed = email.trim().toLowerCase();
  if (!trimmed || !EMAIL_RE.test(trimmed)) return null;
  return trimmed;
}

/** Always includes default To; merges optional extra recipients from the request. */
export function resolveRecipients(extra: unknown): string[] {
  const seen = new Set([DEFAULT_NOTIFY_TO_EMAIL]);
  const to = [DEFAULT_NOTIFY_TO_EMAIL];
  if (!Array.isArray(extra)) return to;
  for (const item of extra) {
    const email = normalizeEmail(item);
    if (!email || seen.has(email)) continue;
    seen.add(email);
    to.push(email);
    if (to.length >= MAX_RECIPIENTS) break;
  }
  return to;
}
