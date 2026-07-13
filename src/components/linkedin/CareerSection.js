import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  FaBriefcase,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaArrowRight,
} from 'react-icons/fa';
import {
  fetchLinkedInProfile,
  fetchLinkedInExperience,
  fetchLinkedInEducation,
  formatLinkedInDateRange,
} from '../../services/linkedinService';
import './CareerSection.css';

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, delay: 0.08 + i * 0.05, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export function CareerSection() {
  const [profile, setProfile] = useState(null);
  const [roles, setRoles] = useState([]);
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [profileData, expData, eduData] = await Promise.all([
          fetchLinkedInProfile(),
          fetchLinkedInExperience({ category: 'software' }),
          fetchLinkedInEducation(),
        ]);
        if (!cancelled) {
          setProfile(profileData);
          const current = (Array.isArray(expData) ? expData : [])
            .filter((r) => r.current)
            .slice(0, 4);
          setRoles(current);
          setEducation(Array.isArray(eduData) ? eduData.slice(0, 2) : []);
        }
      } catch {
        // hide section on failure
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <section className="career-section" ref={ref}>
        <div className="career-inner">
          <div className="career-loading">
            <FaBriefcase className="career-loading-icon" />
            <p>Loading career...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!profile) return null;

  const avatarSrc = profile.avatar
    ? `${process.env.PUBLIC_URL}${profile.avatar}`
    : null;

  return (
    <section className="career-section" ref={ref}>
      <motion.div
        className="career-inner"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="career-header">
          <div className="career-header-main">
            {avatarSrc && (
              <img
                src={avatarSrc}
                alt={profile.name}
                className="career-avatar"
              />
            )}
            <div className="career-header-text">
              <span className="career-label">{'// Career'}</span>
              <h2 className="career-title">Experience &amp; education</h2>
              <p className="career-headline">{profile.headline}</p>
              {profile.location && (
                <p className="career-location">
                  <FaMapMarkerAlt /> {profile.location}
                </p>
              )}
              <p className="career-about">
                {profile.about ||
                  'Full stack roles across edtech, mentoring, and product — plus an MEng in Computer Science.'}
              </p>
              <div className="career-stats">
                <span>{profile.totalExperience} experience</span>
                <span>{roles.length} current roles</span>
                <span>{education.length} education</span>
              </div>
            </div>
          </div>
          <Link to="/career" className="career-cta">
            View full career <FaArrowRight />
          </Link>
        </div>

        <div className="career-grid">
          <div className="career-col">
            <h3 className="career-col-title">
              <FaBriefcase /> Current roles
            </h3>
            <div className="career-role-list">
              {roles.map((role, index) => (
                <motion.article
                  key={role.id}
                  className="career-role-card"
                  variants={cardVariants}
                  initial="hidden"
                  animate={isInView ? 'visible' : 'hidden'}
                  custom={index}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                >
                  <div className="career-role-top">
                    <h4 className="career-role-title">{role.title}</h4>
                    <span className="career-role-badge">Current</span>
                  </div>
                  <p className="career-role-company">{role.company}</p>
                  <p className="career-role-dates">
                    {formatLinkedInDateRange(
                      role.startDate,
                      role.endDate,
                      role.current
                    )}
                  </p>
                  {role.highlights?.[0] && (
                    <p className="career-role-blurb">{role.highlights[0]}</p>
                  )}
                </motion.article>
              ))}
            </div>
          </div>

          <div className="career-col career-col--edu">
            <h3 className="career-col-title">
              <FaGraduationCap /> Education
            </h3>
            <div className="career-edu-list">
              {education.map((edu, index) => (
                <motion.article
                  key={edu.id}
                  className="career-edu-card"
                  variants={cardVariants}
                  initial="hidden"
                  animate={isInView ? 'visible' : 'hidden'}
                  custom={index + roles.length}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                >
                  <h4 className="career-edu-degree">{edu.degree}</h4>
                  <p className="career-edu-school">{edu.school}</p>
                  <p className="career-edu-dates">
                    {edu.startYear} – {edu.endYear}
                  </p>
                </motion.article>
              ))}
            </div>
            <Link to="/career" className="career-cta career-cta--secondary">
              Full timeline on Career page <FaArrowRight />
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
