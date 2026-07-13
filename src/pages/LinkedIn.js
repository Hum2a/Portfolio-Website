import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaLinkedin,
  FaMapMarkerAlt,
  FaUsers,
  FaBriefcase,
  FaGraduationCap,
  FaExternalLinkAlt,
} from 'react-icons/fa';
import HamburgerMenu from '../components/layout/HamburgerMenu';
import Navbar from '../components/layout/Navbar';
import {
  fetchLinkedInProfile,
  fetchLinkedInExperience,
  fetchLinkedInEducation,
  fetchLinkedInSkills,
  getLinkedInProfileUrl,
  formatLinkedInDateRange,
} from '../services/linkedinService';
import './LinkedInPage.css';

const FILTERS = [
  { id: 'software', label: 'Software & tech' },
  { id: 'all', label: 'All experience' },
  { id: 'other', label: 'Other roles' },
];

export default function LinkedIn() {
  const [profile, setProfile] = useState(null);
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [skills, setSkills] = useState([]);
  const [filter, setFilter] = useState('software');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const profileUrl = getLinkedInProfileUrl();
  const avatarSrc = profile?.avatar
    ? `${process.env.PUBLIC_URL}${profile.avatar}`
    : null;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const [profileData, expData, eduData, skillsData] = await Promise.all([
          fetchLinkedInProfile(),
          fetchLinkedInExperience({ category: filter }),
          fetchLinkedInEducation(),
          fetchLinkedInSkills(),
        ]);
        if (!cancelled) {
          setProfile(profileData);
          setExperience(Array.isArray(expData) ? expData : []);
          setEducation(Array.isArray(eduData) ? eduData : []);
          setSkills(Array.isArray(skillsData) ? skillsData : []);
          setError(!profileData);
        }
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [filter]);

  if (loading && !profile) {
    return (
      <div className="linkedin-page">
        {isMobile ? <HamburgerMenu /> : <Navbar />}
        <div className="linkedin-page-loading">
          <FaLinkedin className="linkedin-loading-icon" />
          <p>Loading career profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="linkedin-page">
      {isMobile ? <HamburgerMenu /> : <Navbar />}

      <motion.div
        className="linkedin-page-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="linkedin-page-header">
          <h1 className="linkedin-page-title">
            <span className="code-comment">{'//'}</span> Career
          </h1>
          <p className="linkedin-page-subtitle">
            Experience &amp; education from my LinkedIn profile
          </p>
        </div>

        {error && !profile && (
          <div className="linkedin-page-error">
            <p>Unable to load LinkedIn data. Try again later.</p>
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="linkedin-external-fallback"
            >
              View profile on LinkedIn →
            </a>
          </div>
        )}

        {profile && (
          <div className="linkedin-profile-card">
            <div className="linkedin-profile-main">
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={profile.name}
                  className="linkedin-profile-avatar"
                />
              ) : (
                <div className="linkedin-profile-avatar linkedin-profile-avatar--fallback" aria-hidden="true">
                  {profile.name?.charAt(0) || 'H'}
                </div>
              )}
              <div className="linkedin-profile-info">
                <h2 className="linkedin-profile-name">{profile.name}</h2>
                <p className="linkedin-profile-headline">{profile.headline}</p>
                {profile.location && (
                  <p className="linkedin-profile-location">
                    <FaMapMarkerAlt /> {profile.location}
                  </p>
                )}
                {profile.about && (
                  <p className="linkedin-profile-about">{profile.about}</p>
                )}
                <div className="linkedin-profile-stats">
                  <span className="linkedin-profile-stat">
                    <FaUsers /> {profile.connections} connections
                  </span>
                  <span className="linkedin-profile-stat">
                    {profile.followers} followers
                  </span>
                  <span className="linkedin-profile-stat">
                    <FaBriefcase /> {profile.totalExperience}
                  </span>
                </div>
                <a
                  href={profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="linkedin-profile-cta"
                >
                  <FaLinkedin /> Open on LinkedIn
                </a>
              </div>
            </div>
          </div>
        )}

        <section className="linkedin-section">
          <div className="linkedin-section-header">
            <h2 className="linkedin-section-title">
              <FaBriefcase /> Experience
            </h2>
            <div className="linkedin-filter">
              <span className="linkedin-filter-label">Show:</span>
              <div className="linkedin-filter-buttons" role="group" aria-label="Experience filter">
                {FILTERS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    className={`linkedin-filter-btn ${filter === f.id ? 'active' : ''}`}
                    onClick={() => setFilter(f.id)}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="linkedin-timeline">
            <AnimatePresence mode="popLayout">
              {experience.map((role, index) => {
                const isExpanded = expandedId === role.id;
                const hasMore = role.highlights?.length > 2;
                const visibleHighlights = isExpanded
                  ? role.highlights
                  : role.highlights?.slice(0, 2);

                return (
                  <motion.article
                    key={role.id}
                    className="linkedin-exp-card"
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{
                      duration: 0.35,
                      delay: Math.min(index * 0.03, 0.25),
                      ease: [0.4, 0, 0.2, 1],
                    }}
                  >
                    <div className="linkedin-exp-marker" aria-hidden="true" />
                    <div className="linkedin-exp-body">
                      <div className="linkedin-exp-top">
                        <h3 className="linkedin-exp-title">{role.title}</h3>
                        {role.current && (
                          <span className="linkedin-exp-badge">Current</span>
                        )}
                      </div>
                      <p className="linkedin-exp-company">
                        {role.companyUrl ? (
                          <a
                            href={role.companyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {role.company}
                            <FaExternalLinkAlt className="linkedin-ext-icon" />
                          </a>
                        ) : (
                          role.company
                        )}
                        {role.employmentType && (
                          <span className="linkedin-exp-type">
                            {' · '}
                            {role.employmentType}
                          </span>
                        )}
                      </p>
                      <p className="linkedin-exp-dates">
                        {formatLinkedInDateRange(
                          role.startDate,
                          role.endDate,
                          role.current
                        )}
                        {role.location ? ` · ${role.location}` : ''}
                      </p>
                      {visibleHighlights?.length > 0 && (
                        <ul className="linkedin-exp-highlights">
                          {visibleHighlights.map((h) => (
                            <li key={h}>{h}</li>
                          ))}
                        </ul>
                      )}
                      {hasMore && (
                        <button
                          type="button"
                          className="linkedin-exp-toggle"
                          onClick={() =>
                            setExpandedId(isExpanded ? null : role.id)
                          }
                        >
                          {isExpanded ? 'Show less' : 'Show more'}
                        </button>
                      )}
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
            {!loading && experience.length === 0 && (
              <p className="linkedin-empty">No roles in this filter.</p>
            )}
          </div>
        </section>

        {education.length > 0 && (
          <section className="linkedin-section">
            <div className="linkedin-section-header">
              <h2 className="linkedin-section-title">
                <FaGraduationCap /> Education
              </h2>
            </div>
            <div className="linkedin-edu-grid">
              {education.map((edu, index) => (
                <motion.article
                  key={edu.id}
                  className="linkedin-edu-card"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: Math.min(index * 0.06, 0.2),
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                >
                  <h3 className="linkedin-edu-degree">{edu.degree}</h3>
                  <p className="linkedin-edu-school">
                    {edu.schoolUrl ? (
                      <a
                        href={edu.schoolUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {edu.school}
                        <FaExternalLinkAlt className="linkedin-ext-icon" />
                      </a>
                    ) : (
                      edu.school
                    )}
                  </p>
                  <p className="linkedin-edu-dates">
                    {edu.startYear} – {edu.endYear}
                    {edu.location ? ` · ${edu.location}` : ''}
                  </p>
                  {edu.notes?.length > 0 && (
                    <ul className="linkedin-edu-notes">
                      {edu.notes.map((n) => (
                        <li key={n}>{n}</li>
                      ))}
                    </ul>
                  )}
                </motion.article>
              ))}
            </div>
          </section>
        )}

        {skills.length > 0 && (
          <section className="linkedin-section">
            <div className="linkedin-section-header">
              <h2 className="linkedin-section-title">Skills</h2>
            </div>
            <div className="linkedin-skills">
              {skills.map((skill, index) => (
                <motion.span
                  key={skill}
                  className="linkedin-skill"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.3,
                    delay: Math.min(index * 0.02, 0.3),
                  }}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </section>
        )}

        {profile && (
          <div className="linkedin-page-footer">
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="linkedin-view-all-btn"
            >
              View full profile on LinkedIn
            </a>
          </div>
        )}
      </motion.div>
    </div>
  );
}
