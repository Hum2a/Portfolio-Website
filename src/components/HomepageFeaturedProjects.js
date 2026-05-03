import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { getFeaturedProjects, PROJECT_CATEGORY_META, getProjectCategories } from '../data/projects';
import '../styles/HomepageFeaturedProjects.css';

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i) => ({
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
  const featuredProjects = getFeaturedProjects().slice(0, 6);

  if (featuredProjects.length === 0) return null;

  return (
    <section className="homepage-featured" ref={ref}>
      <motion.div
        className="featured-inner"
        variants={sectionVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        <motion.div className="featured-header" variants={cardVariants} custom={0}>
          <span className="featured-label">Selected work</span>
          <h2 className="featured-title">Across every surface</h2>
          <p className="featured-subtitle">
            Shipping on the web, in the browser, on devices, and on the desktop—sometimes all at once.
            Explore by surface type on the full projects page.
          </p>
        </motion.div>

        <div className="featured-grid featured-grid--bento">
          {featuredProjects.map((project, index) => {
            const cats = getProjectCategories(project);
            const bgStyle =
              project.name === 'BakesByOlayide'
                ? 'linear-gradient(135deg, #000000 0%, #171717 50%, #0a0a0a 100%)'
                : project.gradient || 'var(--bg-tertiary)';

            return (
              <motion.div
                key={project.id}
                className={`featured-card featured-card--${project.id} ${
                  index === 0 ? 'featured-card--hero' : ''
                }`}
                style={{ background: bgStyle }}
                variants={cardVariants}
                custom={index + 1}
              >
                <Link to={project.route} className="featured-card-link">
                  <div className="featured-card-visual">
                    <img
                      src={`${process.env.PUBLIC_URL}/logos/${project.logo}`}
                      alt=""
                      className="featured-card-logo"
                    />
                  </div>
                  <div className="featured-card-content">
                    <div className="featured-card-surfaces">
                      {cats.map((cid) => {
                        const m = PROJECT_CATEGORY_META[cid];
                        if (!m) return null;
                        return (
                          <span key={cid} className={`featured-surface featured-surface--${cid}`}>
                            {m.shortLabel}
                          </span>
                        );
                      })}
                    </div>
                    <h3 className="featured-card-name">{project.name}</h3>
                    <p className="featured-card-desc">{project.description}</p>
                    <div className="featured-card-tags">
                      {project.tags.slice(0, 4).map((tag, i) => (
                        <span key={i} className="featured-tag">{tag}</span>
                      ))}
                    </div>
                    <span className="featured-card-cta">
                      View project <span className="cta-arrow">→</span>
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <motion.div className="featured-footer" variants={cardVariants} custom={featuredProjects.length + 1}>
          <Link to="/projects" className="featured-view-all">
            Browse all projects & filters
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
