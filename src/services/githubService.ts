const CACHE_KEY = 'github_repos_cache_v2';
const CONTRIBUTIONS_CACHE_KEY = 'github_contributions_cache';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

const CONTRIBUTIONS_QUERY = `
  query($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              contributionLevel
              weekday
              color
            }
          }
        }
      }
    }
  }
`;

const getGitHubUsername = () => {
  return import.meta.env.VITE_GITHUB_USERNAME || 'Hum2a';
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
    const filtered = (Array.isArray(data) ? data : []).filter(
      (repo) => repo?.name !== 'Portfolio-Website'
    );
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ data: filtered, timestamp: Date.now() })
    );
    return filtered;
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

/**
 * Fetch contribution calendar via GitHub GraphQL (public profile data).
 * Optional REACT_APP_GITHUB_TOKEN increases rate limits.
 */
let publicEventsCache = null;
let publicEventsCacheTime = 0;

async function fetchPublicEvents() {
  if (publicEventsCache && Date.now() - publicEventsCacheTime < CACHE_DURATION) {
    return publicEventsCache;
  }

  const username = getGitHubUsername();
  const token = import.meta.env.VITE_GITHUB_TOKEN;
  const headers = { Accept: 'application/vnd.github.v3+json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const events = [];
  for (let page = 1; page <= 3; page += 1) {
    const res = await fetch(
      `https://api.github.com/users/${username}/events/public?per_page=100&page=${page}`,
      { headers },
    );
    if (!res.ok) break;
    const batch = await res.json();
    if (!Array.isArray(batch) || batch.length === 0) break;
    events.push(...batch);
    if (batch.length < 100) break;
  }

  publicEventsCache = events;
  publicEventsCacheTime = Date.now();
  return events;
}

/**
 * Best-effort public activity breakdown for a single day (recent events only).
 */
export async function fetchGitHubDayBreakdown(dateStr) {
  try {
    const events = await fetchPublicEvents();
    const target = dateStr.slice(0, 10);
    const counts = {
      commits: 0,
      pullRequests: 0,
      issues: 0,
      reviews: 0,
    };

    for (const event of events) {
      if (event.created_at?.slice(0, 10) !== target) continue;

      switch (event.type) {
        case 'PushEvent':
          counts.commits += event.payload?.commits?.length || event.payload?.size || 1;
          break;
        case 'PullRequestEvent':
          counts.pullRequests += 1;
          break;
        case 'IssuesEvent':
          if (event.payload?.action === 'opened') counts.issues += 1;
          break;
        case 'PullRequestReviewEvent':
          counts.reviews += 1;
          break;
        default:
          break;
      }
    }

    const breakdown = [
      { label: 'Commits', count: counts.commits },
      { label: 'Pull requests', count: counts.pullRequests },
      { label: 'Issues', count: counts.issues },
      { label: 'Code reviews', count: counts.reviews },
    ].filter((item) => item.count > 0);

    return breakdown.length > 0 ? breakdown : null;
  } catch {
    return null;
  }
}

export async function fetchGitHubContributions() {
  const username = getGitHubUsername();
  const token = import.meta.env.VITE_GITHUB_TOKEN;

  try {
    const cached = localStorage.getItem(CONTRIBUTIONS_CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return data;
      }
    }

    const headers = {
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query: CONTRIBUTIONS_QUERY,
        variables: { login: username },
      }),
    });

    if (!res.ok) {
      if (res.status === 403) throw new Error('GitHub API rate limit exceeded');
      throw new Error(`GitHub GraphQL error: ${res.status}`);
    }

    const json = await res.json();
    if (json.errors?.length) {
      throw new Error(json.errors[0]?.message || 'GraphQL query failed');
    }

    const calendar = json.data?.user?.contributionsCollection?.contributionCalendar;
    if (!calendar?.weeks) {
      throw new Error('Contribution calendar unavailable');
    }

    localStorage.setItem(
      CONTRIBUTIONS_CACHE_KEY,
      JSON.stringify({ data: calendar, timestamp: Date.now() }),
    );
    return calendar;
  } catch (err) {
    console.warn('GitHub contributions fetch failed:', err);
    const cached = localStorage.getItem(CONTRIBUTIONS_CACHE_KEY);
    if (cached) {
      const { data } = JSON.parse(cached);
      return data;
    }
    return null;
  }
}

export { getGitHubUsername };
