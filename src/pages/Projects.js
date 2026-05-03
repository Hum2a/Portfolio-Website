import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import HamburgerMenu from "../components/HamburgerMenu";
import Navbar from "../components/Navbar";
import {
  getAllTags,
  filterProjectsCombined,
  PROJECT_CATEGORY_ORDER,
  PROJECT_CATEGORY_META,
  getProjectCategories,
  getVisibleProjects,
  formatProjectDate,
} from "../data/projects";
import "../styles/Projects.css";

const Projects = () => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [techFilterExpanded, setTechFilterExpanded] = useState(false);

  const filteredProjects = useMemo(
    () => filterProjectsCombined(selectedCategories, selectedTags),
    [selectedCategories, selectedTags]
  );

  const visibleCount = getVisibleProjects().length;

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
    setSelectedTags((prevTags) =>
      prevTags.includes(tag) ? prevTags.filter((t) => t !== tag) : [...prevTags, tag]
    );
  };

  const toggleCategory = (id) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedTags([]);
  };

  const hasActiveFilters =
    selectedCategories.length > 0 || selectedTags.length > 0;

  const allTags = getAllTags();

  return (
    <div className="projects-page">
      {isMobile ? <HamburgerMenu /> : <Navbar />}

      <motion.div
        className="projects-shell"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <header className="projects-hero">
          <p className="projects-hero__eyebrow">Portfolio</p>
          <h1 className="projects-hero__title">
            <span className="projects-hero__slash">/</span> Projects
          </h1>
          <p className="projects-hero__lead">
            Websites, mobile apps, desktop tools, and browser extensions—often overlapping in one
            product. Filter by surface type or drill down by tech stack.
          </p>
          <div className="projects-hero__stats">
            <span className="projects-stat">
              <strong>{visibleCount}</strong>
              <span className="projects-stat__label">published</span>
            </span>
            <span className="projects-stat projects-stat--muted">
              <strong>{filteredProjects.length}</strong>
              <span className="projects-stat__label">matching</span>
            </span>
          </div>
        </header>

        <div className="projects-toolbar">
          <div className="projects-toolbar__block">
            <div className="projects-toolbar__head">
              <span className="projects-toolbar__label">Surface type</span>
              {hasActiveFilters && (
                <button
                  type="button"
                  className="projects-clear-filters"
                  onClick={clearFilters}
                >
                  Clear filters
                </button>
              )}
            </div>
            <div className="projects-category-chips" role="group" aria-label="Filter by surface type">
              {PROJECT_CATEGORY_ORDER.map((catId) => {
                const meta = PROJECT_CATEGORY_META[catId];
                const active = selectedCategories.includes(catId);
                return (
                  <button
                    key={catId}
                    type="button"
                    title={meta.hint}
                    className={`category-chip category-chip--${catId} ${
                      active ? "category-chip--active" : ""
                    }`}
                    onClick={() => toggleCategory(catId)}
                    aria-pressed={active}
                  >
                    <span className="category-chip__dot" aria-hidden />
                    <span className="category-chip__text">{meta.label}</span>
                  </button>
                );
              })}
            </div>
            <p className="projects-toolbar__hint">
              {selectedCategories.length === 0
                ? "Showing all surfaces. Tap a type to narrow the list (multi-select)."
                : "Projects match if they use any selected surface—many span more than one."}
            </p>
          </div>

          {allTags.length > 0 && (
            <div className={`tech-filter ${techFilterExpanded ? "tech-filter--open" : ""}`}>
              <button
                type="button"
                className="tech-filter__toggle"
                onClick={() => setTechFilterExpanded(!techFilterExpanded)}
                aria-expanded={techFilterExpanded}
              >
                <span className="tech-filter__toggle-label">Technology stack</span>
                {selectedTags.length > 0 && (
                  <span className="tech-filter__badge">{selectedTags.length}</span>
                )}
                <span className="tech-filter__chevron" aria-hidden>
                  {techFilterExpanded ? "−" : "+"}
                </span>
              </button>
              <div className="tech-filter__panel">
                <div className="tech-filter__tags">
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      className={`tech-pill ${
                        selectedTags.includes(tag) ? "tech-pill--selected" : ""
                      }`}
                      onClick={() => handleTagClick(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

          <motion.div
            key={
              selectedCategories.join(",") +
              "|" +
              selectedTags.join(",")
            }
            className="projects-grid-modern"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
          >
            {filteredProjects.map((project, index) => {
              const cats = getProjectCategories(project);
              return (
                <motion.article
                  key={project.id}
                  className="project-tile"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.35,
                    delay: Math.min(index * 0.04, 0.4),
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Link to={project.route} className="project-tile__link">
                    <div
                      className="project-tile__visual"
                      style={{
                        background:
                          project.gradient || "var(--bg-tertiary)",
                      }}
                    >
                      <img
                        src={`${process.env.PUBLIC_URL}/logos/${project.logo}`}
                        alt=""
                        className="project-tile__logo"
                      />
                    </div>
                    <div className="project-tile__body">
                      <div className="project-tile__categories">
                        {cats.map((cid) => {
                          const m = PROJECT_CATEGORY_META[cid];
                          if (!m) return null;
                          return (
                            <span
                              key={cid}
                              className={`surface-pill surface-pill--${cid}`}
                            >
                              {m.shortLabel}
                            </span>
                          );
                        })}
                      </div>
                      <h2 className="project-tile__name">{project.name}</h2>
                      {(formatProjectDate(project.dateAdded) ||
                        formatProjectDate(project.dateUpdated)) && (
                        <p className="project-tile__dates" aria-label="Project timeline">
                          {formatProjectDate(project.dateAdded) && (
                            <span className="project-tile__date">
                              <span className="project-tile__date-label">Added</span>
                              <time dateTime={project.dateAdded}>
                                {formatProjectDate(project.dateAdded)}
                              </time>
                            </span>
                          )}
                          {formatProjectDate(project.dateUpdated) && (
                            <span className="project-tile__date">
                              <span className="project-tile__date-label">Updated</span>
                              <time dateTime={project.dateUpdated}>
                                {formatProjectDate(project.dateUpdated)}
                              </time>
                            </span>
                          )}
                        </p>
                      )}
                      <p className="project-tile__desc">{project.description}</p>
                      <div className="project-tile__tech">
                        {project.tags.slice(0, 5).map((tag) => (
                          <span key={tag} className="project-tile__tech-tag">
                            {tag}
                          </span>
                        ))}
                        {project.tags.length > 5 && (
                          <span className="project-tile__tech-more">
                            +{project.tags.length - 5}
                          </span>
                        )}
                      </div>
                      <span className="project-tile__cta">
                        View case study
                        <span className="project-tile__cta-arrow" aria-hidden>
                          →
                        </span>
                      </span>
                    </div>
                  </Link>
                </motion.article>
              );
            })}
          </motion.div>

        {filteredProjects.length === 0 && (
          <div className="projects-empty-state">
            <p className="projects-empty-state__title">No projects match</p>
            <p className="projects-empty-state__text">
              Try clearing surface filters or removing some tech tags.
            </p>
            <button
              type="button"
              className="projects-empty-state__btn"
              onClick={clearFilters}
            >
              Reset filters
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Projects;
