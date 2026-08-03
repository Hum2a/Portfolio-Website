/**
 * Per reference-token analytics (drill-through, charts, visit table).
 */

export function toJsDate(timestamp) {
  if (!timestamp) return null;
  if (typeof timestamp.toDate === 'function') return timestamp.toDate();
  if (timestamp instanceof Date) return timestamp;
  const d = new Date(timestamp);
  return isNaN(d.getTime()) ? null : d;
}

function dateChartKey(d) {
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export function buildRefDrillData(tokenId, visitors, refHits) {
  if (!tokenId) return [];

  const token = tokenId.toLowerCase().trim();
  const sessionMatchesRef = (s) => {
    if (s.campaign?.refToken === tokenId || s.campaign?.refToken === token) return true;
    const lp = s.campaign?.landingPage || '';
    return lp.includes('ref=' + tokenId) || lp.includes('ref=' + token);
  };

  const hitToSession = (h) => ({
    sessionId: h.sessionId || `ref-hit-${h.id}`,
    startTime: h.timestamp,
    referrer: 'ref link',
    environment: h.environment,
    campaign: { refToken: token, landingPage: h.landingPage },
  });

  const byIP = new Map();

  (visitors || []).forEach((v) => {
    const matching = v.sessions?.filter(sessionMatchesRef) || [];
    if (matching.length > 0) {
      byIP.set(v.anonymizedIP || v.id, { ...v, matchingSessions: [...matching] });
    }
  });

  (refHits || []).forEach((h) => {
    if ((h.refToken || '').toLowerCase() !== token) return;
    const ip = h.anonymizedIP;
    if (!ip) return;

    let entry = byIP.get(ip);
    if (!entry) {
      const visitor = (visitors || []).find((v) => (v.anonymizedIP || v.id) === ip);
      entry = visitor
        ? { ...visitor, matchingSessions: [] }
        : {
            id: ip,
            anonymizedIP: ip,
            environment: h.environment,
            location: null,
            matchingSessions: [],
          };
      byIP.set(ip, entry);
    }

    const sess = hitToSession(h);
    if (!entry.matchingSessions.some((s) => s.sessionId === sess.sessionId)) {
      entry.matchingSessions.push(sess);
    }
  });

  return Array.from(byIP.values()).filter((v) => v.matchingSessions.length > 0);
}

export function buildRefTokenAnalytics(tokenId, visitors, refHits, tokenMeta = {}) {
  const drillVisitors = buildRefDrillData(tokenId, visitors, refHits);
  const token = tokenId.toLowerCase().trim();

  const visitsByDay = {};

  (refHits || []).forEach((h) => {
    if ((h.refToken || '').toLowerCase() !== token) return;
    const d = toJsDate(h.timestamp);
    if (!d) return;
    const key = dateChartKey(d);
    visitsByDay[key] = (visitsByDay[key] || 0) + 1;
  });

  if (Object.keys(visitsByDay).length === 0) {
    drillVisitors.forEach((v) => {
      (v.matchingSessions || []).forEach((s) => {
        const d = toJsDate(s.startTime);
        if (!d) return;
        const key = dateChartKey(d);
        visitsByDay[key] = (visitsByDay[key] || 0) + 1;
      });
    });
  }

  const visitsOverTime = Object.entries(visitsByDay)
    .map(([name, visits]) => ({ name, visits }))
    .sort((a, b) => new Date(a.name) - new Date(b.name))
    .slice(-30);

  const countryMap = {};
  drillVisitors.forEach((v) => {
    const country =
      v.location?.country && v.location.country !== 'Unknown' ? v.location.country : 'Unknown';
    countryMap[country] = (countryMap[country] || 0) + 1;
  });
  const visitorsByCountry = Object.entries(countryMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const deviceMap = {};
  drillVisitors.forEach((v) => {
    const device = v.deviceInfo?.deviceType || 'Unknown';
    deviceMap[device] = (deviceMap[device] || 0) + 1;
  });
  const visitorsByDevice = Object.entries(deviceMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const visitRows = [];
  drillVisitors.forEach((v) => {
    (v.matchingSessions || []).forEach((s) => {
      visitRows.push({
        id: s.sessionId || `${v.id}-${toJsDate(s.startTime)?.getTime() || 'na'}`,
        anonymizedIP: v.anonymizedIP || v.id,
        startTime: s.startTime,
        environment: s.environment || v.environment,
        location: v.location,
        deviceType: v.deviceInfo?.deviceType,
        browser: v.deviceInfo?.browser,
        referrer: s.referrer,
      });
    });
  });
  visitRows.sort((a, b) => {
    const da = toJsDate(a.startTime)?.getTime() || 0;
    const db = toJsDate(b.startTime)?.getTime() || 0;
    return db - da;
  });

  const totalSessions = visitRows.length;
  const uniqueVisitors = drillVisitors.length;

  return {
    drillVisitors,
    visitsOverTime,
    visitorsByCountry,
    visitorsByDevice,
    visitRows,
    summary: {
      uniqueVisitors,
      totalSessions,
      storedClicks: tokenMeta.clicks ?? 0,
      trackedVisits: totalSessions,
    },
  };
}
