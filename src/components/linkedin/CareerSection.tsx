import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { FaArrowRight, FaMapMarkerAlt } from 'react-icons/fa';
import {
  fetchLinkedInProfile,
  fetchLinkedInExperience,
  fetchLinkedInEducation,
} from '../../services/linkedinService';
import SectionBackdrop from '../media/SectionBackdrop';
import CareerTimeline from './CareerTimeline';
import './CareerSection.css';

/** Homepage: CoreStream + current software roles, CoreStream first if not current */
function pickHomepageRoles(list) {
  const software = Array.isArray(list) ? list : [];
  const corestream = software.find((r) => r.id === 'corestream');
  const current = software.filter((r) => r.current && r.id !== 'corestream');
  const picked = [];
  if (corestream) picked.push(corestream);
  for (const r of current) {
    if (picked.length >= 4) break;
    picked.push(r);
  }
  // Prefer LifeSmart + Bgr8 if we still have room and they weren't included
  return picked.slice(0, 4);
}

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
          setRoles(pickHomepageRoles(expData));
          setEducation(
            Array.isArray(eduData)
              ? eduData.filter((e) => e.id !== 'wcgs').slice(0, 2)
              : []
          );
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
      <section id="career" className="career-section" ref={ref}>
        <div className="career-inner">
          <div className="career-loading">
            <p>Loading career...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!profile) return null;

  return (
    <section id="career" className="career-section" ref={ref}>
      <SectionBackdrop
        src="/images/linkedin/avatar.jpg"
        placement="right"
        intensity={0.12}
        tint="accent"
      />
      <motion.div
        className="career-inner"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="career-header">
          <div className="career-header-text">
            <span className="career-label">Career</span>
            <h2 className="career-title">Experience &amp; education</h2>
            <p className="career-headline">{profile.headline}</p>
            {profile.location && (
              <p className="career-location">
                <FaMapMarkerAlt aria-hidden="true" /> {profile.location}
              </p>
            )}
            <p className="career-about">{profile.about}</p>
          </div>
          <Link to="/career" className="career-cta">
            View full career <FaArrowRight aria-hidden="true" />
          </Link>
        </div>

        <CareerTimeline roles={roles} />

        {education.length > 0 && (
          <div className="career-edu-strip">
            <h3 className="career-edu-heading">Education</h3>
            <ul className="career-edu-list">
              {education.map((edu) => (
                <li key={edu.id}>
                  <span className="career-edu-degree">{edu.degree}</span>
                  <span className="career-edu-meta">
                    {edu.school} · {edu.startYear}–{edu.endYear}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Link to="/career" className="career-cta career-cta--secondary">
          Full timeline on Career page <FaArrowRight aria-hidden="true" />
        </Link>
      </motion.div>
    </section>
  );
}
