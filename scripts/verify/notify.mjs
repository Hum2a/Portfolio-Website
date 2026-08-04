/**
 * Worker notify contract smoke test (OPTIONS / auth / zod / localhost skip).
 * Expects wrangler at VERIFY_WORKER_URL (default http://127.0.0.1:8787)
 * and NOTIFY_SECRET (default local-test-secret from .dev.vars).
 */
import { writeJson, ensureVerifyDir } from './lib.mjs';

const WORKER_URL =
  process.env.VERIFY_WORKER_URL || 'http://127.0.0.1:8787/api/traffic-notify';
const SECRET = process.env.NOTIFY_SECRET || 'local-test-secret';

async function req(label, init) {
  const r = await fetch(WORKER_URL, {
    ...init,
    signal: AbortSignal.timeout(10000),
  });
  const text = await r.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    body = text.slice(0, 200);
  }
  return { label, status: r.status, body };
}

async function main() {
  ensureVerifyDir();
  const rows = [];
  rows.push(await req('OPTIONS', { method: 'OPTIONS' }));
  rows.push(
    await req('NOAUTH', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'test', payload: {} }),
    })
  );
  rows.push(
    await req('BAD', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SECRET}`,
      },
      body: JSON.stringify({ type: 'nope', payload: {} }),
    })
  );
  rows.push(
    await req('SKIP', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SECRET}`,
      },
      body: JSON.stringify({
        type: 'new_visitor',
        payload: { environment: 'localhost' },
      }),
    })
  );
  rows.push(
    await req('TEST', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SECRET}`,
      },
      body: JSON.stringify({ type: 'test', payload: { note: 'phase7' } }),
    })
  );

  const pass =
    rows.find((r) => r.label === 'OPTIONS')?.status === 204 &&
    rows.find((r) => r.label === 'NOAUTH')?.status === 401 &&
    rows.find((r) => r.label === 'BAD')?.status === 400 &&
    rows.find((r) => r.label === 'SKIP')?.status === 200;

  const summary = { workerUrl: WORKER_URL, pass, rows };
  writeJson('notify-summary.json', summary);
  console.log(JSON.stringify(summary, null, 2));
  if (!pass) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
