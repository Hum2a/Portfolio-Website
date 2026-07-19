import { featureFlags, apiKeys } from '../utils/env';
import { listNotifyRecipientsForSend } from './trafficNotifyRecipientsService';

const NOTIFY_PATH = '/api/traffic-notify';

/**
 * Fire-and-forget traffic email via Worker → Resend.
 * No-op when analytics disabled, localhost, or notify secret missing.
 */
export function notifyTrafficEvent(type, payload) {
  try {
    if (!featureFlags.enableAnalytics) return;
    if (!payload || typeof payload !== 'object') return;
    if (payload.environment === 'localhost') return;

    const secret = apiKeys.trafficNotifySecret;
    if (!secret) return;

    // Resolve recipients then POST — never block analytics on failure
    Promise.resolve()
      .then(async () => {
        const recipients = await listNotifyRecipientsForSend();
        return fetch(NOTIFY_PATH, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${secret}`,
          },
          body: JSON.stringify({ type, payload, recipients }),
          keepalive: true,
        });
      })
      .catch(() => {
        // Notifications must never block analytics
      });
  } catch {
    // ignore
  }
}
