import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaGithub, FaStar, FaCodeBranch } from 'react-icons/fa';
import { fetchGitHubRepos, fetchGitHubProfile, getGitHubUsername } from '../services/githubService';
import '../styles/GitHubSection.css';

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const LANGUAGE_COLORS = {
  JavaScript: '#f7df1e',
  TypeScript: '#3178c6',
  Python: '#3776ab',
  Java: '#ed8b00',
  Kotlin: '#7f52ff',
  Swift: '#fa7343',
  'Objective-C': '#438eff',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Vue: '#41b883',
  Dart: '#00b4ab',
  Go: '#00add8',
  Rust: '#dea584',
  C: '#555555',
  'C++': '#00599c',
};

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
      <section className="github-section" ref={ref}>
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
    <section className="github-section" ref={ref}>
      <motion.div
        className="github-inner"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5 }}
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

        {repos.length > 0 && (
          <div className="github-grid">
            {repos.map((repo, index) => (
              <motion.a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="github-card"
                variants={cardVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                custom={index}
                whileHover={{ y: -6, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } }}
              >
                <div className="github-card-header">
                  <h3 className="github-card-name">{repo.name}</h3>
                  {repo.language && (
                    <span
                      className="github-card-language"
                      style={{
                        '--lang-color': LANGUAGE_COLORS[repo.language] || '#6b7280',
                      }}
                    >
                      {repo.language}
                    </span>
                  )}
                </div>
                {repo.description && (
                  <p className="github-card-desc">{repo.description}</p>
                )}
                {repo.topics?.length > 0 && (
                  <div className="github-card-topics">
                    {repo.topics.slice(0, 4).map((topic) => (
                      <span key={topic} className="github-topic">{topic}</span>
                    ))}
                  </div>
                )}
                <div className="github-card-stats">
                  <span className="github-stat">
                    <FaStar /> {repo.stargazers_count}
                  </span>
                  <span className="github-stat">
                    <FaCodeBranch /> {repo.forks_count}
                  </span>
                </div>
              </motion.a>
            ))}
          </div>
        )}

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
