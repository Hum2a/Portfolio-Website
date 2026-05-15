/**
 * Derive trend metrics from loaded Traffic data (respects environment; uses full loaded window for time buckets).
 */

const MS_DAY = 24 * 60 * 60 * 1000;

function byEnv(row, environmentFilter) {
  if (environmentFilter === 'all') return true;
  return row.environment === environmentFilter;
}

function getTs(toDate, ts) {
  const d = toDate(ts);
  return d && !isNaN(d.getTime()) ? d.getTime() : null;
}

function bucketPaths(pageViews, environmentFilter, toDate, startMs, endMs) {
  const map = {};
  pageViews.forEach((pv) => {
    if (!byEnv(pv, environmentFilter)) return;
    const t = getTs(toDate, pv.timestamp);
    if (t == null || t < startMs || t > endMs) return;
    const p = pv.path || '(unknown)';
    map[p] = (map[p] || 0) + 1;
  });
  return map;
}

function dayKeyFromMs(ms) {
  const d = new Date(ms);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function dailySeries(pageViews, environmentFilter, toDate, days) {
  const now = Date.now();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const map = {};
  for (let i = days - 1; i >= 0; i--) {
    const t = todayStart.getTime() - i * MS_DAY;
    map[dayKeyFromMs(t)] = 0;
  }
  const minT = todayStart.getTime() - (days - 1) * MS_DAY;
  const maxT = now + MS_DAY;

  pageViews.forEach((pv) => {
    if (!byEnv(pv, environmentFilter)) return;
    const t = getTs(toDate, pv.timestamp);
    if (t == null || t < minT || t > maxT) return;
    const key = dayKeyFromMs(t);
    if (!Object.prototype.hasOwnProperty.call(map, key)) map[key] = 0;
    map[key] += 1;
  });

  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, views]) => ({ name, views }));
}

function uniqueVisitorKeys(visitors, environmentFilter, toDate, startMs, endMs) {
  const set = new Set();
  visitors.forEach((v) => {
    if (!byEnv(v, environmentFilter)) return;
    const t = getTs(toDate, v.lastVisit);
    if (t == null || t < startMs || t > endMs) return;
    set.add(v.anonymizedIP || v.id || v.visitorId);
  });
  return set.size;
}

function enquiryCount(enquiries, toDate, startMs, endMs) {
  let n = 0;
  enquiries.forEach((e) => {
    const t = getTs(toDate, e.timestamp);
    if (t == null || t < startMs || t > endMs) return;
    n += 1;
  });
  return n;
}

function pctChange(before, after) {
  if (before <= 0 && after <= 0) return 0;
  if (before <= 0 && after > 0) return 100;
  return ((after - before) / before) * 100;
}

function avgTimeByPath(pageTimes, environmentFilter, toDate, startMs, endMs) {
  const acc = {};
  pageTimes.forEach((pt) => {
    if (!byEnv(pt, environmentFilter)) return;
    const t = getTs(toDate, pt.startTime || pt.timestamp);
    if (t == null || t < startMs || t > endMs) return;
    const p = pt.path || '(unknown)';
    if (!acc[p]) acc[p] = { sum: 0, count: 0 };
    acc[p].sum += pt.timeSpent || 0;
    acc[p].count += 1;
  });
  const out = {};
  Object.entries(acc).forEach(([p, { sum, count }]) => {
    out[p] = count > 0 ? sum / count : 0;
  });
  return out;
}

export function computeTrafficTrends({
  pageViews = [],
  events = [],
  pageTimes = [],
  mediaClicks = [],
  visitors = [],
  enquiries = [],
  trackingTokens = [],
  environmentFilter = 'all',
  toDate,
}) {
  const now = Date.now();
  const recentStart = now - 7 * MS_DAY;
  const prevStart = now - 14 * MS_DAY;
  const prevEnd = recentStart;
  const d30 = now - 30 * MS_DAY;

  const recentPv = bucketPaths(pageViews, environmentFilter, toDate, recentStart, now);
  const prevPv = bucketPaths(pageViews, environmentFilter, toDate, prevStart, prevEnd);
  const recentViews = Object.values(recentPv).reduce((a, b) => a + b, 0);
  const prevViews = Object.values(prevPv).reduce((a, b) => a + b, 0);
  const viewMomentum = pctChange(prevViews, recentViews);

  const uvRecent = uniqueVisitorKeys(visitors, environmentFilter, toDate, recentStart, now);
  const uvPrev = uniqueVisitorKeys(visitors, environmentFilter, toDate, prevStart, prevEnd);
  const visitorMomentum = pctChange(uvPrev, uvRecent);

  const eqRecent = enquiryCount(enquiries, toDate, recentStart, now);
  const eqPrev = enquiryCount(enquiries, toDate, prevStart, prevEnd);
  const enquiryMomentum = pctChange(eqPrev, eqRecent);

  const paths = new Set([...Object.keys(recentPv), ...Object.keys(prevPv)]);
  const pathTrendRows = [];
  paths.forEach((path) => {
    const r = recentPv[path] || 0;
    const p = prevPv[path] || 0;
    const delta = pctChange(p, r);
    let label = 'stable';
    if (r === 0 && p === 0) label = 'flat';
    else if (p === 0 && r > 0) label = 'new';
    else if (delta > 15) label = 'hot';
    else if (delta < -15) label = 'cooling';
    pathTrendRows.push({ path, recent: r, previous: p, deltaPct: Math.round(delta * 10) / 10, label });
  });
  pathTrendRows.sort((a, b) => b.recent - a.recent);

  const avgRecent = avgTimeByPath(pageTimes, environmentFilter, toDate, recentStart, now);
  const avgPrev = avgTimeByPath(pageTimes, environmentFilter, toDate, prevStart, prevEnd);

  const engagementLeaders = pathTrendRows.slice(0, 15).map((row) => ({
    ...row,
    avgTimeRecent: avgRecent[row.path],
    avgTimePrev: avgPrev[row.path],
  }));

  const eventRecent = {};
  const eventPrev = {};
  events.forEach((e) => {
    if (!byEnv(e, environmentFilter)) return;
    const t = getTs(toDate, e.timestamp);
    if (t == null) return;
    const cat = e.category || 'other';
    if (t >= recentStart && t <= now) eventRecent[cat] = (eventRecent[cat] || 0) + 1;
    else if (t >= prevStart && t < prevEnd) eventPrev[cat] = (eventPrev[cat] || 0) + 1;
  });
  const cats = new Set([...Object.keys(eventRecent), ...Object.keys(eventPrev)]);
  const eventTrendRows = [...cats].map((name) => {
    const r = eventRecent[name] || 0;
    const p = eventPrev[name] || 0;
    return { name, recent: r, previous: p, deltaPct: Math.round(pctChange(p, r) * 10) / 10 };
  });
  eventTrendRows.sort((a, b) => b.recent - a.recent);

  const mediaRecent = mediaClicks.filter((mc) => {
    if (!byEnv(mc, environmentFilter)) return false;
    const t = getTs(toDate, mc.timestamp);
    return t != null && t >= recentStart;
  }).length;

  const mediaPrev = mediaClicks.filter((mc) => {
    if (!byEnv(mc, environmentFilter)) return false;
    const t = getTs(toDate, mc.timestamp);
    return t != null && t >= prevStart && t < prevEnd;
  }).length;

  const dailyPageViews30 = dailySeries(pageViews, environmentFilter, toDate, 30);

  const topRefLinks = [...(trackingTokens || [])]
    .sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
    .slice(0, 8)
    .map((t) => ({
      id: t.id,
      label: `${t.source || ''} · ${t.medium || ''}`,
      clicks: t.clicks || 0,
    }));

  const enquiries30 = enquiryCount(enquiries, toDate, d30, now);
  const visitors30 = uniqueVisitorKeys(visitors, environmentFilter, toDate, d30, now);
  const views30 = Object.values(bucketPaths(pageViews, environmentFilter, toDate, d30, now)).reduce((a, b) => a + b, 0);
  const enquiryRate = visitors30 > 0 ? (enquiries30 / visitors30) * 100 : 0;
  const viewsPerVisitor = visitors30 > 0 ? views30 / visitors30 : 0;

  const winners = pathTrendRows.filter((r) => r.label === 'hot' || r.label === 'new').slice(0, 5);
  const losers = pathTrendRows.filter((r) => r.label === 'cooling' && r.previous >= 3).slice(0, 5);

  const insights = [];
  if (recentViews === 0 && prevViews === 0) {
    insights.push('Not enough dated page views in the loaded sample to compare weeks. Try Refresh or widen your date filter to All time.');
  } else {
    if (viewMomentum > 10) insights.push(`Page views are up about ${Math.round(viewMomentum)}% vs the prior 7 days — momentum is positive.`);
    else if (viewMomentum < -10) insights.push(`Page views are down about ${Math.abs(Math.round(viewMomentum))}% week over week — worth checking top acquisition sources.`);
    else insights.push('Traffic is roughly flat week over week in the loaded sample.');
  }
  if (enquiryRate > 0) {
    insights.push(`Approx. ${enquiryRate.toFixed(1)}% of recent unique visitors (30d window, loaded data) correspond to an enquiry — a simple “intent” proxy.`);
  }
  insights.push(`Depth proxy: ~${viewsPerVisitor.toFixed(1)} page views per unique visitor in the last 30 days (industry teams often track 1.5–3+ for content sites).`);
  if (winners.length) insights.push(`Standout pages this week: ${winners.map((w) => w.path).join(', ')}.`);
  if (losers.length) insights.push(`Pages losing steam (were popular, now cooling): ${losers.map((w) => w.path).join(', ')}.`);

  return {
    summary: {
      recentViews,
      prevViews,
      viewMomentum: Math.round(viewMomentum * 10) / 10,
      uvRecent,
      uvPrev,
      visitorMomentum: Math.round(visitorMomentum * 10) / 10,
      eqRecent,
      eqPrev,
      enquiryMomentum: Math.round(enquiryMomentum * 10) / 10,
      mediaRecent,
      mediaPrev,
      enquiries30,
      visitors30,
      views30,
      enquiryRate: Math.round(enquiryRate * 10) / 10,
      viewsPerVisitor: Math.round(viewsPerVisitor * 10) / 10,
    },
    pathTrends: pathTrendRows,
    engagementLeaders,
    eventTrends: eventTrendRows,
    dailyPageViews30,
    topRefLinks,
    winners,
    losers,
    insights,
  };
}
