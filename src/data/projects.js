import projectsData from '../config/projects.json';

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
  return projectsData.projects.filter(project => project.featured && project.visible);
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

export default projectsData;
