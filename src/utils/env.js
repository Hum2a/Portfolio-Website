/**
 * Utility functions for working with environment variables
 */

/**
 * Get an environment variable with a default value if not set
 * @param {string} key - The environment variable key
 * @param {string} defaultValue - Default value to use if the environment variable is not set
 * @returns {string} The environment variable value or the default
 */
export const getEnv = (key, defaultValue = '') => {
  return process.env[key] || defaultValue;
};

/**
 * Firebase configuration from environment variables
 */
export const firebaseConfig = {
  apiKey: getEnv('REACT_APP_FIREBASE_API_KEY'),
  authDomain: getEnv('REACT_APP_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnv('REACT_APP_FIREBASE_PROJECT_ID'),
  storageBucket: getEnv('REACT_APP_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnv('REACT_APP_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnv('REACT_APP_FIREBASE_APP_ID')
};

/**
 * Other API keys and configuration
 */
export const apiKeys = {
  ipinfoToken: getEnv('REACT_APP_IPINFO_TOKEN')
};

/**
 * Feature flags
 */
export const featureFlags = {
  enableAnalytics: getEnv('REACT_APP_ENABLE_ANALYTICS', 'true') === 'true'
}; 