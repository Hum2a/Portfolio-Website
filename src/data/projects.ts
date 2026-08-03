import projectsData from '../config/projects.json';

export type ProjectCategoryId =
  | 'website'
  | 'mobile'
  | 'desktop'
  | 'extension'
  | 'library'
  | 'game';

export type CaseStudyMetric = { value: string; label: string };
export type CaseStudySection = {
  title: string;
  body: string;
  image: string;
  imageAlt: string;
};
export type CaseStudyDecision = {
  choice: string;
  why: string;
  tradeoff: string;
};

export type ProjectCaseStudy = {
  claim: string;
  role: string;
  timeline: string;
  metrics: CaseStudyMetric[];
  problem: string;
  sections: CaseStudySection[];
  decisions: CaseStudyDecision[];
  outcome: string;
};

export interface Project {
  id: string;
  name: string;
  route: string;
  description?: string;
  tags: string[];
  categories?: ProjectCategoryId[];
  logo?: string;
  gradient?: string;
  visible?: boolean;
  featured?: boolean;
  priority?: number;
  date?: string;
  dateAdded?: string;
  dateUpdated?: string;
  liveUrl?: string;
  repoUrl?: string;
  /** When true, attempt iframe embed; default false — never ship a failing iframe */
  embeddable?: boolean;
  caseStudy?: ProjectCaseStudy;
  [key: string]: unknown;
}

/** Display order for category filter chips */
export const PROJECT_CATEGORY_ORDER: ProjectCategoryId[] = [
  'website',
  'mobile',
  'desktop',
  'extension',
  'library',
  'game',
];

/** Labels and styling keys for project surfaces */
export const PROJECT_CATEGORY_META: Record<
  ProjectCategoryId,
  { id: ProjectCategoryId; label: string; shortLabel: string; hint: string }
> = {
  website: {
    id: 'website',
    label: 'Websites',
    shortLabel: 'Web',
    hint: 'Web apps, dashboards & PWAs',
  },
  mobile: {
    id: 'mobile',
    label: 'Mobile apps',
    shortLabel: 'Mobile',
    hint: 'iOS, Android & cross-platform',
  },
  desktop: {
    id: 'desktop',
    label: 'Desktop apps',
    shortLabel: 'Desktop',
    hint: 'Windows, macOS & native shells',
  },
  extension: {
    id: 'extension',
    label: 'Browser extensions',
    shortLabel: 'Extension',
    hint: 'Chrome & Chromium MV3',
  },
  library: {
    id: 'library',
    label: 'npm packages',
    shortLabel: 'npm',
    hint: 'Published libraries, Web Components & npm packages',
  },
  game: {
    id: 'game',
    label: 'Games',
    shortLabel: 'Game',
    hint: 'Party games, live scoreboards & multiplayer experiences',
  },
};

/**
 * Format ISO date string (YYYY-MM-DD) for display. Returns null if missing/invalid.
 */
export const formatProjectDate = (isoDate?: string | null): string | null => {
  if (!isoDate || typeof isoDate !== 'string') return null;
  const d = new Date(`${isoDate.trim()}T12:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const getProjectCategories = (project: Project): ProjectCategoryId[] => {
  if (project.categories && project.categories.length > 0) {
    return project.categories;
  }
  return ['website'];
};

export const getAllProjects = (): Project[] => {
  return projectsData.projects as Project[];
};

export const getVisibleProjects = (): Project[] => {
  return getAllProjects().filter((project) => project.visible);
};

export const getFeaturedProjects = (): Project[] => {
  return getAllProjects()
    .filter((project) => project.featured && project.visible)
    .sort((a, b) => {
      const pa = a.priority ?? 99;
      const pb = b.priority ?? 99;
      if (pa !== pb) return pa - pb;
      return a.name.localeCompare(b.name);
    });
};

export const getProjectById = (id: string): Project | null => {
  return getAllProjects().find((project) => project.id === id) || null;
};

/** Alias routes that should resolve to another project's canonical route */
const ROUTE_ALIASES: Record<string, string> = {
  '/breathapplyser-v2': '/breathapplyser',
};

export const normalizeProjectRoute = (route: string): string => {
  return ROUTE_ALIASES[route] || route;
};

/**
 * Get project by route (supports aliases like /breathapplyser-v2).
 */
export const getProjectByRoute = (route: string): Project | null => {
  const normalised = normalizeProjectRoute(route);
  return (
    getAllProjects().find((project) => project.route === normalised) || null
  );
};

/** Visible projects sorted for prev/next navigation */
export const getOrderedVisibleProjects = (): Project[] => {
  return [...getVisibleProjects()].sort((a, b) => {
    const pa = a.priority ?? 99;
    const pb = b.priority ?? 99;
    if (pa !== pb) return pa - pb;
    return a.name.localeCompare(b.name);
  });
};

export const getAdjacentProjects = (
  route: string
): { prev: Project | null; next: Project | null } => {
  const list = getOrderedVisibleProjects();
  const normalised = normalizeProjectRoute(route);
  const idx = list.findIndex((p) => p.route === normalised);
  if (idx < 0) return { prev: null, next: null };
  return {
    prev: idx > 0 ? list[idx - 1] : null,
    next: idx < list.length - 1 ? list[idx + 1] : null,
  };
};

/** Logo public path helper */
export const getProjectLogoSrc = (project: Project): string | null => {
  if (!project.logo) return null;
  if (project.logo.startsWith('/')) return project.logo;
  return `/logos/${project.logo}`;
};

/** Preview image for embeds: first case-study section image, else logo */
export const getProjectPreviewSrc = (project: Project): string | null => {
  const sectionImg = project.caseStudy?.sections?.[0]?.image;
  if (sectionImg) return sectionImg;
  return getProjectLogoSrc(project);
};

export const getAllTags = (): string[] => {
  const tags = getVisibleProjects().flatMap((project) => project.tags);
  return [...new Set(tags)].sort();
};

export const filterProjectsByTags = (selectedTags: string[]): Project[] => {
  if (selectedTags.length === 0) {
    return getVisibleProjects();
  }

  return getVisibleProjects().filter((project) =>
    selectedTags.every((tag) => project.tags.includes(tag))
  );
};

export const filterProjectsByCategories = (
  projects: Project[],
  selectedCategoryIds?: string[]
): Project[] => {
  if (!selectedCategoryIds || selectedCategoryIds.length === 0) {
    return projects;
  }
  return projects.filter((project) => {
    const cats = getProjectCategories(project);
    return selectedCategoryIds.some((id) =>
      cats.includes(id as ProjectCategoryId)
    );
  });
};

export const filterProjectsCombined = (
  selectedCategoryIds?: string[],
  selectedTags?: string[]
): Project[] => {
  let list = getVisibleProjects();
  list = filterProjectsByCategories(list, selectedCategoryIds);
  if (!selectedTags || selectedTags.length === 0) {
    return list;
  }
  return list.filter((project) =>
    selectedTags.every((tag) => project.tags.includes(tag))
  );
};

/** All project route paths including aliases — for AppRoutes */
export const getProjectRoutePaths = (): string[] => {
  const routes = getAllProjects().map((p) => p.route);
  return [...routes, ...Object.keys(ROUTE_ALIASES)];
};

export default projectsData;
