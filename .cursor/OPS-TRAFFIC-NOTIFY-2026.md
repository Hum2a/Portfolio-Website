# Traffic / notify ops checklist (launch)

## Secrets (required)

| Key | Where | Notes |
|-----|--------|-------|
| `RESEND_API_KEY` | Worker secret + `.dev.vars` only | **Never** ship in `VITE_*` |
| `NOTIFY_SECRET` | Worker secret | Random token; must **≠** Resend key |
| `VITE_TRAFFIC_NOTIFY_SECRET` | Client build `.env` | Same value as `NOTIFY_SECRET` |

As of 2026-08-03 a local rotate separated `NOTIFY_SECRET` / `VITE_TRAFFIC_NOTIFY_SECRET` from `RESEND_API_KEY` (they had been identical — Resend key risk via the browser bundle).

**Action required:** re-paste a valid `RESEND_API_KEY` from the Resend dashboard into `.env` and `.dev.vars`. A truncated key was briefly written during recovery and cleared; do **not** `wrangler versions deploy` the version that received the truncated `RESEND_API_KEY` until the real key is put again.

Undeployed secret versions (created during this pass) must only be deployed after `RESEND_API_KEY` is corrected:

```bash
# After pasting the real key into .dev.vars:
Get-Content .dev.vars | ? { $_ -match '^RESEND_API_KEY=' } | % { $_ -replace '^RESEND_API_KEY=','' } | npx wrangler versions secret put RESEND_API_KEY
npx wrangler versions deploy   # only when ready
```

## Local notify contract

```bash
npx wrangler dev --port 8787
# other terminal:
npm run verify:notify
```

Expect OPTIONS 204, NOAUTH 401, BAD 400, SKIP 200, TEST 200 (Resend send).

## Manual Traffic E2E (Google session)

1. Open `/humza-login`, sign in with the `humza` Google account.
2. Confirm Firestore user role is `humza` (see `.cursor/firestore-schema.md`).
3. Open `/traffic` — filters load visitor table.
4. Create a tracking token; open the ref link in a private window; confirm a visit appears.
5. Traffic notify UI: send a test email; confirm inbox for `humzab1711@hotmail.com` (or configured recipients).

## Production smoke

```bash
curl -sI https://humza-butt.space/api/traffic-notify
# POST with Bearer NOTIFY_SECRET + { "type":"test","payload":{} } should 200 when Resend is configured
```
