import { escapeHtml } from './escape';

type EmailTheme = {
  label: string;
  accent: string;
  accentSoft: string;
  accentText: string;
  headerFrom: string;
  headerTo: string;
};

const EMAIL_THEMES: Record<string, EmailTheme> = {
  new_visitor: {
    label: 'New visitor',
    accent: '#4f46e5',
    accentSoft: '#eef2ff',
    accentText: '#312e81',
    headerFrom: '#312e81',
    headerTo: '#4f46e5',
  },
  ref_hit: {
    label: 'Ref hit',
    accent: '#0f766e',
    accentSoft: '#f0fdfa',
    accentText: '#134e4a',
    headerFrom: '#134e4a',
    headerTo: '#0d9488',
  },
  test: {
    label: 'Test email',
    accent: '#d97706',
    accentSoft: '#fffbeb',
    accentText: '#92400e',
    headerFrom: '#92400e',
    headerTo: '#d97706',
  },
};

function getEmailTheme(type: string): EmailTheme {
  return EMAIL_THEMES[type] || EMAIL_THEMES.new_visitor;
}

function formatValue(value: unknown): string {
  if (value == null) return '—';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'object' && value !== null && typeof (value as { toDate?: () => Date }).toDate === 'function') {
    try {
      return (value as { toDate: () => Date }).toDate().toISOString();
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

function flattenEntries(obj: unknown, prefix = ''): [string, string][] {
  const rows: [string, string][] = [];
  if (obj == null || typeof obj !== 'object' || Array.isArray(obj)) {
    rows.push([prefix || 'value', formatValue(obj)]);
    return rows;
  }
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
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

function sectionHtml(title: string, data: unknown, theme: EmailTheme): string {
  const rows = flattenEntries(data || {});
  if (!rows.length) return '';

  const body = rows
    .map(([k, v], index) => {
      const bg = index % 2 === 0 ? '#ffffff' : '#f8fafc';
      return `<tr>
        <td style="padding:10px 14px;vertical-align:top;white-space:nowrap;font-size:12px;font-weight:700;letter-spacing:0.02em;text-transform:uppercase;color:#64748b;background:${bg};border-bottom:1px solid #e2e8f0;width:34%">${escapeHtml(k)}</td>
        <td style="padding:10px 14px;vertical-align:top;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:13px;color:#0f172a;background:${bg};border-bottom:1px solid #e2e8f0;white-space:pre-wrap;word-break:break-word">${escapeHtml(v)}</td>
      </tr>`;
    })
    .join('');

  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 18px;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;background:#ffffff">
    <tr>
      <td style="padding:12px 16px;background:${theme.accentSoft};border-bottom:1px solid #e2e8f0">
        <span style="display:inline-block;width:8px;height:8px;border-radius:999px;background:${theme.accent};margin-right:8px;vertical-align:middle"></span>
        <span style="font-size:13px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;color:${theme.accentText};vertical-align:middle">${escapeHtml(title)}</span>
      </td>
    </tr>
    <tr>
      <td style="padding:0">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">${body}</table>
      </td>
    </tr>
  </table>`;
}

function sectionText(title: string, data: unknown): string {
  const rows = flattenEntries(data || {});
  const lines = rows.map(([k, v]) => `  ${k}: ${v}`);
  return `${title}\n${lines.length ? lines.join('\n') : '  (empty)'}\n`;
}

function highlightChip(label: string, value: unknown, theme: EmailTheme): string {
  if (value == null || value === '' || value === '—') return '';
  return `
  <td style="padding:0 8px 8px 0;vertical-align:top">
    <table role="presentation" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:10px;background:#ffffff">
      <tr>
        <td style="padding:10px 12px">
          <div style="font-size:11px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;color:#64748b;margin:0 0 4px">${escapeHtml(label)}</div>
          <div style="font-size:14px;font-weight:700;color:${theme.accentText};font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;word-break:break-word">${escapeHtml(value)}</div>
        </td>
      </tr>
    </table>
  </td>`;
}

function wrapEmailDocument({
  type,
  subject,
  eyebrow,
  intro,
  highlightHtml,
  bodyHtml,
  footerNote,
}: {
  type: string;
  subject: string;
  eyebrow: string;
  intro: string;
  highlightHtml: string;
  bodyHtml: string;
  footerNote?: string;
}): string {
  const theme = getEmailTheme(type);
  const year = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#eef2f7;color:#0f172a">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;mso-hide:all">
    ${escapeHtml(eyebrow)} — ${escapeHtml(subject)}
  </div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef2f7;padding:28px 12px">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #dde3ee;box-shadow:0 10px 30px rgba(15,23,42,0.06)">
          <tr>
            <td bgcolor="${theme.accent}" style="height:6px;background:linear-gradient(90deg,${theme.headerFrom},${theme.headerTo});font-size:0;line-height:0">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding:28px 28px 8px;background:#ffffff">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="display:inline-block;padding:5px 10px;border-radius:999px;background:${theme.accentSoft};color:${theme.accentText};font-size:11px;font-weight:800;letter-spacing:0.06em;text-transform:uppercase;border:1px solid ${theme.accent}33">${escapeHtml(theme.label)}</span>
                  </td>
                  <td align="right" style="font-size:12px;color:#94a3b8;font-weight:600">humza-butt.space</td>
                </tr>
              </table>
              <h1 style="margin:16px 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:1.25;color:#0f172a;font-weight:700">${escapeHtml(subject)}</h1>
              <p style="margin:0 0 18px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:14px;line-height:1.55;color:#475569">${escapeHtml(intro)}</p>
            </td>
          </tr>
          ${
            highlightHtml
              ? `<tr><td style="padding:0 28px 8px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>${highlightHtml}</tr></table></td></tr>`
              : ''
          }
          <tr>
            <td style="padding:8px 28px 24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:18px 28px;background:#f8fafc;border-top:1px solid #e2e8f0">
              <p style="margin:0;font-size:12px;line-height:1.5;color:#64748b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
                ${escapeHtml(footerNote || 'Portfolio traffic notification')} · © ${year} Humza Butt
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function jsonAppendixHtml(payload: unknown, theme: EmailTheme): string {
  const json = escapeHtml(JSON.stringify(payload ?? {}, null, 2));
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 8px;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;background:#ffffff">
    <tr>
      <td style="padding:12px 16px;background:${theme.accentSoft};border-bottom:1px solid #e2e8f0">
        <span style="display:inline-block;width:8px;height:8px;border-radius:999px;background:${theme.accent};margin-right:8px;vertical-align:middle"></span>
        <span style="font-size:13px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;color:${theme.accentText};vertical-align:middle">Full payload (JSON)</span>
      </td>
    </tr>
    <tr>
      <td style="padding:14px 16px;background:#0f172a">
        <pre style="margin:0;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12px;line-height:1.5;color:#e2e8f0;white-space:pre-wrap;word-break:break-word">${json}</pre>
      </td>
    </tr>
  </table>`;
}

function buildTestEmail(payload: Record<string, unknown>) {
  const type = 'test';
  const theme = getEmailTheme(type);
  const subject = 'Test email: portfolio traffic notifications';
  const sentAt = new Date().toISOString();
  const note =
    (typeof payload?.note === 'string' && payload.note) ||
    'This is a manual test from the Traffic dashboard. Delivery and recipients look correct if you received this.';

  const summary = {
    type: 'test',
    sentAt,
    environment: payload?.environment || 'test',
    triggeredBy: payload?.triggeredBy || 'traffic-dashboard',
    note,
  };

  const highlightHtml = [
    highlightChip('Status', 'Delivery OK path', theme),
    highlightChip('Triggered by', summary.triggeredBy, theme),
    highlightChip('Environment', summary.environment, theme),
  ].join('');

  const html = wrapEmailDocument({
    type,
    subject,
    eyebrow: 'Manual delivery check',
    intro: note,
    highlightHtml,
    bodyHtml: sectionHtml('Summary', summary, theme),
    footerNote: 'Manual test from the Traffic dashboard',
  });

  const text = [subject, '', note, '', sectionText('Summary', summary)].join('\n');

  return { subject, html, text };
}

export function buildEmail(type: string, payload: Record<string, unknown>) {
  if (type === 'test') {
    return buildTestEmail(payload);
  }

  const theme = getEmailTheme(type);
  const location = (payload?.location || {}) as Record<string, unknown>;
  const campaign = (payload?.campaign || payload?.campaignData || {}) as Record<
    string,
    unknown
  >;
  const city = (location.city as string) || 'Unknown';
  const country = (location.country as string) || 'Unknown';
  const source = (campaign.source as string) || (payload?.source as string) || 'unknown';
  const token =
    (payload?.refToken as string) || (campaign.refToken as string) || '—';
  const landingPath =
    (payload?.landingPath as string) ||
    ((payload?.session as Record<string, unknown>)?.landingPath as string) ||
    '—';
  const anonymizedIP = (payload?.anonymizedIP as string) || '—';

  const subject =
    type === 'ref_hit'
      ? `Ref hit: ${source} (${token})`
      : `New visitor: ${city}, ${country}`;

  const intro =
    type === 'ref_hit'
      ? `A tracked reference link was opened from ${source}. Key attribution details are highlighted below.`
      : `Someone new landed on the portfolio from ${city}, ${country}. Visitor context is summarized below.`;

  const sections: [string, Record<string, unknown> | null][] = [
    [
      'Summary',
      {
        type,
        notifiedAt: new Date().toISOString(),
        environment: payload?.environment,
        anonymizedIP: payload?.anonymizedIP,
        code: payload?.code,
        visitorId: payload?.visitorId,
        sessionId: payload?.sessionId,
        landingPath,
        referrer:
          payload?.referrer ||
          (payload?.session as Record<string, unknown>)?.referrer,
      },
    ],
    [
      'Visitor',
      {
        visitorId: payload?.visitorId,
        anonymizedIP: payload?.anonymizedIP,
        code: payload?.code,
        firstVisit: payload?.firstVisit,
        lastVisit: payload?.lastVisit,
        visits: payload?.visits,
        environment: payload?.environment,
      },
    ],
    ['Location', payload?.location as Record<string, unknown>],
    ['Traffic signals', payload?.trafficSignals as Record<string, unknown>],
    ['Device info', payload?.deviceInfo as Record<string, unknown>],
    [
      'Session',
      (payload?.session || payload?.sessionData) as Record<string, unknown>,
    ],
    ['Campaign', campaign],
    [
      'Ref hit',
      type === 'ref_hit'
        ? {
            refToken: token,
            source,
            medium: campaign.medium || payload?.medium,
            campaign: campaign.campaign || payload?.campaignName,
            landingPage: payload?.landingPage || campaign.landingPage,
            attributionSource: payload?.refAttributionSource,
          }
        : null,
    ],
  ].filter(
    ([, data]) => data != null && Object.keys(data || {}).length > 0
  ) as [string, Record<string, unknown>][];

  const highlightHtml =
    type === 'ref_hit'
      ? [
          highlightChip('Source', source, theme),
          highlightChip('Token', token, theme),
          highlightChip('Landing', landingPath, theme),
        ].join('')
      : [
          highlightChip('Location', `${city}, ${country}`, theme),
          highlightChip('IP key', anonymizedIP, theme),
          highlightChip('Landing', landingPath, theme),
        ].join('');

  const bodyHtml = [
    ...sections.map(([title, data]) => sectionHtml(title, data, theme)),
    jsonAppendixHtml(payload, theme),
  ].join('\n');

  const html = wrapEmailDocument({
    type,
    subject,
    eyebrow: theme.label,
    intro,
    highlightHtml,
    bodyHtml,
    footerNote: 'Portfolio traffic notification',
  });

  const text = [
    subject,
    '',
    intro,
    '',
    ...sections.map(([title, data]) => sectionText(title, data)),
    'Full payload (JSON)',
    JSON.stringify(payload ?? {}, null, 2),
  ].join('\n');

  return { subject, html, text };
}

export const RESEND_FROM_EMAIL = 'traffic@humza-butt.space';
