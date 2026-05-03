import projectsData from '../config/projects.json';

/** Display order for category filter chips */
export const PROJECT_CATEGORY_ORDER = ['website', 'mobile', 'desktop', 'extension'];

/** Labels and styling keys for project surfaces */
export const PROJECT_CATEGORY_META = {
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
};

/**
 * Categories for a project (defaults for legacy entries)
 */
export const getProjectCategories = (project) => {
  if (project.categories && project.categories.length > 0) {
    return project.categories;
  }
  return ['website'];
};

/**
 * Get all projects
 * @returns {Array} All projects
 */
export const getAllProjects = () => {
  return projectsData.projects;
};

/**
 * Get visible projects only
 * @returns {Array} Visible projects
 */
export const getVisibleProjects = () => {
  return projectsData.projects.filter(project => project.visible);
};

/**
 * Get featured projects
 * @returns {Array} Featured projects
 */
export const getFeaturedProjects = () => {
  return projectsData.projects
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
 * @param {string} id - Project ID
 * @returns {Object|null} Project object or null
 */
export const getProjectById = (id) => {
  return projectsData.projects.find(project => project.id === id) || null;
};

/**
 * Get project by route
 * @param {string} route - Project route
 * @returns {Object|null} Project object or null
 */
export const getProjectByRoute = (route) => {
  return projectsData.projects.find(project => project.route === route) || null;
};

/**
 * Get all unique tags from visible projects
 * @returns {Array} Sorted array of unique tags
 */
export const getAllTags = () => {
  const tags = getVisibleProjects()
    .flatMap(project => project.tags);
  return [...new Set(tags)].sort();
};

/**
 * Filter projects by tags
 * @param {Array} selectedTags - Array of selected tag strings
 * @returns {Array} Filtered projects
 */
export const filterProjectsByTags = (selectedTags) => {
  if (selectedTags.length === 0) {
    return getVisibleProjects();
  }
  
  return getVisibleProjects().filter(project =>
    selectedTags.every(tag => project.tags.includes(tag))
  );
};

/**
 * Filter by surface types (OR). Empty selection = no category filter.
 * @param {Array} projects - Projects to filter
 * @param {string[]} selectedCategoryIds - e.g. ['website','mobile']
 */
export const filterProjectsByCategories = (projects, selectedCategoryIds) => {
  if (!selectedCategoryIds || selectedCategoryIds.length === 0) {
    return projects;
  }
  return projects.filter((project) => {
    const cats = getProjectCategories(project);
    return selectedCategoryIds.some((id) => cats.includes(id));
  });
};

/**
 * Visible projects filtered by category chips (OR) and tech tags (AND across selected tags).
 */
export const filterProjectsCombined = (selectedCategoryIds, selectedTags) => {
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
