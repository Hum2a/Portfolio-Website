import { doc, setDoc, increment, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

/** Safe Firestore field segment (paths, tokens, labels). */
export function statKeySafe(str) {
  if (!str || typeof str !== 'string') return 'unknown';
  return str.replace(/[./[\]#$]/g, '_').slice(0, 120);
}

export function getDayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function isProduction(environment) {
  return environment === 'production';
}

function fireAndForget(promise) {
  promise.catch((err) => console.warn('analytics_stats update failed:', err));
}

async function mergeStatDoc(docId, data) {
  await setDoc(doc(db, 'analytics_stats', docId), { ...data, lastUpdated: serverTimestamp() }, { merge: true });
}

/** Daily rollups: days.{YYYY-MM-DD}.{metric} */
export async function bumpDaily(metrics, environment) {
  const day = getDayKey();
  const updates = { lastUpdated: serverTimestamp() };
  Object.entries(metrics).forEach(([metric, amount]) => {
    if (!amount) return;
    updates[`days.${day}.${metric}`] = increment(amount);
    if (isProduction(environment)) {
      updates[`days.${day}.prod_${metric}`] = increment(amount);
    }
  });
  await mergeStatDoc('daily', updates);
}

export async function bumpVisitorStats({ environment, isReturning, deviceInfo, location, includeCountry = true }) {
  const country = statKeySafe(location?.country || 'Unknown');
  const device = statKeySafe(deviceInfo?.deviceType || 'unknown');
  const browser = statKeySafe(deviceInfo?.browser || 'unknown');

  const updates = {
    total: increment(1),
    [`dim_device.${device}`]: increment(1),
    [`dim_browser.${browser}`]: increment(1),
  };
  // Country is usually recorded separately after IP geo enrichment resolves
  // (see bumpVisitorCountry), so the dim_country rollup reflects real
  // locations instead of the "Unknown" placeholder.
  if (includeCountry) updates[`dim_country.${country}`] = increment(1);

  if (isReturning) {
    updates.returning = increment(1);
  } else {
    updates.newVisitors = increment(1);
  }

  if (isProduction(environment)) {
    updates.prod_total = increment(1);
    if (isReturning) updates.prod_returning = increment(1);
    else updates.prod_newVisitors = increment(1);
    if (includeCountry) updates[`prod_dim_country.${country}`] = increment(1);
    updates[`prod_dim_device.${device}`] = increment(1);
  } else {
    updates.local_total = increment(1);
  }

  await mergeStatDoc('visitors', updates);
  await bumpDaily({ visitors: 1 }, environment);
}

/** Records the resolved country into the visitors rollup after geo enrichment. */
export async function bumpVisitorCountry({ country, environment }) {
  const safeCountry = statKeySafe(country || 'Unknown');
  const updates = {
    [`dim_country.${safeCountry}`]: increment(1),
  };
  if (isProduction(environment)) {
    updates[`prod_dim_country.${safeCountry}`] = increment(1);
  }
  await mergeStatDoc('visitors', updates);
}

export async function bumpPageViewStats(path, environment) {
  const safePath = statKeySafe(path);
  const updates = {
    total: increment(1),
    [`path.${safePath}`]: increment(1),
  };
  if (isProduction(environment)) {
    updates.prod_total = increment(1);
    updates[`prod_path.${safePath}`] = increment(1);
  } else {
    updates.local_total = increment(1);
  }
  await mergeStatDoc('pages', updates);
  await bumpDaily({ pageViews: 1 }, environment);
}

export async function bumpPageTimeStats(path, timeSpent, environment) {
  const safePath = statKeySafe(path);
  const updates = {
    total: increment(timeSpent),
    count: increment(1),
    [`path.${safePath}_sum`]: increment(timeSpent),
    [`path.${safePath}_count`]: increment(1),
  };
  if (isProduction(environment)) {
    updates.prod_total = increment(timeSpent);
    updates.prod_count = increment(1);
  }
  await mergeStatDoc('page_times', updates);
  await bumpDaily({ timeSpent }, environment);
}

export async function bumpEventStats(category, action, environment) {
  const eventKey = statKeySafe(`${category}_${action}`);
  const updates = {
    total: increment(1),
    [`event.${eventKey}`]: increment(1),
  };
  if (isProduction(environment)) updates.prod_total = increment(1);
  await mergeStatDoc('events', updates);
  await bumpDaily({ events: 1 }, environment);
}

export async function bumpMediaClickStats(projectPath, mediaType, environment) {
  const safePath = statKeySafe(projectPath);
  const type = statKeySafe(mediaType);
  const updates = {
    total: increment(1),
    [`path.${safePath}`]: increment(1),
    [`type.${type}`]: increment(1),
  };
  if (isProduction(environment)) updates.prod_total = increment(1);
  await mergeStatDoc('media_clicks', updates);
  await bumpDaily({ mediaClicks: 1 }, environment);
}

export async function bumpRefTokenStats(refToken, environment) {
  const token = statKeySafe(refToken.toLowerCase().trim());
  const day = getDayKey();
  const updates = {
    totalClicks: increment(1),
    [`tokens.${token}.clicks`]: increment(1),
    [`tokens.${token}.days.${day}`]: increment(1),
    [`tokens.${token}.lastUsedAt`]: serverTimestamp(),
  };
  if (isProduction(environment)) {
    updates[`tokens.${token}.prod_clicks`] = increment(1);
    updates.prod_totalClicks = increment(1);
  }
  await mergeStatDoc('ref_tokens', updates);
  await bumpDaily({ refClicks: 1, [`ref_${token}`]: 1 }, environment);
}

export async function bumpRefTokenSession(refToken, environment) {
  const token = statKeySafe(refToken.toLowerCase().trim());
  const updates = {
    [`tokens.${token}.sessions`]: increment(1),
  };
  if (isProduction(environment)) {
    updates[`tokens.${token}.prod_sessions`] = increment(1);
  }
  await mergeStatDoc('ref_tokens', updates);
}

export async function bumpCampaignStats(campaignData, environment) {
  if (!campaignData?.source) return;
  const source = statKeySafe(campaignData.source);
  const medium = statKeySafe(campaignData.medium || 'none');
  const campaign = statKeySafe(campaignData.campaign || 'none');
  const updates = {
    total: increment(1),
    [`source.${source}`]: increment(1),
    [`medium.${medium}`]: increment(1),
    [`campaign.${campaign}`]: increment(1),
    [`combo.${source}_${medium}_${campaign}`]: increment(1),
  };
  if (isProduction(environment)) updates.prod_total = increment(1);
  await mergeStatDoc('campaigns', updates);
}

export async function bumpEngagement({ duration, pageCount, environment }) {
  const updates = { sessionsEnded: increment(1) };
  if (duration < 5) updates.bounce_under_5s = increment(1);
  if (duration >= 30) updates.sessions_over_30s = increment(1);
  if (pageCount >= 3) updates.sessions_3plus_pages = increment(1);
  updates.totalDuration = increment(Math.floor(duration));
  updates.durationCount = increment(1);
  if (isProduction(environment)) {
    updates.prod_sessionsEnded = increment(1);
    if (duration < 5) updates.prod_bounce_under_5s = increment(1);
    if (duration >= 30) updates.prod_sessions_over_30s = increment(1);
  }
  await mergeStatDoc('engagement', updates);
  await bumpDaily({ sessionsEnded: 1 }, environment);
}

export async function bumpContactForm(action, environment) {
  const key = statKeySafe(action);
  const updates = {
    total: increment(1),
    [`action.${key}`]: increment(1),
  };
  if (isProduction(environment)) updates.prod_total = increment(1);
  await mergeStatDoc('contact_forms', updates);
  await bumpDaily({ contactForms: 1 }, environment);
}

export async function bumpScrollDepth(depthPercent, path, environment) {
  const depth = [25, 50, 75, 90].includes(depthPercent) ? depthPercent : statKeySafe(String(depthPercent));
  const safePath = statKeySafe(path);
  const updates = {
    total: increment(1),
    [`depth.${depth}`]: increment(1),
    [`path.${safePath}_depth_${depth}`]: increment(1),
  };
  if (isProduction(environment)) updates.prod_total = increment(1);
  await mergeStatDoc('scroll_depth', updates);
}

export function trackVisitorStats(payload) {
  fireAndForget(bumpVisitorStats(payload));
}

export function trackVisitorCountryStats(payload) {
  fireAndForget(bumpVisitorCountry(payload));
}

export function trackPageViewStats(path, environment) {
  fireAndForget(bumpPageViewStats(path, environment));
}

export function trackPageTimeStats(path, timeSpent, environment) {
  fireAndForget(bumpPageTimeStats(path, timeSpent, environment));
}

export function trackEventStats(category, action, environment) {
  fireAndForget(bumpEventStats(category, action, environment));
}

export function trackMediaClickStats(projectPath, mediaType, environment) {
  fireAndForget(bumpMediaClickStats(projectPath, mediaType, environment));
}

export function trackRefTokenStats(refToken, environment, { includeSession = false } = {}) {
  fireAndForget(
    (async () => {
      await bumpRefTokenStats(refToken, environment);
      if (includeSession) await bumpRefTokenSession(refToken, environment);
    })()
  );
}

export function trackCampaignStats(campaignData, environment) {
  fireAndForget(bumpCampaignStats(campaignData, environment));
}

export function trackEngagementStats(payload) {
  fireAndForget(bumpEngagement(payload));
}

export function trackContactFormStats(action, environment) {
  fireAndForget(bumpContactForm(action, environment));
}

export function trackScrollDepthStats(depth, path, environment) {
  fireAndForget(bumpScrollDepth(depth, path, environment));
}
