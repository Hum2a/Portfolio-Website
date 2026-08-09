import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaLinkedin,
  FaMapMarkerAlt,
  FaUsers,
  FaBriefcase,
  FaGraduationCap,
  FaExternalLinkAlt,
} from 'react-icons/fa';
import {
  fetchLinkedInProfile,
  fetchLinkedInExperience,
  fetchLinkedInEducation,
  fetchLinkedInSkills,
  getLinkedInProfileUrl,
} from '../services/linkedinService';
import firebaseAnalytics from '../services/analyticsService';
import Seo from '../components/seo/Seo';
import CareerTimeline from '../components/linkedin/CareerTimeline';
import SectionBackdrop from '../components/media/SectionBackdrop';
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

  const profileUrl = getLinkedInProfileUrl();
  const avatarSrc = profile?.avatar
    ? `${profile.avatar}`
    : null;

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Career | Humza Butt';
    return () => {
      document.title = previousTitle;
    };
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
        <Seo
          title="Career"
          description="Career timeline for Humza Butt — CoreStream GRC (Shell, BBC, NHS, Home Office), LifeSmart, Bgr8 and education."
          path="/career"
        />
        <div className="linkedin-page-container">
          <div className="linkedin-page-header">
            <h1 className="linkedin-page-title">
              <span className="code-comment">{'//'}</span> Career
            </h1>
            <p className="linkedin-page-subtitle">
              Experience &amp; education from my LinkedIn profile
            </p>
          </div>
          <div className="linkedin-page-loading" aria-live="polite">
            <FaLinkedin className="linkedin-loading-icon" />
            <p>Loading career profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="linkedin-page">
      <Seo
        title="Career"
        description="Career timeline for Humza Butt — CoreStream GRC (Shell, BBC, NHS, Home Office), LifeSmart, Bgr8 and education."
        path="/career"
      />

      <div
        className="linkedin-page-container"
        style={{ position: 'relative' }}
      >
        <SectionBackdrop
          src="/images/linkedin/avatar.jpg"
          placement="right"
          intensity={0.11}
          tint="accent"
        />
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
                    onClick={() => {
                      setFilter(f.id);
                      firebaseAnalytics.trackEvent('career', 'filter', f.id);
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <CareerTimeline roles={experience} />
          {!loading && experience.length === 0 && (
            <p className="linkedin-empty">No roles in this filter.</p>
          )}
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
      </div>
    </div>
  );
}
