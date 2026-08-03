import { Hono } from 'hono';
import type { WorkerBindings } from './env';
import { handleTrafficNotifyPost } from './notify/route';

const app = new Hono<{ Bindings: WorkerBindings }>();

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
  'Access-Control-Max-Age': '86400',
};

app.options('/api/traffic-notify', (c) =>
  c.body(null, 204, corsHeaders)
);

app.post('/api/traffic-notify', async (c) => {
  const res = await handleTrafficNotifyPost(c);
  // Mirror legacy: always attach CORS on notify responses
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

// With run_worker_first limited to /api/*, non-API traffic is asset-served.
// Fallback for unexpected Worker invocations.
app.all('*', async (c) => {
  if (c.env.ASSETS) {
    return c.env.ASSETS.fetch(c.req.raw);
  }
  return c.json({ error: 'Not found' }, 404, { 'Cache-Control': 'no-store' });
});

export default app;
