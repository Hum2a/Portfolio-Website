import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaStar, FaCodeBranch, FaUsers, FaFolderOpen } from 'react-icons/fa';
import HamburgerMenu from '../components/HamburgerMenu';
import Navbar from '../components/Navbar';
import {
  fetchGitHubRepos,
  fetchGitHubProfile,
  getGitHubUsername,
} from '../services/githubService';
import '../styles/GitHubSection.css';
import '../styles/GitHubPage.css';

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

export default function GitHub() {
  const [repos, setRepos] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [sortBy, setSortBy] = useState('updated');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const username = getGitHubUsername();
  const profileUrl = `https://github.com/${username}`;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const sortMap = { updated: 'updated', stars: 'stars', name: 'full_name' };
        const [reposData, profileData] = await Promise.all([
          fetchGitHubRepos({
            sort: sortMap[sortBy] || 'updated',
            perPage: 30,
            excludeForks: true,
          }),
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
  }, [sortBy]);

  if (loading && !profile) {
    return (
      <div className="github-page">
        {isMobile ? <HamburgerMenu /> : <Navbar />}
        <div className="github-page-loading">
          <FaGithub className="github-loading-icon" />
          <p>Loading GitHub profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="github-page">
      {isMobile ? <HamburgerMenu /> : <Navbar />}

      <motion.div
        className="github-page-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="github-page-header">
          <h1 className="github-page-title">
            <span className="code-comment">{'//'}</span> GitHub
          </h1>
          <p className="github-page-subtitle">
            Live data from my GitHub profile
          </p>
        </div>

        {error && !profile && (
          <div className="github-page-error">
            <p>Unable to load GitHub data. Check the console or try again later.</p>
            <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="github-external-fallback">
              View profile on GitHub →
            </a>
          </div>
        )}

        {profile && (
          <div className="github-profile-card">
            <div className="github-profile-main">
              <img
                src={profile.avatar_url}
                alt={profile.name || username}
                className="github-profile-avatar"
              />
              <div className="github-profile-info">
                <h2 className="github-profile-name">{profile.name || username}</h2>
                <p className="github-profile-login">@{profile.login}</p>
                {profile.bio && (
                  <p className="github-profile-bio">{profile.bio}</p>
                )}
                <div className="github-profile-stats">
                  <span className="github-profile-stat">
                    <FaFolderOpen /> {profile.public_repos} repos
                  </span>
                  <span className="github-profile-stat">
                    <FaUsers /> {profile.followers} followers
                  </span>
                  <span className="github-profile-stat">
                    {profile.following} following
                  </span>
                </div>
                <a
                  href={profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="github-profile-cta"
                >
                  <FaGithub /> Open on GitHub
                </a>
              </div>
            </div>

            {username && (
              <div className="github-contribution-section">
                <h3 className="github-contribution-title">Contribution activity</h3>
                <img
                  src={`https://ghchart.rshah.org/${username}`}
                  alt="GitHub contribution chart"
                  className="github-contribution-chart"
                />
              </div>
            )}
          </div>
        )}

        {repos.length > 0 && (
          <>
            <div className="github-repos-header">
              <h2 className="github-repos-title">Repositories</h2>
              <div className="github-sort">
                <span className="github-sort-label">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="github-sort-select"
                >
                  <option value="updated">Last updated</option>
                  <option value="stars">Stars</option>
                  <option value="name">Name</option>
                </select>
              </div>
            </div>

            <div className="github-repos-grid">
              {repos.map((repo, index) => (
                <motion.a
                  key={repo.id}
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="github-repo-card"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: Math.min(index * 0.03, 0.3),
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  whileHover={{ y: -6, transition: { duration: 0.25 } }}
                >
                  <div className="github-repo-header">
                    <h3 className="github-repo-name">{repo.name}</h3>
                    {repo.language && (
                      <span
                        className="github-repo-language"
                        style={{
                          '--lang-color': LANGUAGE_COLORS[repo.language] || '#6b7280',
                        }}
                      >
                        {repo.language}
                      </span>
                    )}
                  </div>
                  {repo.description && (
                    <p className="github-repo-desc">{repo.description}</p>
                  )}
                  {repo.topics?.length > 0 && (
                    <div className="github-repo-topics">
                      {repo.topics.slice(0, 5).map((topic) => (
                        <span key={topic} className="github-repo-topic">{topic}</span>
                      ))}
                    </div>
                  )}
                  <div className="github-repo-stats">
                    <span className="github-repo-stat">
                      <FaStar /> {repo.stargazers_count}
                    </span>
                    <span className="github-repo-stat">
                      <FaCodeBranch /> {repo.forks_count}
                    </span>
                  </div>
                </motion.a>
              ))}
            </div>
          </>
        )}

        {profile && (
          <div className="github-page-footer">
            <a
              href={`${profileUrl}?tab=repositories`}
              target="_blank"
              rel="noopener noreferrer"
              className="github-view-all-btn"
            >
              View all repositories on GitHub
            </a>
          </div>
        )}
      </motion.div>
    </div>
  );
}
