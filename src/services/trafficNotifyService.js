import { featureFlags, apiKeys } from '../utils/env';
import { listNotifyRecipientsForSend } from './trafficNotifyRecipientsService';
import { createNotifyEmailLog, finalizeNotifyEmailLog } from './trafficNotifyLogService';

const NOTIFY_PATH = '/api/traffic-notify';

/**
 * Fire-and-forget traffic email via Worker → Resend.
 * Logs each attempt to Firestore for the Traffic → Emails tab.
 * No-op when analytics disabled, localhost, or notify secret missing.
 */
export function notifyTrafficEvent(type, payload) {
  try {
    if (!featureFlags.enableAnalytics) return;
    if (!payload || typeof payload !== 'object') return;
    if (payload.environment === 'localhost') return;

    const secret = apiKeys.trafficNotifySecret;
    if (!secret) return;

    Promise.resolve()
      .then(async () => {
        const recipients = await listNotifyRecipientsForSend();
        const logId = await createNotifyEmailLog({ type, payload, recipients });

        let res;
        try {
          res = await fetch(NOTIFY_PATH, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${secret}`,
            },
            body: JSON.stringify({ type, payload, recipients }),
            keepalive: true,
          });
        } catch (networkErr) {
          await finalizeNotifyEmailLog(logId, {
            ok: false,
            error: networkErr?.message || 'Network error',
          });
          return;
        }

        const data = await res.json().catch(() => ({}));
        await finalizeNotifyEmailLog(logId, {
          ok: res.ok && data?.ok !== false && !data?.error,
          resendId: data?.id || null,
          error: data?.error || (!res.ok ? `HTTP ${res.status}` : null),
          recipients: data?.to || recipients,
        });
      })
      .catch(() => {
        // Notifications must never block analytics
      });
  } catch {
    // ignore
  }
}
