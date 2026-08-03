/**
 * Prefetch helpers for route chunks. Safe to call repeatedly — the browser
 * dedupes identical dynamic imports.
 */

export function prefetchProjects(): void {
  void import('../pages/Projects');
}
