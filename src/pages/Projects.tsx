import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  getAllTags,
  filterProjectsCombined,
  PROJECT_CATEGORY_ORDER,
  PROJECT_CATEGORY_META,
  getProjectCategories,
  getVisibleProjects,
  formatProjectDate,
  type Project,
} from '../data/projects';
import Seo from '../components/seo/Seo';
import { Input } from '@/components/ui/input';
import './Projects.css';

type SortMode = 'recent' | 'surface' | 'tech';

function sortProjects(list: Project[], mode: SortMode): Project[] {
  const copy = [...list];
  if (mode === 'recent') {
    return copy.sort((a, b) => {
      const da = a.dateUpdated || a.dateAdded || '';
      const db = b.dateUpdated || b.dateAdded || '';
      return db.localeCompare(da);
    });
  }
  if (mode === 'surface') {
    return copy.sort((a, b) => {
      const ca = getProjectCategories(a)[0] || '';
      const cb = getProjectCategories(b)[0] || '';
      if (ca !== cb) return ca.localeCompare(cb);
      return a.name.localeCompare(b.name);
    });
  }
  return copy.sort((a, b) => {
    const ta = a.tags[0] || a.name;
    const tb = b.tags[0] || b.name;
    if (ta !== tb) return ta.localeCompare(tb);
    return a.name.localeCompare(b.name);
  });
}

const Projects = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [techFilterExpanded, setTechFilterExpanded] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>('recent');
  const [query, setQuery] = useState('');
  const [expandedTags, setExpandedTags] = useState<Record<string, boolean>>({});

  const filteredProjects = useMemo(() => {
    let list = filterProjectsCombined(selectedCategories, selectedTags);
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((p) => {
        const hay = [p.name, p.description || '', ...(p.tags || [])]
          .join(' ')
          .toLowerCase();
        return hay.includes(q);
      });
    }
    return sortProjects(list, sortMode);
  }, [selectedCategories, selectedTags, query, sortMode]);

  const visibleCount = getVisibleProjects().length;

  const handleTagClick = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedTags([]);
    setQuery('');
  };

  const hasActiveFilters =
    selectedCategories.length > 0 || selectedTags.length > 0 || query.trim();

  const allTags = getAllTags();

  return (
    <div className="projects-page">
      <Seo
        title="Projects"
        description="29 shipped projects by Humza Butt across web, mobile, desktop, extensions and games. Filter by surface and stack."
        path="/projects"
      />

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
            Websites, mobile apps, desktop tools, browser extensions, npm
            packages, and games—often overlapping in one product.
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
          <label className="projects-search-label sr-only" htmlFor="projects-search">
            Search projects
          </label>
          <Input
            id="projects-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects by name, stack, or description…"
            className="projects-search h-11 border-glass bg-elevated"
            aria-label="Search projects by name, stack, or description"
          />

          <div className="projects-sort" role="group" aria-label="Sort projects">
            <span className="projects-toolbar__label">Sort</span>
            {(
              [
                ['recent', 'Recent'],
                ['surface', 'Surface'],
                ['tech', 'Tech'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                className={`projects-sort__btn ${
                  sortMode === id ? 'projects-sort__btn--active' : ''
                }`}
                onClick={() => setSortMode(id)}
                aria-pressed={sortMode === id}
              >
                {label}
              </button>
            ))}
          </div>

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
            <div
              className="projects-category-chips"
              role="group"
              aria-label="Filter by surface type"
            >
              {PROJECT_CATEGORY_ORDER.map((catId) => {
                const meta = PROJECT_CATEGORY_META[catId];
                const active = selectedCategories.includes(catId);
                return (
                  <button
                    key={catId}
                    type="button"
                    title={meta.hint}
                    className={`category-chip category-chip--${catId} ${
                      active ? 'category-chip--active' : ''
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
          </div>

          {allTags.length > 0 && (
            <div
              className={`tech-filter ${
                techFilterExpanded ? 'tech-filter--open' : ''
              }`}
            >
              <button
                type="button"
                className="tech-filter__toggle"
                onClick={() => setTechFilterExpanded(!techFilterExpanded)}
                aria-expanded={techFilterExpanded}
              >
                <span className="tech-filter__toggle-label">
                  Technology stack
                </span>
                {selectedTags.length > 0 && (
                  <span className="tech-filter__badge">
                    {selectedTags.length}
                  </span>
                )}
                <span className="tech-filter__chevron" aria-hidden>
                  {techFilterExpanded ? '−' : '+'}
                </span>
              </button>
              <div className="tech-filter__panel">
                <div className="tech-filter__tags">
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      className={`tech-pill ${
                        selectedTags.includes(tag) ? 'tech-pill--selected' : ''
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
          key={`${sortMode}|${query}|${selectedCategories.join(',')}|${selectedTags.join(',')}`}
          className="projects-grid-modern"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
        >
          {filteredProjects.map((project, index) => {
            const cats = getProjectCategories(project);
            const tagsOpen = Boolean(expandedTags[project.id]);
            const visibleTags = tagsOpen
              ? project.tags
              : project.tags.slice(0, 5);
            const hiddenCount = project.tags.length - 5;

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
                      background: project.gradient || 'var(--bg-tertiary)',
                    }}
                  >
                    <img
                      src={`/logos/${project.logo}`}
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
                      <p
                        className="project-tile__dates"
                        aria-label="Project timeline"
                      >
                        {formatProjectDate(project.dateAdded) && (
                          <span className="project-tile__date">
                            <span className="project-tile__date-label">
                              Added
                            </span>
                            <time dateTime={project.dateAdded}>
                              {formatProjectDate(project.dateAdded)}
                            </time>
                          </span>
                        )}
                        {formatProjectDate(project.dateUpdated) && (
                          <span className="project-tile__date">
                            <span className="project-tile__date-label">
                              Updated
                            </span>
                            <time dateTime={project.dateUpdated}>
                              {formatProjectDate(project.dateUpdated)}
                            </time>
                          </span>
                        )}
                      </p>
                    )}
                    <p className="project-tile__desc">{project.description}</p>
                    <div className="project-tile__tech">
                      {visibleTags.map((tag) => (
                        <span key={tag} className="project-tile__tech-tag">
                          {tag}
                        </span>
                      ))}
                      {hiddenCount > 0 && (
                        <button
                          type="button"
                          className="project-tile__tech-more"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setExpandedTags((prev) => ({
                              ...prev,
                              [project.id]: !tagsOpen,
                            }));
                          }}
                        >
                          {tagsOpen ? 'Show less' : `+${hiddenCount}`}
                        </button>
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
              Try clearing filters or adjusting your search.
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
