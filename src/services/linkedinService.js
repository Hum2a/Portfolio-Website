import linkedinData from '../config/linkedin.json';

const CACHE_KEY = 'linkedin_profile_cache_v2';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

/**
 * LinkedIn does not expose a public profile API like GitHub.
 * Career data lives in src/config/linkedin.json (curated from the live profile)
 * and is served through this service so the page mirrors the GitHub fetch pattern
 * (async load + localStorage cache for consistency / future Worker proxy).
 */
export const getLinkedInProfileUrl = () =>
  process.env.REACT_APP_LINKEDIN_PROFILE_URL ||
  linkedinData.profile?.profileUrl ||
  'https://www.linkedin.com/in/humza-butt-201057208/';

function readCache() {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_DURATION) return data;
  } catch {
    // ignore corrupt cache
  }
  return null;
}

function writeCache(data) {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ data, timestamp: Date.now() })
    );
  } catch {
    // ignore quota / private mode
  }
}

async function loadLinkedInData() {
  const cached = readCache();
  if (cached) return cached;

  // Simulate async boundary (same UX as GitHub); swap for Worker fetch later if needed
  const data = await Promise.resolve(linkedinData);
  writeCache(data);
  return data;
}

export async function fetchLinkedInProfile() {
  try {
    const data = await loadLinkedInData();
    return data?.profile ?? null;
  } catch (err) {
    console.warn('LinkedIn profile load failed:', err);
    return linkedinData.profile ?? null;
  }
}

export async function fetchLinkedInExperience(options = {}) {
  const { category = 'all' } = options;
  try {
    const data = await loadLinkedInData();
    const list = Array.isArray(data?.experience) ? data.experience : [];
    if (category === 'all') return list;
    return list.filter((role) => role.category === category);
  } catch (err) {
    console.warn('LinkedIn experience load failed:', err);
    return linkedinData.experience ?? [];
  }
}

export async function fetchLinkedInEducation() {
  try {
    const data = await loadLinkedInData();
    return Array.isArray(data?.education) ? data.education : [];
  } catch (err) {
    console.warn('LinkedIn education load failed:', err);
    return linkedinData.education ?? [];
  }
}

export async function fetchLinkedInSkills() {
  try {
    const data = await loadLinkedInData();
    return Array.isArray(data?.skills) ? data.skills : [];
  } catch (err) {
    console.warn('LinkedIn skills load failed:', err);
    return linkedinData.skills ?? [];
  }
}

/** Format "2024-03" / null → display strings */
export function formatLinkedInDateRange(startDate, endDate, current) {
  const fmt = (iso) => {
    if (!iso) return '';
    const [y, m] = iso.split('-');
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];
    const mi = Number(m) - 1;
    return months[mi] ? `${months[mi]} ${y}` : y;
  };
  const start = fmt(startDate);
  const end = current ? 'Present' : fmt(endDate) || 'Present';
  return start ? `${start} – ${end}` : end;
}
