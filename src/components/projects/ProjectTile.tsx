import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  formatProjectDate,
  getProjectCategories,
  isProjectComingSoon,
  PROJECT_CATEGORY_META,
  type Project,
} from '../../data/projects';
import { ComingSoonLockedSurface } from '../animations/coming-soon-tape';
import { CallingCardPeelLink } from '../animations/calling-card-peel';

type Props = {
  project: Project;
  index: number;
  tagsOpen: boolean;
  onToggleTags: (projectId: string) => void;
};

export function ProjectTile({
  project,
  index,
  tagsOpen,
  onToggleTags,
}: Props) {
  const cats = getProjectCategories(project);
  const visibleTags = tagsOpen ? project.tags : project.tags.slice(0, 5);
  const hiddenCount = project.tags.length - 5;
  const comingSoon = isProjectComingSoon(project);

  const tileContent = (
    <>
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
              <span key={cid} className={`surface-pill surface-pill--${cid}`}>
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
                onToggleTags(project.id);
              }}
            >
              {tagsOpen ? 'Show less' : `+${hiddenCount}`}
            </button>
          )}
        </div>
        <span className="project-tile__cta">
          {comingSoon ? 'Coming soon' : 'View case study'}
          {!comingSoon && (
            <span className="project-tile__cta-arrow" aria-hidden>
              →
            </span>
          )}
        </span>
      </div>
    </>
  );

  return (
    <article
      className={`project-tile project-tile--ccs-${index % 3}${
        comingSoon ? ' project-tile--locked' : ''
      }`}
    >
      <span className="project-tile__hard" aria-hidden="true" />
      <span className="project-tile__backing" aria-hidden="true" />
      <span className="project-tile__misreg" aria-hidden="true" />
      <span
        className="project-tile__shard project-tile__shard--a"
        aria-hidden="true"
      />
      <span
        className="project-tile__shard project-tile__shard--b"
        aria-hidden="true"
      />
      <motion.div
        className="project-tile__face"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.35,
          delay: Math.min(index * 0.04, 0.4),
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {comingSoon ? (
          <ComingSoonLockedSurface locked>
            <div
              className="project-tile__link project-tile__link--locked"
              aria-label={`${project.name}, coming soon`}
            >
              {tileContent}
            </div>
          </ComingSoonLockedSurface>
        ) : (
          <CallingCardPeelLink
            to={project.route}
            className="project-tile__peel"
            obstructionLabel={project.name}
          >
            <Link to={project.route} className="project-tile__link">
              {tileContent}
            </Link>
          </CallingCardPeelLink>
        )}
      </motion.div>
    </article>
  );
}
