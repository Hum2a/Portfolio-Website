import projectsData from '../config/projects.json';

export type ProjectCategoryId =
  | 'website'
  | 'mobile'
  | 'desktop'
  | 'extension'
  | 'library'
  | 'game';

export interface Project {
  id: string;
  name: string;
  route: string;
  description?: string;
  tags: string[];
  categories?: ProjectCategoryId[];
  logo?: string;
  visible?: boolean;
  featured?: boolean;
  priority?: number;
  date?: string;
  liveUrl?: string;
  repoUrl?: string;
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

/**
 * Categories for a project (defaults for legacy entries)
 */
export const getProjectCategories = (project: Project): ProjectCategoryId[] => {
  if (project.categories && project.categories.length > 0) {
    return project.categories;
  }
  return ['website'];
};

/**
 * Get all projects
 */
export const getAllProjects = (): Project[] => {
  return projectsData.projects as Project[];
};

/**
 * Get visible projects only
 */
export const getVisibleProjects = (): Project[] => {
  return getAllProjects().filter((project) => project.visible);
};

/**
 * Get featured projects
 */
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

/**
 * Get project by ID
 */
export const getProjectById = (id: string): Project | null => {
  return getAllProjects().find((project) => project.id === id) || null;
};

/**
 * Get project by route
 */
export const getProjectByRoute = (route: string): Project | null => {
  return getAllProjects().find((project) => project.route === route) || null;
};

/**
 * Get all unique tags from visible projects
 */
export const getAllTags = (): string[] => {
  const tags = getVisibleProjects().flatMap((project) => project.tags);
  return [...new Set(tags)].sort();
};

/**
 * Filter projects by tags
 */
export const filterProjectsByTags = (selectedTags: string[]): Project[] => {
  if (selectedTags.length === 0) {
    return getVisibleProjects();
  }

  return getVisibleProjects().filter((project) =>
    selectedTags.every((tag) => project.tags.includes(tag))
  );
};

/**
 * Filter by surface types (OR). Empty selection = no category filter.
 */
export const filterProjectsByCategories = (
  projects: Project[],
  selectedCategoryIds?: string[]
): Project[] => {
  if (!selectedCategoryIds || selectedCategoryIds.length === 0) {
    return projects;
  }
  return projects.filter((project) => {
    const cats = getProjectCategories(project);
    return selectedCategoryIds.some((id) => cats.includes(id as ProjectCategoryId));
  });
};

/**
 * Visible projects filtered by category chips (OR) and tech tags (AND across selected tags).
 */
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

export default projectsData;
