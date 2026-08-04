import type { Context } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import type { WorkerBindings } from '../env';
import { buildEmail, RESEND_FROM_EMAIL } from './email';
import {
  DEFAULT_NOTIFY_TO_EMAIL,
  resolveRecipients,
} from './recipients';
import {
  EXPECTED_BODY_ERROR,
  trafficNotifyBodySchema,
} from './schema';

type AppEnv = { Bindings: WorkerBindings };

function json(
  c: Context<AppEnv>,
  status: ContentfulStatusCode,
  body: Record<string, unknown>
) {
  return c.json(body, status, {
    'Cache-Control': 'no-store',
  });
}

async function sendResendEmail(
  env: WorkerBindings,
  {
    subject,
    html,
    text,
    to,
  }: { subject: string; html: string; text: string; to: string[] }
) {
  const apiKey = env.RESEND_API_KEY;
  const recipients =
    Array.isArray(to) && to.length ? to : [DEFAULT_NOTIFY_TO_EMAIL];

  if (!apiKey) {
    return {
      ok: false as const,
      status: 500 as const,
      error: 'Missing RESEND_API_KEY secret',
    };
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

  const data = (await res.json().catch(() => ({}))) as {
    id?: string;
    message?: string;
  };
  if (!res.ok) {
    return {
      ok: false as const,
      status: 502 as const,
      error: data?.message || `Resend error ${res.status}`,
      details: data,
    };
  }
  return { ok: true as const, id: data?.id || null };
}

export async function handleTrafficNotifyPost(c: Context<AppEnv>) {
  const expected = c.env.NOTIFY_SECRET;
  if (!expected) {
    return json(c, 500, { error: 'NOTIFY_SECRET not configured' });
  }

  const auth = c.req.header('Authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  if (!token || token !== expected) {
    return json(c, 401, { error: 'Unauthorized' });
  }

  let raw: unknown;
  try {
    raw = await c.req.json();
  } catch {
    return json(c, 400, { error: 'Invalid JSON body' });
  }

  const parsed = trafficNotifyBodySchema.safeParse(raw);
  if (!parsed.success) {
    return json(c, 400, { error: EXPECTED_BODY_ERROR });
  }

  const { type, payload, recipients } = parsed.data;

  // Real traffic emails skip localhost; test emails always send.
  if (
    type !== 'test' &&
    (payload as { environment?: string }).environment === 'localhost'
  ) {
    return json(c, 200, { ok: true, skipped: 'localhost' });
  }

  const email = buildEmail(type, payload);
  const to = resolveRecipients(recipients);
  const result = await sendResendEmail(c.env, { ...email, to });
  if (!result.ok) {
    return json(c, result.status, {
      error: result.error,
      details: 'details' in result ? result.details : undefined,
    });
  }
  return json(c, 200, { ok: true, id: result.id, to });
}
