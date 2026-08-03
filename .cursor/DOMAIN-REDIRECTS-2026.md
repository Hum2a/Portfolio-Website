# Domain redirects (launch)

## Canonical
`https://humza-butt.space`

## Cloudflare Worker (this repo)
[`worker/index.ts`](../worker/index.ts) 301s these Host headers to the apex when traffic hits this Worker:

- `www.humza-butt.space`
- `humzabutt.com` / `www.humzabutt.com`
- `humza-butt.com` / `www.humza-butt.com`
- `*.onrender.com` (only if that hostname is proxied through this Worker)

`wrangler.jsonc` sets `assets.run_worker_first: true` so redirects apply before static assets.

### Cloudflare dashboard (required for aliases)
1. Add each alias as a Custom Domain on the `humza-butt-portfolio` Worker (or as a DNS CNAME → Workers route).
2. Prefer apex + www both on Cloudflare; www should resolve to the Worker so the 301 runs.
3. Optional: Bulk Redirect / Page Rule as a belt-and-braces www → apex.

## Render (`humza-butt.onrender.com`)
Old Render still served **200** (not 301) as of 2026-08-03.

Options (pick one):

1. **Preferred:** Suspend/delete the Render web service and remove any custom domains pointing at it.
2. **Redirect service:** Redeploy Render as a static site from [`redirect/`](../redirect/) using [`render.yaml`](../render.yaml) so all paths 301/meta-refresh to `humza-butt.space`.

After change, verify:

```bash
curl -sI https://humza-butt.onrender.com | findstr /I "HTTP Location"
curl -sI https://www.humza-butt.space | findstr /I "HTTP Location"
```

Expect `301` + `Location: https://humza-butt.space/...`.
