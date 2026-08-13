import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { firebaseConfig, isFirebaseConfigured } from '../utils/env';

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (isFirebaseConfigured()) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.error('Firebase failed to initialize; continuing without it.', error);
    app = null;
    auth = null;
    db = null;
  }
} else if (import.meta.env.DEV) {
  console.warn(
    'Firebase env vars are missing or invalid. Auth, analytics, and contact writes are disabled. Set VITE_FIREBASE_* in .env and rebuild.'
  );
}

export { auth, db };
export default app;
