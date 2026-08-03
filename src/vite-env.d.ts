/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
  readonly VITE_IPINFO_TOKEN: string;
  readonly VITE_TRAFFIC_NOTIFY_SECRET: string;
  readonly VITE_ENABLE_ANALYTICS: string;
  readonly VITE_GITHUB_USERNAME: string;
  readonly VITE_GITHUB_TOKEN: string;
  readonly VITE_LINKEDIN_PROFILE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
