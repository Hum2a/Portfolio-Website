import { getDayKey } from '../../services/analyticsStatsUpdater';

const MS_DAY = 24 * 60 * 60 * 1000;

export function parseRollupStats(stats = {}) {
  const visitors = stats.visitors || {};
  const pages = stats.pages || {};
  const pageTimes = stats.page_times || {};
  const events = stats.events || {};
  const daily = stats.daily || {};
  const refTokens = stats.ref_tokens || {};
  const engagement = stats.engagement || {};
  const campaigns = stats.campaigns || {};
  const contactForms = stats.contact_forms || {};
  const mediaClicks = stats.media_clicks || {};
  const scrollDepth = stats.scroll_depth || {};

  return {
    visitors,
    pages,
    pageTimes,
    events,
    daily,
    refTokens,
    engagement,
    campaigns,
    contactForms,
    mediaClicks,
    scrollDepth,
  };
}

export function getDailySeries(dailyDoc, { days = 30, productionOnly = false } = {}) {
  const daysMap = dailyDoc?.days || {};
  const cutoff = Date.now() - days * MS_DAY;

  return Object.entries(daysMap)
    .map(([name, bucket]) => {
      const ts = new Date(name).getTime();
      if (isNaN(ts) || ts < cutoff) return null;
      const pick = (key) =>
        productionOnly ? bucket[`prod_${key}`] || 0 : bucket[key] || 0;
      return {
        name,
        visitors: pick('visitors'),
        pageViews: pick('pageViews'),
        refClicks: pick('refClicks'),
        sessionsEnded: pick('sessionsEnded'),
        events: pick('events'),
      };
    })
    .filter(Boolean)
    .sort((a, b) => new Date(a.name) - new Date(b.name));
}

export function getLast24hSummary(dailyDoc, productionOnly = false) {
  const today = getDayKey();
  const yesterday = getDayKey(new Date(Date.now() - MS_DAY));
  const daysMap = dailyDoc?.days || {};
  const sumBucket = (bucket) => {
    if (!bucket) return { visitors: 0, pageViews: 0, refClicks: 0, sessionsEnded: 0 };
    const pick = (k) => (productionOnly ? bucket[`prod_${k}`] : bucket[k]) || 0;
    return {
      visitors: pick('visitors'),
      pageViews: pick('pageViews'),
      refClicks: pick('refClicks'),
      sessionsEnded: pick('sessionsEnded'),
    };
  };
  const a = sumBucket(daysMap[today]);
  const b = sumBucket(daysMap[yesterday]);
  return {
    visitors: a.visitors + b.visitors,
    pageViews: a.pageViews + b.pageViews,
    refClicks: a.refClicks + b.refClicks,
    sessionsEnded: a.sessionsEnded + b.sessionsEnded,
  };
}

export function mapDimensionCounts(doc, prefix, productionOnly = false) {
  const fieldPrefix = productionOnly ? `prod_${prefix}` : prefix;
  const result = [];
  Object.entries(doc || {}).forEach(([key, value]) => {
    if (typeof value !== 'number') return;
    if (!key.startsWith(`${fieldPrefix}.`)) return;
    result.push({ name: key.slice(fieldPrefix.length + 1), value });
  });
  return result.sort((a, b) => b.value - a.value);
}

export function getRefTokenRollup(refTokensDoc, tokenId) {
  if (!tokenId || !refTokensDoc?.tokens) return null;
  const token = tokenId.toLowerCase().trim().replace(/[./\[\]#$]/g, '_');
  const data = refTokensDoc.tokens[token];
  if (!data) return null;

  const days = data.days || {};
  const visitsOverTime = Object.entries(days)
    .map(([name, visits]) => ({ name, visits: typeof visits === 'number' ? visits : 0 }))
    .sort((a, b) => new Date(a.name) - new Date(b.name))
    .slice(-30);

  return {
    clicks: data.clicks || 0,
    prodClicks: data.prod_clicks || 0,
    sessions: data.sessions || 0,
    visitsOverTime,
    lastUsedAt: data.lastUsedAt,
  };
}

export function getPageTimeAverages(pageTimesDoc) {
  const averages = [];
  Object.keys(pageTimesDoc || {}).forEach((key) => {
    if (!key.endsWith('_sum')) return;
    const base = key.replace(/_sum$/, '');
    const sum = pageTimesDoc[`${base}_sum`] || pageTimesDoc[key];
    const count = pageTimesDoc[`${base}_count`] || 0;
    if (count > 0 && base.startsWith('path.')) {
      averages.push({
        path: base.replace(/^path\./, '').replace(/_/g, '/'),
        avgSeconds: Math.round(sum / count),
        count,
      });
    }
  });
  return averages.sort((a, b) => b.avgSeconds - a.avgSeconds);
}

export function mergeHeadlineStats(rollup, rawCounts, environmentFilter) {
  const v = rollup.visitors || {};
  const p = rollup.pages || {};
  const e = rollup.events || {};
  const pt = rollup.pageTimes || {};
  const mc = rollup.mediaClicks || {};
  const eng = rollup.engagement || {};
  const cf = rollup.contactForms || {};
  const prodOnly = environmentFilter === 'production';
  const localOnly = environmentFilter === 'localhost';

  const hasRollupVisitors = typeof v.total === 'number' && v.total > 0;

  const visitorsTotal = prodOnly
    ? v.prod_total ?? rawCounts.productionVisitors
    : localOnly
      ? v.local_total ?? rawCounts.localhostVisitors
      : hasRollupVisitors
        ? v.total
        : rawCounts.totalVisitors;

  const pageViewsTotal = prodOnly
    ? p.prod_total ?? rawCounts.productionPageViews
    : localOnly
      ? p.local_total ?? rawCounts.localhostPageViews
      : typeof p.total === 'number'
        ? p.total
        : rawCounts.totalPageViews;

  const sessionsEnded = prodOnly ? eng.prod_sessionsEnded ?? eng.sessionsEnded : eng.sessionsEnded;
  const bounces = prodOnly ? eng.prod_bounce_under_5s ?? eng.bounce_under_5s : eng.bounce_under_5s;

  return {
    ...rawCounts,
    totalVisitors: visitorsTotal ?? 0,
    productionVisitors: v.prod_total ?? rawCounts.productionVisitors ?? 0,
    localhostVisitors: v.local_total ?? rawCounts.localhostVisitors ?? 0,
    returningVisitors: v.returning ?? rawCounts.returningVisitors ?? 0,
    newVisitors: v.newVisitors ?? rawCounts.newVisitors ?? 0,
    totalPageViews: pageViewsTotal ?? 0,
    productionPageViews: p.prod_total ?? rawCounts.productionPageViews ?? 0,
    localhostPageViews: p.local_total ?? rawCounts.localhostPageViews ?? 0,
    totalEvents: (prodOnly ? e.prod_total : e.total) ?? rawCounts.totalEvents ?? 0,
    productionEvents: e.prod_total ?? rawCounts.productionEvents ?? 0,
    localhostEvents: e.local_total ?? rawCounts.localhostEvents ?? 0,
    totalPageTimes: (prodOnly ? pt.prod_count : pt.count) ?? rawCounts.totalPageTimes ?? 0,
    productionPageTimes: pt.prod_count ?? rawCounts.productionPageTimes ?? 0,
    localhostPageTimes: rawCounts.localhostPageTimes ?? 0,
    totalMediaClicks: (prodOnly ? mc.prod_total : mc.total) ?? rawCounts.totalMediaClicks ?? 0,
    productionMediaClicks: mc.prod_total ?? rawCounts.productionMediaClicks ?? 0,
    localhostMediaClicks: rawCounts.localhostMediaClicks ?? 0,
    avgTimeSpent:
      pt.count > 0 ? parseFloat((pt.total / pt.count).toFixed(1)) : rawCounts.avgTimeSpent ?? 0,
    totalTimeSpent: pt.total ?? rawCounts.totalTimeSpent ?? 0,
    bounceRate:
      sessionsEnded > 0 ? parseFloat(((bounces / sessionsEnded) * 100).toFixed(1)) : null,
    sessionsOver30s: eng.sessions_over_30s ?? 0,
    contactFormSubmits: cf['action.submit'] ?? cf['action.start'] ?? 0,
    fromRollups: hasRollupVisitors,
  };
}
