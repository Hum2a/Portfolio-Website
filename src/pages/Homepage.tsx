import React from 'react';
import CodeEditor from '../components/animations/CodeEditor';
import { HomepageFeaturedProjects } from '../components/projects/HomepageFeaturedProjects';
import { CareerSection } from '../components/linkedin/CareerSection';
import { GitHubSection } from '../components/github/GitHubSection';
import { CutoutAction } from '../components/ui/CutoutAction';
import { prefetchProjects } from '../utils/prefetchRoute';
import Seo, { DEFAULT_DESCRIPTION } from '../components/seo/Seo';
import './Homepage.css';

const Homepage = () => {
  return (
    <div className="homepage">
      <Seo
        title="Humza Butt — Software Engineer, Full Stack & Platform Configuration"
        description={DEFAULT_DESCRIPTION}
        path="/"
      />

      <section className="homepage-hero" aria-label="Introduction">
        <div className="homepage-hero-grid">
          <div className="homepage-hero-copy">
            <p className="homepage-availability">
              <span className="homepage-availability-dot" aria-hidden="true" />
              Available for contract
            </p>

            <h1 className="homepage-title">Humza Butt</h1>

            <p className="homepage-role">
              Software Engineer, Full Stack &amp; Platform Configuration
            </p>

            <p className="homepage-lede">
              I build SaaS platforms, APIs and real-time systems — and configure
              enterprise platforms for Shell, the BBC, the NHS and the Home
              Office.
            </p>

            <div className="homepage-cta-row">
              <CutoutAction
                to="/projects"
                onMouseEnter={prefetchProjects}
                onFocus={prefetchProjects}
              >
                View work
              </CutoutAction>
              <CutoutAction to="/contact">Get in touch</CutoutAction>
            </div>

            <ul className="homepage-stats" aria-label="Highlights">
              <li>
                <span className="homepage-stat-value">29</span>
                <span className="homepage-stat-label">shipped</span>
              </li>
              <li>
                <span className="homepage-stat-value">6</span>
                <span className="homepage-stat-label">surfaces</span>
              </li>
              <li>
                <span className="homepage-stat-value">4</span>
                <span className="homepage-stat-label">Tier 1 clients</span>
              </li>
            </ul>
          </div>

          <div className="homepage-hero-editor">
            <CodeEditor />
          </div>
        </div>
      </section>

      <CareerSection />
      <HomepageFeaturedProjects />
      <GitHubSection />
    </div>
  );
};

export default Homepage;
