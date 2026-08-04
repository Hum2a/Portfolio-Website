/** Resend From address (must be verified in Resend). */
export const RESEND_FROM_EMAIL = 'traffic@humza-butt.space';

/** Always included in every traffic notification. */
export const DEFAULT_NOTIFY_TO_EMAIL = 'humzab1711@hotmail.com';

export const NOTIFY_RECIPIENTS_DOC = 'analytics_settings/traffic_notify';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeNotifyEmail(email) {
  if (typeof email !== 'string') return null;
  const trimmed = email.trim().toLowerCase();
  if (!trimmed || !EMAIL_RE.test(trimmed)) return null;
  return trimmed;
}

export function isDefaultNotifyEmail(email) {
  const normalized = normalizeNotifyEmail(email);
  return normalized === DEFAULT_NOTIFY_TO_EMAIL;
}
