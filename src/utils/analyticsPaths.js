/** Paths excluded from analytics (admin-only, e.g. Traffic dashboard). */
export const EXCLUDED_ANALYTICS_PATHS = ['/traffic'];

export const normalizeAnalyticsPath = (path) => {
  if (!path || typeof path !== 'string') return '/';
  const withoutQuery = path.split('?')[0].trim();
  if (!withoutQuery) return '/';
  const normalized =
    withoutQuery.length > 1 && withoutQuery.endsWith('/')
      ? withoutQuery.slice(0, -1)
      : withoutQuery;
  return normalized.toLowerCase();
};

export const isExcludedAnalyticsPath = (path) => {
  const normalized = normalizeAnalyticsPath(path);
  return EXCLUDED_ANALYTICS_PATHS.some(
    (excluded) => normalized === excluded || normalized.startsWith(`${excluded}/`)
  );
};

/** Visitor counts if they have page views or sessions outside excluded paths. */
export const visitorHasNonAdminActivity = (visitor, pageViews = []) => {
  const ip = visitor?.anonymizedIP || visitor?.id;
  const visitorId = visitor?.visitorId;
  const hasPageView = pageViews.some(
    (pv) =>
      !isExcludedAnalyticsPath(pv.path) &&
      (pv.anonymizedIP === ip || (visitorId && pv.visitorId === visitorId))
  );
  if (hasPageView) return true;

  const sessions = Array.isArray(visitor?.sessions) ? visitor.sessions : [];
  return sessions.some(
    (s) =>
      !isExcludedAnalyticsPath(s.landingPath) &&
      !isExcludedAnalyticsPath(s.campaign?.landingPage)
  );
};
