import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaGithub } from 'react-icons/fa';
import { fetchGitHubRepos, fetchGitHubProfile, getGitHubUsername } from '../../services/githubService';
import GitHubRepoPaperStack from './GitHubRepoPaperStack';
import SectionBackdrop from '../media/SectionBackdrop';
import './GitHubSection.css';

export function GitHubSection() {
  const [repos, setRepos] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  const username = getGitHubUsername();
  const profileUrl = `https://github.com/${username}`;

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [reposData, profileData] = await Promise.all([
          fetchGitHubRepos({ sort: 'updated', perPage: 8, excludeForks: true }),
          fetchGitHubProfile(),
        ]);
        if (!cancelled) {
          setRepos(Array.isArray(reposData) ? reposData : []);
          setProfile(profileData);
          setError(!reposData && !profileData);
        }
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <section id="github" className="github-section" ref={ref}>
        <div className="github-inner">
          <div className="github-loading">
            <FaGithub className="github-loading-icon" />
            <p>Loading GitHub repositories...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error || (!repos?.length && !profile)) {
    return null;
  }

  return (
    <section id="github" className="github-section" ref={ref}>
      <SectionBackdrop
        src="/images/Bgr8/Matching Algorithm.png"
        placement="right"
        intensity={0.12}
        tint="accent"
      />
      <motion.div
        className="github-inner"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.28 }}
      >
        <div className="github-header">
          <div className="github-header-top">
            {profile?.avatar_url && (
              <img
                src={profile.avatar_url}
                alt={profile.name || username}
                className="github-avatar"
              />
            )}
            <div className="github-header-text">
              <span className="github-label">{'// Open Source'}</span>
              <h2 className="github-title">Code on GitHub</h2>
              <p className="github-subtitle">
                {profile?.bio || 'Explore my repositories and open-source contributions'}
              </p>
              <a
                href={profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="github-profile-link"
              >
                <FaGithub /> View profile on GitHub
              </a>
            </div>
          </div>
        </div>

        {repos.length > 0 && <GitHubRepoPaperStack repos={repos} />}

        <div className="github-footer">
          <a
            href={`${profileUrl}?tab=repositories`}
            target="_blank"
            rel="noopener noreferrer"
            className="github-view-all"
          >
            View all repositories
          </a>
        </div>
      </motion.div>
    </section>
  );
}
