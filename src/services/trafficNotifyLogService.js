import { addDoc, collection, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { RESEND_FROM_EMAIL } from '../constants/trafficNotify';

export const EMAIL_LOG_COLLECTION = 'analytics_email_log';

export function buildNotifySubject(type, payload) {
  const location = payload?.location || {};
  const campaign = payload?.campaign || payload?.campaignData || {};
  const city = location.city || 'Unknown';
  const country = location.country || 'Unknown';
  const source = campaign.source || payload?.source || 'unknown';
  const token = payload?.refToken || campaign.refToken || '—';

  if (type === 'ref_hit') {
    return `Ref hit: ${source} (${token})`;
  }
  return `New visitor: ${city}, ${country}`;
}

function summarizePayload(type, payload) {
  const location = payload?.location || {};
  const campaign = payload?.campaign || {};
  return {
    city: location.city || null,
    country: location.country || null,
    region: location.region || null,
    anonymizedIP: payload?.anonymizedIP || null,
    code: payload?.code || null,
    visitorId: payload?.visitorId || null,
    sessionId: payload?.sessionId || null,
    environment: payload?.environment || null,
    landingPath: payload?.landingPath || payload?.session?.landingPath || null,
    referrer: payload?.referrer || payload?.session?.referrer || null,
    source: campaign.source || payload?.source || null,
    medium: campaign.medium || payload?.medium || null,
    campaign: campaign.campaign || payload?.campaignName || null,
    refToken: payload?.refToken || campaign.refToken || null,
    browser: payload?.deviceInfo?.browser || null,
    os: payload?.deviceInfo?.os || null,
    deviceType: payload?.deviceInfo?.deviceType || null,
  };
}

/**
 * Create a log row before/while sending. Returns doc id or null.
 */
export async function createNotifyEmailLog({ type, payload, recipients }) {
  try {
    const subject = buildNotifySubject(type, payload);
    const summary = summarizePayload(type, payload);
    const ref = await addDoc(collection(db, EMAIL_LOG_COLLECTION), {
      type,
      subject,
      from: RESEND_FROM_EMAIL,
      recipients: Array.isArray(recipients) ? recipients : [],
      status: 'sending',
      resendId: null,
      error: null,
      summary,
      payload: payload || null,
      createdAt: serverTimestamp(),
      sentAt: null,
    });
    return ref.id;
  } catch (e) {
    console.warn('createNotifyEmailLog failed:', e);
    return null;
  }
}

/**
 * Update log after Worker/Resend responds.
 */
export async function finalizeNotifyEmailLog(logId, { ok, resendId, error, recipients }) {
  if (!logId) return;
  try {
    const updates = {
      status: ok ? 'sent' : 'failed',
      sentAt: ok ? new Date() : null,
      resendId: resendId || null,
      error: ok ? null : (error || 'Send failed'),
    };
    if (Array.isArray(recipients) && recipients.length) {
      updates.recipients = recipients;
    }
    await updateDoc(doc(db, EMAIL_LOG_COLLECTION, logId), updates);
  } catch (e) {
    console.warn('finalizeNotifyEmailLog failed:', e);
  }
}
