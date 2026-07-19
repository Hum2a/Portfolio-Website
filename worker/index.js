/**
 * Portfolio Worker — traffic notify API + static assets SPA.
 *
 * Secrets (wrangler secret put):
 *   RESEND_API_KEY, NOTIFY_SECRET
 */

const ALLOWED_TYPES = new Set(['new_visitor', 'ref_hit']);
const RESEND_FROM_EMAIL = 'traffic@humza-butt.space';
const DEFAULT_NOTIFY_TO_EMAIL = 'humzab1711@hotmail.com';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_RECIPIENTS = 20;

function normalizeEmail(email) {
  if (typeof email !== 'string') return null;
  const trimmed = email.trim().toLowerCase();
  if (!trimmed || !EMAIL_RE.test(trimmed)) return null;
  return trimmed;
}

/** Always includes default To; merges optional extra recipients from the request. */
function resolveRecipients(extra) {
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

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatValue(value) {
  if (value == null) return '—';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'object' && typeof value.toDate === 'function') {
    try {
      return value.toDate().toISOString();
    } catch {
      // fall through
    }
  }
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function flattenEntries(obj, prefix = '') {
  const rows = [];
  if (obj == null || typeof obj !== 'object' || Array.isArray(obj)) {
    rows.push([prefix || 'value', formatValue(obj)]);
    return rows;
  }
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value != null && typeof value === 'object' && !Array.isArray(value)) {
      const nested = flattenEntries(value, path);
      if (nested.length) rows.push(...nested);
      else rows.push([path, formatValue(value)]);
    } else {
      rows.push([path, formatValue(value)]);
    }
  }
  return rows;
}

function sectionHtml(title, data) {
  const rows = flattenEntries(data || {});
  if (!rows.length) {
    return `<h2>${escapeHtml(title)}</h2><p><em>(empty)</em></p>`;
  }
  const body = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 12px 4px 0;vertical-align:top;white-space:nowrap;font-weight:600">${escapeHtml(k)}</td><td style="padding:4px 0;vertical-align:top;font-family:ui-monospace,monospace;white-space:pre-wrap;word-break:break-word">${escapeHtml(v)}</td></tr>`
    )
    .join('');
  return `<h2 style="margin:24px 0 8px">${escapeHtml(title)}</h2><table style="border-collapse:collapse;width:100%">${body}</table>`;
}

function sectionText(title, data) {
  const rows = flattenEntries(data || {});
  const lines = rows.map(([k, v]) => `  ${k}: ${v}`);
  return `${title}\n${lines.length ? lines.join('\n') : '  (empty)'}\n`;
}

function buildEmail(type, payload) {
  const location = payload?.location || {};
  const campaign = payload?.campaign || payload?.campaignData || {};
  const city = location.city || 'Unknown';
  const country = location.country || 'Unknown';
  const source = campaign.source || payload?.source || 'unknown';
  const token = payload?.refToken || campaign.refToken || '—';

  const subject =
    type === 'ref_hit'
      ? `Ref hit: ${source} (${token})`
      : `New visitor: ${city}, ${country}`;

  const sections = [
    ['Summary', {
      type,
      notifiedAt: new Date().toISOString(),
      environment: payload?.environment,
      anonymizedIP: payload?.anonymizedIP,
      code: payload?.code,
      visitorId: payload?.visitorId,
      sessionId: payload?.sessionId,
      landingPath: payload?.landingPath || payload?.session?.landingPath,
      referrer: payload?.referrer || payload?.session?.referrer,
    }],
    ['Visitor', {
      visitorId: payload?.visitorId,
      anonymizedIP: payload?.anonymizedIP,
      code: payload?.code,
      firstVisit: payload?.firstVisit,
      lastVisit: payload?.lastVisit,
      visits: payload?.visits,
      environment: payload?.environment,
    }],
    ['Location', payload?.location],
    ['Traffic signals', payload?.trafficSignals],
    ['Device info', payload?.deviceInfo],
    ['Session', payload?.session || payload?.sessionData],
    ['Campaign', campaign],
    ['Ref hit', type === 'ref_hit' ? {
      refToken: token,
      source,
      medium: campaign.medium || payload?.medium,
      campaign: campaign.campaign || payload?.campaignName,
      landingPage: payload?.landingPage || campaign.landingPage,
      attributionSource: payload?.refAttributionSource,
    } : null],
  ].filter(([, data]) => data != null);

  const htmlParts = sections.map(([title, data]) => sectionHtml(title, data));
  const jsonAppendix = escapeHtml(JSON.stringify(payload ?? {}, null, 2));

  const html = `<!DOCTYPE html>
<html><body style="font-family:system-ui,sans-serif;line-height:1.45;color:#111;max-width:720px;margin:0 auto;padding:16px">
  <h1 style="margin:0 0 8px">${escapeHtml(subject)}</h1>
  <p style="margin:0 0 16px;color:#555">Portfolio traffic notification</p>
  ${htmlParts.join('\n')}
  <h2 style="margin:32px 0 8px">Full payload (JSON)</h2>
  <pre style="background:#f4f4f5;padding:12px;border-radius:6px;overflow:auto;font-size:12px;white-space:pre-wrap;word-break:break-word">${jsonAppendix}</pre>
</body></html>`;

  const text = [
    subject,
    '',
    ...sections.map(([title, data]) => sectionText(title, data)),
    'Full payload (JSON)',
    JSON.stringify(payload ?? {}, null, 2),
  ].join('\n');

  return { subject, html, text };
}

async function sendResendEmail(env, { subject, html, text, to }) {
  const apiKey = env.RESEND_API_KEY;
  const recipients = Array.isArray(to) && to.length ? to : [DEFAULT_NOTIFY_TO_EMAIL];

  if (!apiKey) {
    return { ok: false, status: 500, error: 'Missing RESEND_API_KEY secret' };
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: RESEND_FROM_EMAIL,
      to: recipients,
      subject,
      html,
      text,
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      ok: false,
      status: 502,
      error: data?.message || `Resend error ${res.status}`,
      details: data,
    };
  }
  return { ok: true, id: data?.id || null };
}

async function handleTrafficNotify(request, env) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Authorization, Content-Type',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  if (request.method !== 'POST') {
    return json(405, { error: 'Method not allowed' });
  }

  const expected = env.NOTIFY_SECRET;
  if (!expected) {
    return json(500, { error: 'NOTIFY_SECRET not configured' });
  }

  const auth = request.headers.get('Authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  if (!token || token !== expected) {
    return json(401, { error: 'Unauthorized' });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json(400, { error: 'Invalid JSON body' });
  }

  const type = body?.type;
  const payload = body?.payload;
  if (!ALLOWED_TYPES.has(type) || !payload || typeof payload !== 'object') {
    return json(400, { error: 'Expected { type: "new_visitor"|"ref_hit", payload: object }' });
  }

  if (payload.environment === 'localhost') {
    return json(200, { ok: true, skipped: 'localhost' });
  }

  const email = buildEmail(type, payload);
  const to = resolveRecipients(body?.recipients);
  const result = await sendResendEmail(env, { ...email, to });
  if (!result.ok) {
    return json(result.status, { error: result.error, details: result.details });
  }
  return json(200, { ok: true, id: result.id, to });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/traffic-notify') {
      const response = await handleTrafficNotify(request, env);
      const headers = new Headers(response.headers);
      headers.set('Access-Control-Allow-Origin', '*');
      return new Response(response.body, {
        status: response.status,
        headers,
      });
    }

    // With run_worker_first limited to /api/*, non-API traffic is asset-served.
    // Fallback for unexpected Worker invocations.
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }
    return json(404, { error: 'Not found' });
  },
};
