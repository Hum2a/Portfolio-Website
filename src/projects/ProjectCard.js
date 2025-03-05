import React from 'react';
import { analytics } from '../utils/analytics';
import TrackedLink from '../components/TrackedLink';

const ProjectCard = ({ project }) => {
  const handleViewDetails = () => {
    analytics.trackProjectInteraction(project.name, 'View');
  };

  return (
    <div className="project-card" onClick={handleViewDetails}>
      <h3>{project.name}</h3>
      <p>{project.description}</p>
      
      <div className="project-links">
        <TrackedLink 
          href={project.demoUrl} 
          elementName={`${project.name} Demo`}
          section="project-card"
          isExternal={true}
        >
          Live Demo
        </TrackedLink>
        
        <TrackedLink 
          href={project.githubUrl} 
          elementName={`${project.name} GitHub`}
          section="project-card"
          isExternal={true}
        >
          GitHub
        </TrackedLink>
      </div>
    </div>
  );
};

export default ProjectCard; 