/**
 * Prefetch helpers for route chunks. Safe to call repeatedly — the browser
 * dedupes identical dynamic imports.
 */

export function prefetchProjects(): void {
  void import('../pages/Projects');
}

const ROUTE_IMPORTERS: Record<string, () => Promise<unknown>> = {
  '/projects': () => import('../pages/Projects'),
  '/contact': () => import('../pages/Contact'),
  '/about': () => import('../pages/About'),
  '/github': () => import('../pages/GitHub'),
  '/career': () => import('../pages/LinkedIn'),
  '/humza-login': () => import('../pages/HumzaLogin'),
  '/traffic': () => import('../pages/Traffic'),
};

/** Loads the chunk for `pathname`. Unknown non-root paths are treated as case studies. */
export function prefetchRoute(pathname: string): Promise<unknown> {
  if (pathname === '/') return Promise.resolve();
  const importer =
    ROUTE_IMPORTERS[pathname] ?? (() => import('../pages/ProjectCaseStudyPage'));
  return importer().catch(() => undefined);
}

/** Resolves when the chunk loads or after `ms`, whichever is first. */
export function prefetchRouteWithin(pathname: string, ms = 900): Promise<void> {
  return Promise.race([
    prefetchRoute(pathname).then(() => undefined),
    new Promise<void>((r) => window.setTimeout(r, ms)),
  ]);
}
