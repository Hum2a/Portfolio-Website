import { Hono } from 'hono';
import type { WorkerBindings } from './env';
import { handleTrafficNotifyPost } from './notify/route';

const app = new Hono<{ Bindings: WorkerBindings }>();

const CANONICAL_HOST = 'humza-butt.space';

/** Hosts that should 301 to the canonical apex (when DNS points here). */
const REDIRECT_HOSTS = new Set([
  'www.humza-butt.space',
  'humzabutt.com',
  'www.humzabutt.com',
  'humza-butt.com',
  'www.humza-butt.com',
  'humza-butt.onrender.com',
]);

function isLocalDevHost(host: string): boolean {
  return (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host.endsWith('.localhost') ||
    host.endsWith('.workers.dev')
  );
}

function canonicalRedirect(request: Request): Response | null {
  const url = new URL(request.url);
  const host = url.hostname.toLowerCase();
  if (host === CANONICAL_HOST || isLocalDevHost(host)) return null;
  if (!REDIRECT_HOSTS.has(host) && !host.endsWith('.onrender.com')) return null;

  url.protocol = 'https:';
  url.hostname = CANONICAL_HOST;
  url.port = '';
  return Response.redirect(url.toString(), 301);
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
  'Access-Control-Max-Age': '86400',
};

app.use('*', async (c, next) => {
  const redirected = canonicalRedirect(c.req.raw);
  if (redirected) return redirected;
  await next();
});

app.options('/api/traffic-notify', (c) =>
  c.body(null, 204, corsHeaders)
);

app.post('/api/traffic-notify', async (c) => {
  const res = await handleTrafficNotifyPost(c);
  const headers = new Headers(res.headers);
  headers.set('Access-Control-Allow-Origin', '*');
  return new Response(res.body, { status: res.status, headers });
});

app.all('/api/traffic-notify', (c) =>
  c.json(
    { error: 'Method not allowed' },
    405,
    { 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' }
  )
);

// Assets: Worker runs first so host redirects apply to all paths.
app.all('*', async (c) => {
  if (c.env.ASSETS) {
    return c.env.ASSETS.fetch(c.req.raw);
  }
  return c.json({ error: 'Not found' }, 404, { 'Cache-Control': 'no-store' });
});

export default app;
