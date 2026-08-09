import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  getFeaturedProjects,
  getProjectPreviewSrc,
  getProjectLogoSrc,
  PROJECT_CATEGORY_META,
  getProjectCategories,
  isProjectComingSoon,
} from '../../data/projects';
import { ComingSoonLockedSurface } from '@/components/animations/coming-soon-tape';
import { CallingCardPeelLink } from '../animations/calling-card-peel';
import { prefetchProjects } from '../../utils/prefetchRoute';
import Img from '../media/Img';
import SectionBackdrop from '../media/SectionBackdrop';
import './HomepageFeaturedProjects.css';

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] },
  }),
};

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.08 },
  },
};

export function HomepageFeaturedProjects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const featured = getFeaturedProjects().slice(0, 5);

  if (featured.length === 0) return null;

  const [hero, ...rest] = featured;
  const heroPreview = getProjectPreviewSrc(hero);
  const heroComingSoon = isProjectComingSoon(hero);
  const backdropSrc =
    getProjectPreviewSrc(rest[0] || hero) || '/images/Bgr8/Matching Algorithm.png';

  return (
    <section id="work" className="homepage-featured" ref={ref}>
      <SectionBackdrop
        src={backdropSrc || '/images/Bgr8/Matching Algorithm.png'}
        placement="left"
        intensity={0.13}
        tint="accent"
      />
      <motion.div
        className="featured-inner"
        variants={sectionVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        <motion.div
          className="featured-header"
          variants={cardVariants}
          custom={0}
        >
          <span className="featured-label">Selected work</span>
          <h2 className="featured-title">Across every surface</h2>
          <p className="featured-subtitle">
            Shipping on the web, in the browser, on devices, on the desktop, on
            npm, and in games—sometimes all at once.
          </p>
        </motion.div>

        <div className="featured-bento">
          <motion.div
            className={`featured-hero surface-2${
              heroComingSoon ? ' featured-hero--locked' : ''
            }`}
            variants={cardVariants}
            custom={1}
          >
            {heroComingSoon ? (
              <ComingSoonLockedSurface locked className="featured-hero-link">
                <div
                  className="featured-hero-link featured-hero-link--locked"
                  aria-label={`${hero.name}, coming soon`}
                >
                  <div className="featured-hero-media">
                    {heroPreview && (
                      <Img
                        src={heroPreview}
                        alt=""
                        className="featured-hero-img"
                      />
                    )}
                    <div className="featured-hero-scrim" />
                  </div>
                  <div className="featured-hero-copy">
                    <h3 className="featured-hero-name">{hero.name}</h3>
                    <p className="featured-hero-claim">
                      {hero.caseStudy?.claim || hero.description}
                    </p>
                    <span className="featured-card-cta">Coming soon</span>
                  </div>
                </div>
              </ComingSoonLockedSurface>
            ) : (
              <CallingCardPeelLink
                to={hero.route}
                className="featured-hero-peel"
                obstructionLabel={hero.name}
              >
                <Link to={hero.route} className="featured-hero-link">
                  <div className="featured-hero-media">
                    {heroPreview && (
                      <Img
                        src={heroPreview}
                        alt=""
                        className="featured-hero-img"
                      />
                    )}
                    <div className="featured-hero-scrim" />
                  </div>
                  <div className="featured-hero-copy">
                    <h3 className="featured-hero-name">{hero.name}</h3>
                    <p className="featured-hero-claim">
                      {hero.caseStudy?.claim || hero.description}
                    </p>
                    <span className="featured-card-cta">
                      View case study <span className="cta-arrow">→</span>
                    </span>
                  </div>
                </Link>
              </CallingCardPeelLink>
            )}
          </motion.div>

          {rest.map((project, index) => {
            const cats = getProjectCategories(project);
            const preview = getProjectPreviewSrc(project);
            const logo = getProjectLogoSrc(project);
            const comingSoon = isProjectComingSoon(project);

            const tileContent = (
              <>
                <div className="featured-tile-media">
                  {preview ? (
                    <Img
                      src={preview}
                      alt=""
                      className="featured-tile-img"
                    />
                  ) : logo ? (
                    <Img src={logo} alt="" className="featured-tile-logo" />
                  ) : null}
                </div>
                <div className="featured-tile-copy">
                  <div className="featured-card-surfaces">
                    {cats.map((cid) => {
                      const m = PROJECT_CATEGORY_META[cid];
                      if (!m) return null;
                      return (
                        <span
                          key={cid}
                          className={`featured-surface featured-surface--${cid}`}
                        >
                          {m.shortLabel}
                        </span>
                      );
                    })}
                  </div>
                  <h3 className="featured-tile-name">{project.name}</h3>
                  <p className="featured-tile-desc">{project.description}</p>
                  <span className="featured-card-cta">
                    {comingSoon ? (
                      'Coming soon'
                    ) : (
                      <>
                        View project <span className="cta-arrow">→</span>
                      </>
                    )}
                  </span>
                </div>
              </>
            );

            return (
              <motion.div
                key={project.id}
                className={`featured-tile surface-2${
                  comingSoon ? ' featured-tile--locked' : ''
                }`}
                variants={cardVariants}
                custom={index + 2}
              >
                {comingSoon ? (
                  <ComingSoonLockedSurface locked className="featured-tile-link">
                    <div
                      className="featured-tile-link featured-tile-link--locked"
                      aria-label={`${project.name}, coming soon`}
                    >
                      {tileContent}
                    </div>
                  </ComingSoonLockedSurface>
                ) : (
                  <CallingCardPeelLink
                    to={project.route}
                    className="featured-tile-peel"
                    obstructionLabel={project.name}
                  >
                    <Link to={project.route} className="featured-tile-link">
                      {tileContent}
                    </Link>
                  </CallingCardPeelLink>
                )}
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className="featured-footer"
          variants={cardVariants}
          custom={featured.length + 1}
        >
          <Link
            to="/projects"
            className="featured-view-all"
            onMouseEnter={prefetchProjects}
            onFocus={prefetchProjects}
          >
            Browse all projects &amp; filters
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
