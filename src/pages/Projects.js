import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import HamburgerMenu from "../components/HamburgerMenu";
import Navbar from "../components/Navbar";
import { getVisibleProjects, getAllTags, filterProjectsByTags } from "../data/projects";
import "../styles/Projects.css";

const Projects = () => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    setFilteredProjects(getVisibleProjects());
  }, []);

  useEffect(() => {
    const filtered = filterProjectsByTags(selectedTags);
    setFilteredProjects(filtered);
  }, [selectedTags]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleTagClick = (tag) => {
    setSelectedTags(prevTags =>
      prevTags.includes(tag)
        ? prevTags.filter(t => t !== tag)
        : [...prevTags, tag]
    );
  };

  const allTags = getAllTags();

  return (
    <div className="projects-page">
      {isMobile ? <HamburgerMenu /> : <Navbar />}

      <motion.div
        className="projects-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="projects-header">
          <h1 className="projects-title">
            <span className="code-comment">//</span> My Projects
          </h1>
          <p className="projects-subtitle">
            A collection of my work and side projects
          </p>
        </div>

        {allTags.length > 0 && (
          <div className="tag-filter">
            <span className="tag-filter-label">Filter by technology:</span>
            <div className="tag-buttons">
              {allTags.map((tag, index) => (
                <button
                  key={index}
                  className={`tag-button ${
                    selectedTags.includes(tag) ? "tag-button-selected" : ""
                  }`}
                  onClick={() => handleTagClick(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="projects-grid">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              className="project-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Link to={project.route} className="project-link">
                <div 
                  className="project-image-container"
                  style={{ background: project.gradient || 'var(--bg-tertiary)' }}
                >
                  <img
                    src={`${process.env.PUBLIC_URL}/logos/${project.logo}`}
                    alt={`${project.name} Logo`}
                    className={`project-logo ${project.name === "BakesByOlayide" ? "bakesbyolayide-logo" : ""}`}
                  />
                </div>
                <div className="project-content">
                  <h3 className="project-name">{project.name}</h3>
                  <p className="project-description">{project.description}</p>
                  <div className="project-tags">
                    {project.tags.slice(0, 4).map((tag, i) => (
                      <span key={i} className="project-tag">
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 4 && (
                      <span className="project-tag project-tag-more">
                        +{project.tags.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="projects-empty">
            <p className="projects-empty-text">
              No projects found matching the selected filters.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Projects;
