import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaUsers, FaFolderOpen } from 'react-icons/fa';
import ContributionCalendar from '../components/github/ContributionCalendar';
import GitHubRepoPaperStack from '../components/github/GitHubRepoPaperStack';
import {
  fetchGitHubRepos,
  fetchGitHubProfile,
  fetchGitHubContributions,
  getGitHubUsername,
} from '../services/githubService';
import '../components/github/GitHubSection.css';
import './GitHubPage.css';
import Seo from '../components/seo/Seo';

export default function GitHub() {
  const [repos, setRepos] = useState([]);
  const [profile, setProfile] = useState(null);
  const [contributions, setContributions] = useState(null);
  const [contributionsLoading, setContributionsLoading] = useState(true);
  const [contributionsError, setContributionsError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [sortBy, setSortBy] = useState('updated');

  const username = getGitHubUsername();
  const profileUrl = `https://github.com/${username}`;

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

  useEffect(() => {
    let cancelled = false;

    async function loadContributions() {
      setContributionsLoading(true);
      setContributionsError(null);
      try {
        const calendar = await fetchGitHubContributions();
        if (!cancelled) {
          setContributions(calendar);
          if (!calendar) {
            setContributionsError('Could not load contribution data.');
          }
        }
      } catch (err) {
        if (!cancelled) {
          setContributionsError(err.message || 'Could not load contribution data.');
        }
      } finally {
        if (!cancelled) setContributionsLoading(false);
      }
    }

    loadContributions();
    return () => { cancelled = true; };
  }, []);

  if (loading && !profile) {
    return (
      <div className="github-page">
        <div className="github-page-loading">
          <FaGithub className="github-loading-icon" />
          <p>Loading GitHub profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="github-page">
      <Seo
        title="GitHub"
        description="Open-source work and recent GitHub activity from Humza Butt — repositories, contributions and stack."
        path="/github"
      />

      <motion.div
        className="github-page-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="github-page-header">
          <h1 className="github-page-title">GitHub</h1>
          <p className="github-page-subtitle">
            Live data from my GitHub profile
          </p>
        </div>

        {username && (
          <div className="github-contribution-section github-contribution-section--hero surface-2">
            <h2 className="github-contribution-title">Contribution activity</h2>
            <ContributionCalendar
              calendar={contributions}
              loading={contributionsLoading}
              error={contributionsError}
              username={username}
            />
          </div>
        )}

        {error && !profile && (
          <div className="github-page-error">
            <p>Unable to load GitHub data. Check the console or try again later.</p>
            <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="github-external-fallback">
              View profile on GitHub →
            </a>
          </div>
        )}

        {profile && (
          <div className="github-profile-card surface-2">
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
          </div>
        )}

        {repos.length > 0 && (
          <>
            <div className="github-repos-header">
              <h2 className="github-repos-title">Repositories</h2>
                <label className="github-sort">
                  <span className="github-sort-label">Sort by</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="github-sort-select"
                    aria-label="Sort repositories"
                  >
                    <option value="updated">Last updated</option>
                    <option value="stars">Stars</option>
                    <option value="name">Name</option>
                  </select>
                </label>
            </div>

            <GitHubRepoPaperStack key={sortBy} repos={repos} />
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
