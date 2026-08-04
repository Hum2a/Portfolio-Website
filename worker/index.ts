import { Hono } from 'hono';
import type { WorkerBindings } from './env';
import { handleTrafficNotifyPost } from './notify/route';

const app = new Hono<{ Bindings: WorkerBindings }>();

const CANONICAL_HOST = 'humza-butt.space';
const STAGING_HOST = 'portfolio-staging.humza-butt.space';

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

function isStagingHost(host: string): boolean {
  return host === STAGING_HOST;
}

function shouldNoIndex(host: string): boolean {
  return isStagingHost(host) || host.endsWith('.workers.dev');
}

function withNoIndex(response: Response, host: string): Response {
  if (!shouldNoIndex(host)) return response;
  const headers = new Headers(response.headers);
  headers.set('X-Robots-Tag', 'noindex, nofollow');
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function canonicalRedirect(request: Request): Response | null {
  const url = new URL(request.url);
  const host = url.hostname.toLowerCase();
  if (host === CANONICAL_HOST || isLocalDevHost(host) || isStagingHost(host)) {
    return null;
  }
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
  const host = new URL(c.req.url).hostname.toLowerCase();
  if (shouldNoIndex(host) && c.res) {
    c.res = withNoIndex(c.res, host);
  }
});

app.options('/api/traffic-notify', (c) =>
  c.body(null, 204, corsHeaders)
);

app.post('/api/traffic-notify', async (c) => {
  const res = await handleTrafficNotifyPost(c);
  const headers = new Headers(res.headers);
  headers.set('Access-Control-Allow-Origin', '*');
  const host = new URL(c.req.url).hostname.toLowerCase();
  return withNoIndex(
    new Response(res.body, { status: res.status, headers }),
    host
  );
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
  const host = new URL(c.req.url).hostname.toLowerCase();
  if (c.env.ASSETS) {
    const res = await c.env.ASSETS.fetch(c.req.raw);
    return withNoIndex(res, host);
  }
  return withNoIndex(
    c.json({ error: 'Not found' }, 404, { 'Cache-Control': 'no-store' }),
    host
  );
});

export default app;
