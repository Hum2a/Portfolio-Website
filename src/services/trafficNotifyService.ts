import { featureFlags, apiKeys } from '../utils/env';
import { listNotifyRecipientsForSend } from './trafficNotifyRecipientsService';
import { createNotifyEmailLog, finalizeNotifyEmailLog } from './trafficNotifyLogService';

const NOTIFY_PATH = '/api/traffic-notify';

async function postTrafficNotify({ type, payload, recipients, secret, keepalive = false }) {
  const res = await fetch(NOTIFY_PATH, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${secret}`,
    },
    body: JSON.stringify({ type, payload, recipients }),
    keepalive,
  });
  const data = await res.json().catch(() => ({}));
  return { res, data };
}

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

        try {
          const { res, data } = await postTrafficNotify({
            type,
            payload,
            recipients,
            secret,
            keepalive: true,
          });
          await finalizeNotifyEmailLog(logId, {
            ok: res.ok && data?.ok !== false && !data?.error,
            resendId: data?.id || null,
            error: data?.error || (!res.ok ? `HTTP ${res.status}` : null),
            recipients: data?.to || recipients,
          });
        } catch (networkErr) {
          await finalizeNotifyEmailLog(logId, {
            ok: false,
            error: networkErr?.message || 'Network error',
          });
        }
      })
      .catch(() => {
        // Notifications must never block analytics
      });
  } catch {
    // ignore
  }
}

/**
 * Send a manual test email to the configured notify recipients.
 * Awaits the result (unlike notifyTrafficEvent) and always logs the attempt.
 * Works from localhost so you can verify delivery from the Traffic dashboard.
 */
export async function sendTestNotifyEmail() {
  const secret = apiKeys.trafficNotifySecret;
  if (!secret) {
    throw new Error('Missing VITE_TRAFFIC_NOTIFY_SECRET — cannot send test email.');
  }

  const payload = {
    environment: 'test',
    triggeredBy: 'traffic-dashboard',
    note: 'This is a manual test from the Traffic dashboard. Delivery and recipients look correct if you received this.',
    sentAt: new Date().toISOString(),
  };

  const recipients = await listNotifyRecipientsForSend();
  const logId = await createNotifyEmailLog({ type: 'test', payload, recipients });

  try {
    const { res, data } = await postTrafficNotify({
      type: 'test',
      payload,
      recipients,
      secret,
    });

    const ok = res.ok && data?.ok !== false && !data?.error;
    const error = data?.error || (!res.ok ? `HTTP ${res.status}` : null);
    await finalizeNotifyEmailLog(logId, {
      ok,
      resendId: data?.id || null,
      error,
      recipients: data?.to || recipients,
    });

    if (!ok) {
      throw new Error(error || 'Test email failed');
    }

    return {
      ok: true,
      resendId: data?.id || null,
      to: data?.to || recipients,
    };
  } catch (err) {
    if (logId) {
      await finalizeNotifyEmailLog(logId, {
        ok: false,
        error: err?.message || 'Network error',
      });
    }
    throw err;
  }
}
