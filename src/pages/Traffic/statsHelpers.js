import { getDayKey } from '../../services/analyticsStatsUpdater';

const MS_DAY = 24 * 60 * 60 * 1000;

export function parseRollupStats(stats) {
  const s = stats == null ? {} : stats;
  const visitors = typeof s.visitors === 'object' && s.visitors !== null ? s.visitors : {};
  const pages = typeof s.pages === 'object' && s.pages !== null ? s.pages : {};
  const pageTimes = typeof s.page_times === 'object' && s.page_times !== null ? s.page_times : {};
  const events = typeof s.events === 'object' && s.events !== null ? s.events : {};
  const daily = typeof s.daily === 'object' && s.daily !== null ? s.daily : {};
  const refTokens = typeof s.ref_tokens === 'object' && s.ref_tokens !== null ? s.ref_tokens : {};
  const engagement = typeof s.engagement === 'object' && s.engagement !== null ? s.engagement : {};
  const campaigns = typeof s.campaigns === 'object' && s.campaigns !== null ? s.campaigns : {};
  const contactForms = typeof s.contact_forms === 'object' && s.contact_forms !== null ? s.contact_forms : {};
  const mediaClicks = typeof s.media_clicks === 'object' && s.media_clicks !== null ? s.media_clicks : {};
  const scrollDepth = typeof s.scroll_depth === 'object' && s.scroll_depth !== null ? s.scroll_depth : {};

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

function dayKeyInRange(dayKey, start, end) {
  const ts = new Date(dayKey).getTime();
  if (isNaN(ts)) return false;
  if (start) {
    const startMs = new Date(start);
    startMs.setHours(0, 0, 0, 0);
    if (ts < startMs.getTime()) return false;
  }
  if (end) {
    const endMs = new Date(end);
    endMs.setHours(23, 59, 59, 999);
    if (ts > endMs.getTime()) return false;
  }
  return true;
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

export function getDailySeriesInRange(dailyDoc, dateFilter, productionOnly = false) {
  if (!dateFilter) return [];
  const daysMap = dailyDoc?.days || {};
  return Object.entries(daysMap)
    .map(([name, bucket]) => {
      if (!dayKeyInRange(name, dateFilter.start, dateFilter.end)) return null;
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

export function sumDailyBucketsInRange(dailyDoc, dateFilter, productionOnly = false) {
  const series = getDailySeriesInRange(dailyDoc, dateFilter, productionOnly);
  if (series.length === 0) return null;
  return series.reduce(
    (acc, day) => ({
      visitors: acc.visitors + day.visitors,
      pageViews: acc.pageViews + day.pageViews,
      refClicks: acc.refClicks + day.refClicks,
      sessionsEnded: acc.sessionsEnded + day.sessionsEnded,
      events: acc.events + day.events,
    }),
    { visitors: 0, pageViews: 0, refClicks: 0, sessionsEnded: 0, events: 0 }
  );
}

export function getTimeRangeLabel(timeRange, dateRange, formatDateForInput) {
  switch (timeRange) {
    case 'today':
      return 'Today';
    case '7d':
      return 'Last 7 days';
    case '30d':
      return 'Last 30 days';
    case '90d':
      return 'Last 90 days';
    case 'custom':
      if (dateRange.start && dateRange.end) {
        return `${formatDateForInput(dateRange.start)} – ${formatDateForInput(dateRange.end)}`;
      }
      if (dateRange.start) return `From ${formatDateForInput(dateRange.start)}`;
      if (dateRange.end) return `Until ${formatDateForInput(dateRange.end)}`;
      return 'Custom range';
    case 'all':
    default:
      return 'All time';
  }
}

export function computeRawCountsFromRecords({
  visitors = [],
  pageViews = [],
  events = [],
  pageTimes = [],
  mediaClicks = [],
}) {
  const totalTimeSpent = pageTimes.reduce((sum, pt) => sum + (pt.timeSpent || 0), 0);
  const avgTimeSpent =
    pageTimes.length > 0 ? parseFloat((totalTimeSpent / pageTimes.length).toFixed(1)) : 0;
  const sessionsEnded = pageTimes.length;
  const bounces = pageTimes.filter((pt) => (pt.timeSpent || 0) < 5).length;
  const sessionsOver30s = pageTimes.filter((pt) => (pt.timeSpent || 0) >= 30).length;
  let bounceRate = null;
  if (sessionsEnded > 0) {
    const rate = parseFloat(((bounces / sessionsEnded) * 100).toFixed(1));
    bounceRate = Number.isFinite(rate) ? rate : null;
  }
  const newVisitors = visitors.filter((v) => (v.visits || 0) <= 1).length;
  const returningVisitors = Math.max(0, visitors.length - newVisitors);

  return {
    localhostVisitors: visitors.filter((v) => v.environment === 'localhost').length,
    productionVisitors: visitors.filter((v) => v.environment === 'production').length,
    localhostPageViews: pageViews.filter((pv) => pv.environment === 'localhost').length,
    productionPageViews: pageViews.filter((pv) => pv.environment === 'production').length,
    localhostEvents: events.filter((e) => e.environment === 'localhost').length,
    productionEvents: events.filter((e) => e.environment === 'production').length,
    localhostPageTimes: pageTimes.filter((pt) => pt.environment === 'localhost').length,
    productionPageTimes: pageTimes.filter((pt) => pt.environment === 'production').length,
    localhostMediaClicks: mediaClicks.filter((mc) => mc.environment === 'localhost').length,
    productionMediaClicks: mediaClicks.filter((mc) => mc.environment === 'production').length,
    totalVisitors: visitors.length,
    totalPageViews: pageViews.length,
    totalEvents: events.length,
    totalPageTimes: pageTimes.length,
    totalMediaClicks: mediaClicks.length,
    avgTimeSpent,
    totalTimeSpent,
    newVisitors,
    returningVisitors,
    bounceRate,
    sessionsOver30s,
    contactFormSubmits: events.filter(
      (e) => e.category === 'contact' && (e.action === 'submit' || e.action === 'start')
    ).length,
  };
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
  const r = rollup ?? {};
  const v = r.visitors || {};
  const p = r.pages || {};
  const e = r.events || {};
  const pt = r.pageTimes || {};
  const mc = r.mediaClicks || {};
  const eng = r.engagement || {};
  const cf = r.contactForms || {};
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
    bounceRate: (() => {
      if (sessionsEnded > 0 && Number.isFinite(bounces) && Number.isFinite(sessionsEnded)) {
        const rate = parseFloat(((bounces / sessionsEnded) * 100).toFixed(1));
        if (Number.isFinite(rate)) return rate;
      }
      if (rawCounts.bounceRate != null && Number.isFinite(rawCounts.bounceRate)) {
        return rawCounts.bounceRate;
      }
      return null;
    })(),
    sessionsOver30s: eng.sessions_over_30s ?? rawCounts.sessionsOver30s ?? 0,
    contactFormSubmits: cf['action.submit'] ?? cf['action.start'] ?? 0,
    fromRollups: hasRollupVisitors,
  };
}
