# Firestore schema (portfolio)

Derived from client code in `src/services/firebaseAnalytics.js`, `src/services/trackingTokenService.js`, `src/services/authService.js`, `src/pages/Contact.js`, and `src/services/setupFirestoreAnalytics.js`. This is a **logical** schema for rules and maintenance, not an automatic export from production.

## Access model

| Actor | Role |
|--------|------|
| Anonymous visitors | Create/update analytics payloads, create enquiries, **get** a single tracking token by id (for `?ref=`), **increment-only** update on token `clicks` |
| Authenticated Google user (`users/{uid}`) | Read/write **only** their own user profile, with **`role` immutable** after create (set `humza` in Firebase Console for your account) |
| You (`role == "humza"` in `users/{uid}`) | Read/list all analytics, enquiries, stats; full CRUD on `analytics_tracking_tokens` |

## Collections

### `users/{userId}`

| Field | Type | Notes |
|-------|------|--------|
| `email` | string | From Google account |
| `displayName` | string \| null | |
| `photoURL` | string \| null | |
| `role` | string | Default `"user"` on create; **only promote to `humza` via Console / Admin SDK** |
| `createdAt` | timestamp | |
| `updatedAt` | timestamp | |

**Subcollections:** none in app code.

---

### `enquiries/{autoId}`

| Field | Type | Notes |
|-------|------|--------|
| `name` | string | Required on form |
| `email` | string \| null | |
| `phone` | string \| null | |
| `enquiry` | string | Message body |
| `timestamp` | timestamp | `serverTimestamp()` |
| `status` | string | App sets `"new"` on create |

**Subcollections:** none.

---

### `analytics_tracking_tokens/{tokenId}`

`tokenId` is lowercase alphanumeric, 8 chars (see `trackingTokenService.js`).

| Field | Type | Notes |
|-------|------|--------|
| `token` | string | Same as document id |
| `source` | string | Lowercased |
| `medium` | string \| null | |
| `campaign` | string \| null | |
| `label` | string \| null | |
| `createdAt` | timestamp | |
| `clicks` | int | Starts at `0` |
| `lastUsedAt` | timestamp | Set on anonymous click increment |

**Subcollections:** none.

---

### `analytics_visitors/{anonymizedIpDocId}`

Document id is derived from visitor IP (see `trackVisitor`), not a strict IPv4 pattern in all cases.

| Field | Type | Notes |
|-------|------|--------|
| `visitorId` | string | UUID |
| `code` | string | Full IP from client (sensitive) |
| `anonymizedIP` | string | |
| `firstVisit` | timestamp | Create path |
| `lastVisit` | timestamp | |
| `visits` | int | Incremented on return |
| `deviceInfo` | map | Browser, OS, screen, UA, etc. |
| `location` | map | city, region, country, coordinates, timezone, isp |
| `environment` | string | `"localhost"` \| `"production"` |
| `sessions` | array | Session objects: `sessionId`, `startTime`, `referrer`, `environment`, optional `campaign` |

**Subcollections:**

#### `analytics_visitors/{visitorId}/pageviews/{pageViewId}`

| Field | Type |
|-------|------|
| `path` | string |
| `title` | string |
| `timestamp` | timestamp |
| `pageViewId` | string |

---

### `analytics_pageviews/{pageViewId}`

Composite id: `{pathId}_{timestamp}_{sessionId}`.

| Field | Type | Notes |
|-------|------|--------|
| `visitorId` | string | |
| `anonymizedIP` | string | |
| `sessionId` | string | |
| `path` | string | |
| `title` | string | |
| `referrer` | string \| null | |
| `timestamp` | timestamp | |
| `environment` | string | |
| `timeSpent` | int | Seconds; 0 then updated |
| `pageViewId` | string | Same as doc id |
| `endTime` | timestamp | Set on update |
| `updatedAt` | timestamp | Server timestamp on update |

---

### `analytics_page_times/{timeDocId}`

`timeDocId` = `{pageViewId}_time`.

| Field | Type |
|-------|------|
| `pageViewId` | string |
| `visitorId` | string |
| `anonymizedIP` | string |
| `sessionId` | string |
| `path` | string |
| `timeSpent` | int |
| `startTime` | timestamp |
| `endTime` | timestamp |
| `timestamp` | timestamp |
| `environment` | string |

---

### `analytics_events/{eventId}`

`eventId` = `{category}_{action}_{timestamp}_{sessionId}`.

| Field | Type |
|-------|------|
| `category` | string |
| `action` | string |
| `label` | string \| null |
| `value` | number \| int \| null |
| `path` | string |
| `timestamp` | timestamp |
| `sessionId` | string |
| `visitorId` | string |
| `anonymizedIP` | string |
| `environment` | string |

---

### `analytics_media_clicks/{mediaClickId}`

`mediaClickId` = `media_{timestamp}_{sessionId}`.

| Field | Type |
|-------|------|
| `visitorId` | string |
| `anonymizedIP` | string |
| `sessionId` | string |
| `mediaType` | string | e.g. `image`, `video` |
| `mediaSrc` | string | |
| `mediaCaption` | string \| null |
| `projectPath` | string | |
| `timestamp` | timestamp |
| `environment` | string |

---

### `analytics_sessions/{sessionId}`

UUID session id.

| Field | Type |
|-------|------|
| `sessionId` | string |
| `visitorId` | string |
| `anonymizedIP` | string |
| `startTime` | timestamp |
| `endTime` | timestamp |
| `duration` | number | Seconds |
| `path` | string |
| `environment` | string |

---

### `analytics_stats/{docId}`

Fixed doc ids used by the app:

| docId | Purpose | Shape (high level) |
|-------|---------|---------------------|
| `visitors` | `total`, `lastUpdated` | |
| `pages` | Per-path counts + `total`, `lastUpdated` | Dynamic keys for paths |
| `events` | Per `category_action` counts + `total`, `lastUpdated` | Dynamic keys |
| `page_times` | Per-path `arrayUnion` of durations + `total`, `count`, `lastUpdated` | Dynamic keys |
| `media_clicks` | Per-path/type aggregates + `lastUpdated` | Dynamic keys |

Anonymous clients use `setDoc(..., { merge: true })` with `increment` / `arrayUnion`, so documents are **highly dynamic**. Rules rely on **allowed doc ids**, **bounded diff size** per write, and **no deletes** from anonymous users rather than a fixed key allowlist.

---

## Queries used by the Traffic dashboard

From `loadTrafficData.js` (all require **`humza`** under new rules):

- `analytics_visitors` — `orderBy('lastVisit', 'desc')`
- `analytics_pageviews` — `orderBy('timestamp', 'desc')`
- `analytics_events` — `orderBy('timestamp', 'desc')`
- `analytics_page_times` — `orderBy('timestamp', 'desc')`
- `analytics_media_clicks` — `orderBy('timestamp', 'desc')`
- `enquiries` — `orderBy('timestamp', 'desc')`
- `analytics_stats` — full collection read

Tracking token admin UI: `listTrackingTokens` — `orderBy('createdAt', 'desc')`.

---

## Operational notes

1. **Promote your user to `humza`** in the Firebase Console (or Admin SDK) on `users/{yourUid}` before relying on Traffic reads; new Google sign-ins still create `role: "user"` and cannot change it via the client.
2. **Deploy rules:** `firebase deploy --only firestore:rules`
3. If you add a collection or field, update this file and `firestore.rules` together (see `.cursor/firestore-rules-maintenance.md`).
