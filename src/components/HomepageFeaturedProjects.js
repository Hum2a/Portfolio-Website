import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { getFeaturedProjects } from '../data/projects';
import '../styles/HomepageFeaturedProjects.css';

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, delay: i * 0.04, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.06 },
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
          <span className="featured-label">// Featured Work</span>
          <h2 className="featured-title">Projects that showcase my craft</h2>
          <p className="featured-subtitle">
            From mobile apps to enterprise platforms—here's a selection of my recent work
          </p>
        </motion.div>

        <div className="featured-grid">
          {featuredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              className={`featured-card ${project.id ? `featured-card--${project.id}` : ''}`}
              style={{
                background: project.name === 'BakesByOlayide'
                  ? 'linear-gradient(135deg, #000000 0%, #171717 50%, #0a0a0a 100%)'
                  : (project.gradient || 'var(--bg-tertiary)'),
              }}
              variants={cardVariants}
              custom={index + 1}
              whileHover={{ y: -8, transition: { duration: 0.18, ease: [0.4, 0, 0.2, 1] } }}
            >
              <Link to={project.route} className="featured-card-link">
                <div className="featured-card-visual">
                  <img
                    src={`${process.env.PUBLIC_URL}/logos/${project.logo}`}
                    alt={project.name}
                    className="featured-card-logo"
                  />
                </div>
                <div className="featured-card-content">
                  <h3 className="featured-card-name">{project.name}</h3>
                  <p className="featured-card-desc">{project.description}</p>
                  <div className="featured-card-tags">
                    {project.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="featured-tag">{tag}</span>
                    ))}
                  </div>
                  <span className="featured-card-cta">
                    View project <span className="cta-arrow">→</span>
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div className="featured-footer" variants={cardVariants} custom={featuredProjects.length + 1}>
          <Link to="/projects" className="featured-view-all">
            View all projects
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
