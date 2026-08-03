import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Img from '../media/Img';
import ProjectSiteEmbed from './ProjectSiteEmbed';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import Seo, { DEFAULT_DESCRIPTION } from '../seo/Seo';
import {
  getAdjacentProjects,
  getProjectLogoSrc,
  getProjectPreviewSrc,
  type Project,
} from '../../data/projects';
import '../../projects/project-shared.css';
import './ProjectCaseStudy.css';

function paragraphs(text: string) {
  return text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

type Props = {
  project: Project;
};

const ProjectCaseStudy: React.FC<Props> = ({ project }) => {
  const cs = project.caseStudy;
  const { prev, next } = getAdjacentProjects(project.route);
  const [lightbox, setLightbox] = useState<{
    src: string;
    alt: string;
  } | null>(null);

  if (!cs) {
    return (
      <div className="case-study">
        <p>Case study content is missing for this project.</p>
      </div>
    );
  }

  const logo = getProjectLogoSrc(project);
  const preview = getProjectPreviewSrc(project);
  const techPills = project.tags.slice(0, 12);

  return (
    <article className="project-page case-study">
      <Seo
        title={project.name}
        description={project.description || DEFAULT_DESCRIPTION}
        path={project.route}
        image={project.id ? `/og/${project.id}.png` : undefined}
      />

      <header className="case-study-hero">
        <div className="case-study-hero-text">
          {logo && (
            <Img
              src={logo}
              alt=""
              className="case-study-logo"
              priority
            />
          )}
          <h1 className="case-study-title">{project.name}</h1>
          <p className="case-study-claim">{cs.claim}</p>
          <div className="case-study-meta">
            <span>{cs.role}</span>
            <span aria-hidden="true">·</span>
            <span>{cs.timeline}</span>
          </div>
          <ul className="case-study-tags" aria-label="Tech stack">
            {techPills.map((tag) => (
              <li key={tag} className="case-study-tag">
                {tag}
              </li>
            ))}
          </ul>
          <div className="case-study-actions">
            {project.liveUrl && (
              <Button asChild className="rounded-full">
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit live site
                </a>
              </Button>
            )}
            {project.repoUrl && (
              <Button asChild variant="outline" className="rounded-full">
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Repository
                </a>
              </Button>
            )}
          </div>
        </div>
      </header>

      {project.liveUrl && (
        <section className="case-study-section" aria-labelledby="live-heading">
          <h2 id="live-heading" className="case-study-h2">
            Live site
          </h2>
          <ProjectSiteEmbed
            url={project.liveUrl}
            embeddable={Boolean(project.embeddable)}
            previewSrc={preview}
            previewAlt={`${project.name} preview`}
            iframeTitle={project.name}
            newTabLabel="Visit live site →"
          />
        </section>
      )}

      {cs.metrics.length > 0 && (
        <section className="case-study-section" aria-labelledby="metrics-heading">
          <h2 id="metrics-heading" className="case-study-h2">
            At a glance
          </h2>
          <ul className="case-study-metrics">
            {cs.metrics.map((m) => (
              <li key={m.label} className="case-study-metric surface-2">
                <span className="case-study-metric-value">{m.value}</span>
                <span className="case-study-metric-label">{m.label}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="case-study-section" aria-labelledby="problem-heading">
        <h2 id="problem-heading" className="case-study-h2">
          The problem
        </h2>
        {paragraphs(cs.problem).map((p) => (
          <p key={p.slice(0, 24)} className="case-study-prose">
            {p}
          </p>
        ))}
      </section>

      <section className="case-study-section" aria-labelledby="built-heading">
        <h2 id="built-heading" className="case-study-h2">
          What I built
        </h2>
        <div className="case-study-built">
          {cs.sections.map((section, i) => (
            <div
              key={section.title}
              className={`case-study-built-row ${
                i % 2 === 1 ? 'case-study-built-row--flip' : ''
              }`}
            >
              <button
                type="button"
                className="case-study-built-media"
                onClick={() =>
                  setLightbox({ src: section.image, alt: section.imageAlt })
                }
              >
                <Img
                  src={section.image}
                  alt={section.imageAlt}
                  className="case-study-built-img"
                />
                <span className="sr-only">Open image lightbox</span>
              </button>
              <div className="case-study-built-copy">
                <h3 className="case-study-h3">{section.title}</h3>
                {paragraphs(section.body).map((p) => (
                  <p key={p.slice(0, 24)} className="case-study-prose">
                    {p}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="case-study-section" aria-labelledby="decisions-heading">
        <h2 id="decisions-heading" className="case-study-h2">
          Technical decisions
        </h2>
        <ul className="case-study-decisions">
          {cs.decisions.map((d) => (
            <li key={d.choice} className="case-study-decision surface-1">
              <h3 className="case-study-h3">{d.choice}</h3>
              <p className="case-study-prose">
                <strong>Why: </strong>
                {d.why}
              </p>
              <p className="case-study-prose">
                <strong>Trade-off: </strong>
                {d.tradeoff}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="case-study-section" aria-labelledby="outcome-heading">
        <h2 id="outcome-heading" className="case-study-h2">
          Outcome
        </h2>
        {paragraphs(cs.outcome).map((p) => (
          <p key={p.slice(0, 24)} className="case-study-prose">
            {p}
          </p>
        ))}
      </section>

      <nav className="case-study-pager" aria-label="Adjacent projects">
        {prev ? (
          <Link to={prev.route} className="case-study-pager-link">
            <span className="case-study-pager-label">Previous</span>
            <span className="case-study-pager-name">{prev.name}</span>
          </Link>
        ) : (
          <span />
        )}
        <Link to="/projects" className="case-study-pager-all">
          All projects
        </Link>
        {next ? (
          <Link
            to={next.route}
            className="case-study-pager-link case-study-pager-link--next"
          >
            <span className="case-study-pager-label">Next</span>
            <span className="case-study-pager-name">{next.name}</span>
          </Link>
        ) : (
          <span />
        )}
      </nav>

      <Dialog
        open={Boolean(lightbox)}
        onOpenChange={(open) => {
          if (!open) setLightbox(null);
        }}
      >
        <DialogContent className="case-study-lightbox max-w-4xl border-glass p-2">
          <DialogTitle className="sr-only">
            {lightbox?.alt || 'Screenshot'}
          </DialogTitle>
          {lightbox && (
            <Img
              src={lightbox.src}
              alt={lightbox.alt}
              className="case-study-lightbox-img"
              priority
            />
          )}
        </DialogContent>
      </Dialog>
    </article>
  );
};

export default ProjectCaseStudy;
