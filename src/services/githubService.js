const CACHE_KEY = 'github_repos_cache';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

const getGitHubUsername = () => {
  return process.env.REACT_APP_GITHUB_USERNAME || 'Hum2a';
};

/**
 * Fetch user repos from GitHub API (public, no auth needed)
 * Caches results to reduce API calls (60/hour unauthenticated limit)
 */
export async function fetchGitHubRepos(options = {}) {
  const { sort = 'updated', perPage = 12, excludeForks = true } = options;
  const username = getGitHubUsername();

  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return data;
      }
    }

    const params = new URLSearchParams({
      sort,
      per_page: perPage,
      type: excludeForks ? 'owner' : 'all',
    });

    const res = await fetch(
      `https://api.github.com/users/${username}/repos?${params}`,
      {
        headers: { Accept: 'application/vnd.github.v3+json' },
      }
    );

    if (!res.ok) {
      if (res.status === 403) throw new Error('GitHub API rate limit exceeded');
      throw new Error(`GitHub API error: ${res.status}`);
    }

    const data = await res.json();
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
    return data;
  } catch (err) {
    console.warn('GitHub fetch failed:', err);
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data } = JSON.parse(cached);
      return data; // Fallback to stale cache
    }
    return null;
  }
}

/**
 * Fetch GitHub user profile
 */
export async function fetchGitHubProfile() {
  const username = getGitHubUsername();
  try {
    const res = await fetch(`https://api.github.com/users/${username}`, {
      headers: { Accept: 'application/vnd.github.v3+json' },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export { getGitHubUsername };
