/**
 * Utility functions for working with environment variables (Vite).
 */

/**
 * Get an environment variable with a default value if not set.
 * Accepts either VITE_* keys or legacy REACT_APP_* keys (mapped automatically).
 */
export const getEnv = (key: string, defaultValue = ''): string => {
  const viteKey = key.startsWith('REACT_APP_')
    ? `VITE_${key.slice('REACT_APP_'.length)}`
    : key.startsWith('VITE_')
      ? key
      : key;
  const value = (import.meta.env as Record<string, string | undefined>)[viteKey];
  return (value !== undefined && value !== '') ? String(value) : defaultValue;
};

/**
 * Public asset base URL. Vite serves public/ at `/`; keep empty for root-relative paths.
 */
export const publicUrl = '';

/**
 * Firebase configuration from environment variables
 */
export const firebaseConfig = {
  apiKey: getEnv('VITE_FIREBASE_API_KEY'),
  authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnv('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnv('VITE_FIREBASE_APP_ID'),
};

const PLACEHOLDER_API_KEY = 'your_firebase_api_key';

/** True when Vite baked in a non-placeholder Firebase API key at build time. */
export const isFirebaseConfigured = (): boolean => {
  const key = firebaseConfig.apiKey.trim();
  return Boolean(
    key &&
      key !== PLACEHOLDER_API_KEY &&
      firebaseConfig.projectId.trim() &&
      firebaseConfig.appId.trim()
  );
};

/**
 * Other API keys and configuration
 */
export const apiKeys = {
  ipinfoToken: getEnv('VITE_IPINFO_TOKEN'),
  /** Shared with Worker NOTIFY_SECRET — soft gate only; Resend key stays server-side */
  trafficNotifySecret: getEnv('VITE_TRAFFIC_NOTIFY_SECRET'),
};

/**
 * Feature flags
 */
export const featureFlags = {
  enableAnalytics: getEnv('VITE_ENABLE_ANALYTICS', 'true') === 'true',
};
