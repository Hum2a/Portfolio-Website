# Traffic analytics port prompt — first-party portfolio tracking (Neon)

Copy everything below the horizontal rule into another portfolio project’s chat when you want that codebase’s agent to implement the same traffic-tracking product as Humza’s portfolio, using **Neon Postgres** instead of Firebase/Firestore.

---

## Instructions for the agent (paste from here)

You are implementing a **first-party traffic analytics + admin Traffic dashboard** for a personal portfolio website. The reference product lives on Humza’s portfolio (React SPA + Cloudflare Worker). Recreate the **behaviour and data model** described below, but store data in **Neon Postgres** (via Drizzle or similar) instead of Firestore. Prefer same-origin API routes on a Cloudflare Worker / Hono app if the target stack already uses that; otherwise add a small backend that the SPA can call.

Do **not** invent a lighter stub. Match the product scope: client tracking, rollups, admin UI, ref tokens, email notify, owner tagging, bot signals.

### Hard constraints

1. **Database = Neon Postgres** (not Firebase). Design SQL tables that mirror the collections below.
2. **Admin-only dashboard** — gate `/traffic` (or equivalent) behind the site owner’s auth (role check). Never leave analytics write/read open publicly.
3. **Do not store full public IPs** as a primary product field. Use **IPv4 /24 anonymization** (`a.b.c.0`) as the visitor key; on IP lookup failure use `anon_` + first 12 hex of SHA-256(visitorId). (The reference mistakenly also stored full IP in a `code` field — **omit that**; keep only anonymized keys.)
4. **Traffic notify secret ≠ Resend API key.** Client sends `Authorization: Bearer <NOTIFY_SECRET>`; Worker holds `RESEND_API_KEY` server-side only. Generate a random shared notify token.
5. **Skip email notify on localhost** (except an explicit “Send test email” action).
6. **Exclude the admin traffic path** from being tracked (e.g. `/traffic`).
7. Preserve **dual model**: append-only event tables **plus** rollup counters (or SQL aggregates that replace rollups with equivalent dashboard performance).

---

## 1. Product overview

Build:

| Surface | Purpose |
|---------|---------|
| **Client tracker** | On every public page load / navigation, record visitors, pageviews, page time, sessions, media clicks, contact submits, campaign/ref attribution |
| **Admin Traffic dashboard** | Owner-only UI: filters, stats, trends, visitors, events, emails, URL generator, tag/delete tools |
| **Notify Worker** | `POST /api/traffic-notify` → Resend emails for `new_visitor`, `ref_hit`, and `test` |
| **Ref / UTM tooling** | Create short `?ref=` tokens + UTM URL builder; attribute hits; optional compare codes |

No third-party analytics SaaS (no GA). First-party only.

---

## 2. Client-side tracking (what to capture)

### Identity & environment

- `visitorId`: UUID in `localStorage` (sticky).
- `sessionId`: UUID in `sessionStorage` (tab session).
- `anonymizedIP` / visitor key: sticky in `localStorage` after resolve:
  1. Fetch public IP (e.g. `https://api.ipify.org`).
  2. Store as **IPv4 /24**: `a.b.c.0`.
  3. On failure: `anon_{sha256(visitorId).slice(0,12)}`.
- `environment`: `"localhost"` | `"production"` (hostname-based).
- Device info: UA, browser, OS, device type; optional UA-CH; capture `doNotTrack` / GPC for display only (do **not** auto-disable tracking unless you add consent later).

### Events / records

| Capture | When | Notes |
|---------|------|--------|
| Upsert visitor | App init | first/last visit, visit count, device, location, traffic signals, sessions[] |
| Pageview | Init + every route change | path, title, referrer, sessionId, timestamp |
| Page time | Route leave / `beforeunload` | seconds on page; link to pageViewId |
| Session end | `beforeunload` | duration, landing/exit path, pageCount, optional ref/campaign |
| Media click | Project image/video clicks | mediaType, src, caption, projectPath + event `media`/`click` |
| Contact submit | Contact form success | event `contact`/`submit` |
| Optional career filter | Filter chips | event `career`/`filter` |
| Ref attribution | Landing with `?ref=` (or same-origin referrer `?ref=`) | increment token clicks; write ref_hit; email only for real URL attribution |
| New visitor email | After geo enrich, **first visit only** | `notifyTrafficEvent('new_visitor', …)` |

**Excluded path:** do not track visits to the Traffic admin route.

**Campaign attribution priority:**

1. `?ref=` on landing URL  
2. `?ref=` on same-origin `document.referrer`  
3. UTM / `source` query params  
4. Cookie `_pb_ref` (90 days, SameSite=Lax) holding `{ source, medium, campaign, refToken }`

**Ref URL shape:** `{origin}{path}?ref={8-char [a-z0-9] token}`  
**UTM shape:** `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`

### Geo & bot signals

- Resolve location via ipinfo (optional token) with geojs (or similar) fallback: city, region, country, coordinates, timezone, isp.
- Compute **traffic signals** on the visitor: `isLikelyBot`, `botScore`, `botReasons[]`, VPN/proxy/tor/hosting hints if available, timezone mismatch.
- Admin UI can “hide likely bots”.

### Master switch

Env flag e.g. `VITE_ENABLE_ANALYTICS` / `REACT_APP_ENABLE_ANALYTICS` (default on in prod).

---

## 3. Neon data model (map from Firestore collections)

Use snake_case tables. Suggested schema (adapt types as needed):

### Core

```text
analytics_visitors
  anonymized_ip TEXT PRIMARY KEY   -- a.b.c.0 or anon_*
  visitor_id TEXT NOT NULL
  first_visit TIMESTAMPTZ
  last_visit TIMESTAMPTZ
  visits INT DEFAULT 1
  device_info JSONB
  location JSONB
  traffic_signals JSONB
  environment TEXT                 -- localhost | production
  sessions JSONB                   -- array of session summaries (or normalize to analytics_sessions only)
  created_at / updated_at

analytics_pageviews
  id TEXT PRIMARY KEY
  visitor_id, anonymized_ip, session_id
  path, title, referrer
  timestamp, environment
  time_spent NUMERIC, end_time     -- filled when page time recorded

analytics_page_times
  id TEXT PRIMARY KEY
  page_view_id, visitor_id, anonymized_ip, session_id
  path, time_spent, start_time, end_time, timestamp, environment

analytics_events
  id TEXT PRIMARY KEY
  category, action, label, value
  path, visitor_id, anonymized_ip, session_id, environment, timestamp

analytics_media_clicks
  id TEXT PRIMARY KEY
  media_type, media_src, media_caption, project_path
  visitor_id, anonymized_ip, session_id, environment, timestamp

analytics_sessions
  session_id TEXT PRIMARY KEY
  visitor_id, anonymized_ip
  start_time, end_time, duration
  landing_path, exit_path, page_count
  ref_token, campaign_source, environment

analytics_ref_hits
  id TEXT PRIMARY KEY
  ref_token, visitor_id, anonymized_ip, session_id
  landing_page, timestamp, environment

analytics_tracking_tokens
  token TEXT PRIMARY KEY           -- 8 chars [a-z0-9]
  source, medium, campaign, label
  created_at, clicks INT, last_used_at

analytics_owner_tags
  anonymized_ip TEXT PRIMARY KEY
  label TEXT                       -- 'Mine' | 'Claude Cowork' | custom
  tagged_at, visitor_id

analytics_email_log
  id UUID PRIMARY KEY
  type TEXT                        -- new_visitor | ref_hit | test
  subject, from_email
  recipients TEXT[]
  status TEXT                      -- sending | sent | failed
  resend_id, error
  summary JSONB, payload JSONB
  created_at, sent_at

analytics_notify_settings          -- single-row or key/value
  id TEXT PRIMARY KEY              -- e.g. 'default'
  recipients TEXT[]                -- EXTRA recipients only
  updated_at

enquiries (if contact form already exists, reuse)
  name, email, phone, message, timestamp, status
```

### Rollups (or replace with SQL views/materialized aggregates)

Reference uses merge-increment docs. Either:

- **Option A:** `analytics_stats` table with `doc_id` + `metrics JSONB` and atomic increments in transactions, or  
- **Option B:** drop rollup writes and power the dashboard with indexed SQL aggregates / daily buckets.

If keeping rollups, cover metrics equivalent to:

| Bucket | Metrics |
|--------|---------|
| visitors | total, new, returning, by country/device/browser, prod vs local |
| pages | total, per-path counts |
| page_times | sum/count, per-path |
| events | total, per category_action |
| media_clicks | total, per path/type |
| ref_tokens | clicks/sessions/days per token |
| campaigns | by source/medium/campaign/combo |
| engagement | sessionsEnded, bounce_under_5s, sessions_over_30s, sessions_3plus_pages, duration |
| contact_forms | total by action |
| daily | `YYYY-MM-DD` buckets for headline charts |

**Admin load:** support filtering with reasonable limits (reference loads ~800 recent rows per stream). Prefer pagination or date-bounded queries on Neon.

---

## 4. Email notifications (Worker → Resend)

### Endpoint

`POST /api/traffic-notify`

Headers: `Authorization: Bearer <NOTIFY_SECRET>`, `Content-Type: application/json`

Body:

```json
{
  "type": "new_visitor" | "ref_hit" | "test",
  "payload": { /* visitor/campaign/location/device object */ },
  "recipients": ["extra@example.com"]
}
```

### Behaviour

- Validate secret.
- Resolve recipients: **always include a hardcoded default To**, merge extras (cap ~20), validate emails.
- Skip send when `type !== "test"` and `payload.environment === "localhost"` (return `{ ok: true, skipped: "localhost" }`).
- Build a **professional HTML email** with type-based colour themes:
  - `new_visitor` — indigo
  - `ref_hit` — teal
  - `test` — amber
- Include highlight chips (location / IP key / landing or source / token), card sections, JSON appendix.
- Send via Resend (`RESEND_API_KEY`, verified From address).
- Client logs each attempt to `analytics_email_log` (status sending → sent/failed).

### Client helper

`notifyTrafficEvent(type, payload)` — fire-and-forget for real traffic; `sendTestNotifyEmail()` — awaited, works from localhost, logs result.

### Secrets

| Secret | Where |
|--------|--------|
| `NOTIFY_SECRET` | Worker + same value in client env as soft gate |
| `RESEND_API_KEY` | Worker only |
| Optional `IPINFO_TOKEN` | Client or Worker for geo |

Provide a **secrets sync script** that **upserts** secrets one-by-one (`wrangler secret put`) and **never** uses a destructive bulk replace. Also set `keep_vars: true` on deploy so dashboard vars are not wiped.

---

## 5. Admin Traffic dashboard (owner-only)

Route e.g. `/traffic`, role-gated.

### Sections

1. **URL generator** — create ref tokens and UTM links; presets (LinkedIn, CV, Discord, GitHub, email, etc.); copy URL; list/edit/delete tokens; compare two codes; drill into hits.
2. **Email notifications** — show From address; manage extra recipients; **Send test email**.
3. **Filters** — environment (`all` / `production` / `localhost`); date range (`all` / `today` / `7d` / `30d` / `90d` / custom); exclude admin paths; hide likely bots; country click-to-filter.
4. **Owner devices** — “Tag this browser as mine”; group tagged keys by label in **collapsible count buttons** (e.g. `CLAUDE COWORK · 13`) expand to delete/untag rows — avoid huge scrolling lists.
5. **Auto-tag** — on admin data load, any visitor key matching `anon_*` that is untagged → batch-tag as **`Claude Cowork`** (headless / failed-IP browsers often from AI cowork tools). Labels: `Mine`, `Claude Cowork`.
6. **Stat cards** — visitors (new/returning), page views, events, countries, page times, avg time, bounce &lt;5s, contact submits, media clicks, last-24h / period banners.
7. **Tabs:**
   - Trends (charts)
   - Visitors (expandable: visits/sessions, device, signals, summary; tag Mine / Claude Cowork; delete all data for key)
   - Page Views / Events / Page Times / Media Clicks / Enquiries
   - Emails (log filter by type/status; test button)
   - Watch visitor (pick a visitor and follow activity)

### Destructive admin actions

- **Delete all analytics for a visitor key** — remove visitor row, pageviews, events, page times, media clicks, ref hits, sessions, owner tag (transactional). Confirm in UI.
- Tag / untag owner devices.

---

## 6. Implementation plan (recommended order)

1. **Neon schema + migrations** for tables above; enable RLS if the rest of the app uses it (owner-only policies for admin reads; careful with anonymous **inserts** from the public tracker — typically a Worker API with a write key or public insert endpoints that only allow insert of analytics shapes, never admin delete).
2. **Tracking API** (`POST /api/analytics/...`) — prefer server-side writes from the Worker so the DB is not exposed to the browser. Client SDK calls same-origin endpoints.
3. **Client SDK** — init on app mount; pageview/time tracker on router changes; media + contact hooks; campaign/ref cookie.
4. **Notify Worker route** + Resend + email log + recipients CRUD.
5. **Admin Traffic UI** — filters, stats, tabs, URL generator, owner tags, emails.
6. **Env / secrets** documentation and sync script.
7. **Smoke test:** localhost visit (tracked, no email) → production visit → ref link → test email → tag anon → delete one visitor.

### Suggested API surface (same-origin)

```text
POST /api/analytics/visitor
POST /api/analytics/pageview
POST /api/analytics/page-time
POST /api/analytics/session-end
POST /api/analytics/event
POST /api/analytics/media-click
POST /api/analytics/ref-hit

GET  /api/traffic/*          -- admin-gated reads + aggregates
POST /api/traffic/owner-tags
DELETE /api/traffic/visitor/:anonymizedIp
CRUD /api/traffic/tokens
CRUD /api/traffic/notify-recipients
POST /api/traffic-notify     -- shared with Resend path (or nest under /api/traffic/notify/send)
```

---

## 7. UX / copy notes from reference

- Collapsible owner-tag groups by label with counts (critical when many `anon_*` Claude Cowork tags exist).
- Colour-coded email templates (indigo / teal / amber).
- Ref tokens are short opaque codes, not human-readable sources (store source/medium/campaign on the token row).
- Dashboard should feel like an internal ops console, not a marketing page.

---

## 8. Explicit non-goals / do-not-copy bugs

- Do **not** leave public DB write rules open (reference Firestore was overly permissive — fix that on Neon/API).
- Do **not** put `RESEND_API_KEY` in the client bundle.
- Do **not** use the Resend key as `NOTIFY_SECRET`.
- Do **not** embed full IP in visitor documents.
- Optional features present but unused in reference UI (`scroll_depth`, contact form start) — implement only if useful.
- Consent banner: reference has none; add if the target portfolio needs GDPR cookie consent before tracking.

---

## 9. Acceptance checklist

- [ ] Public pages produce visitor + pageview + page time + session end in Neon  
- [ ] Contact submit and media clicks appear under Events / Media  
- [ ] `?ref=` token increments clicks and can trigger `ref_hit` email in production  
- [ ] New visitor triggers `new_visitor` email in production only  
- [ ] Localhost never sends real notify emails; test email works  
- [ ] `/traffic` (or equivalent) is owner-only  
- [ ] Filters (env, date, bots) work  
- [ ] Owner tag Mine / Claude Cowork; auto-tag `anon_*`  
- [ ] Tagged list is collapsed by label with expand  
- [ ] Delete visitor purges related rows  
- [ ] URL generator creates ref + UTM links  
- [ ] Email log shows sent/failed with Resend id  
- [ ] Secrets: Worker has `NOTIFY_SECRET` + `RESEND_API_KEY`; client has notify secret only  

---

## 10. Open decisions for the implementer

- Auth system for the owner role (Better Auth / Firebase Auth / etc.) — reuse whatever the portfolio already has.
- Whether tracking writes go browser→Worker→Neon only (recommended) vs browser→Neon with RLS.
- Rollup tables vs pure SQL aggregates.
- Default notify To / From addresses (must verify Resend domain).
- Whether to add cookie consent before enabling analytics.

---

**Maintainer note:** This prompt describes Humza’s portfolio traffic system (React + Firestore + Cloudflare Worker → Resend), remapped for Neon. When adapting, prefer the target repo’s existing Worker/Hono/Drizzle patterns over inventing a parallel stack.
