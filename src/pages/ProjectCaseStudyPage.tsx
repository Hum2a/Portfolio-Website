import React from 'react';
import { useLocation } from 'react-router-dom';
import ProjectCaseStudy from '../components/projects/ProjectCaseStudy';
import NotFound from './NotFound';
import { getProjectByRoute } from '../data/projects';

/**
 * JSON-driven project case study page.
 * Resolves the project from the current path (including /breathapplyser-v2 alias).
 */
const ProjectCaseStudyPage: React.FC = () => {
  const { pathname } = useLocation();
  const project = getProjectByRoute(pathname);

  if (!project || !project.caseStudy) {
    return <NotFound />;
  }

  return <ProjectCaseStudy project={project} />;
};

export default ProjectCaseStudyPage;
