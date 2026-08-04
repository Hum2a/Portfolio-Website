/** Paths excluded from analytics (admin-only, e.g. Traffic dashboard). */
export const EXCLUDED_ANALYTICS_PATHS = ['/traffic'];

/** Legacy or alias paths → canonical path used in analytics storage/charts. */
export const ANALYTICS_PATH_ALIASES = {
  '/linkedin': '/career',
};

/** Friendly labels for Traffic charts and tables. */
export const ANALYTICS_PATH_LABELS = {
  '/': 'Home',
  '/career': 'Career',
  '/about': 'About',
  '/projects': 'Projects',
  '/contact': 'Contact',
  '/github': 'GitHub',
  '/humza-login': 'Login',
};

/** Main site pages for campaign URL landing targets. */
export const ANALYTICS_LANDING_PAGES = [
  { path: '/', label: 'Home' },
  { path: '/career', label: 'Career' },
  { path: '/projects', label: 'Projects' },
  { path: '/about', label: 'About' },
  { path: '/github', label: 'GitHub' },
  { path: '/contact', label: 'Contact' },
];

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

/** Normalize + resolve aliases (e.g. /linkedin → /career). */
export const canonicalizeAnalyticsPath = (path) => {
  const normalized = normalizeAnalyticsPath(path);
  return ANALYTICS_PATH_ALIASES[normalized] || normalized;
};

export const getAnalyticsPathLabel = (path) => {
  const canonical = canonicalizeAnalyticsPath(path);
  if (ANALYTICS_PATH_LABELS[canonical]) return ANALYTICS_PATH_LABELS[canonical];
  if (canonical.startsWith('/')) {
    const slug = canonical.slice(1);
    if (!slug) return 'Home';
    return slug
      .split('/')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' / ');
  }
  return canonical || 'Unknown';
};

export const isExcludedAnalyticsPath = (path) => {
  const normalized = canonicalizeAnalyticsPath(path);
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
