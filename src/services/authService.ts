import { 
  signInWithPopup, 
  signOut, 
  GoogleAuthProvider,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

const googleProvider = new GoogleAuthProvider();

/**
 * Ensure user document exists in Firestore
 * Creates it if it doesn't exist, updates metadata if it does
 */
export const ensureUserDocument = async (user) => {
  try {
    if (!user) return null;

    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    
    const userData = {
      email: user.email,
      displayName: user.displayName || null,
      photoURL: user.photoURL || null,
      updatedAt: serverTimestamp()
    };

    // If user doesn't exist, create a new user document with default role "user"
    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        ...userData,
        role: 'user', // Default role
        createdAt: serverTimestamp()
      });
      return 'user'; // Return default role
    }
    
    // If user exists, update metadata but preserve role
    const existingData = userDoc.data();
    await setDoc(userDocRef, {
      ...userData,
      role: existingData.role || 'user', // Preserve existing role or default to 'user'
      createdAt: existingData.createdAt || serverTimestamp() // Preserve or set createdAt
    }, { merge: true });
    
    return existingData.role || 'user';
  } catch (error) {
    console.error('Error ensuring user document:', error);
    return 'user'; // Return default role on error
  }
};

/**
 * Sign in with Google
 */
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Ensure user document exists in Firestore
    const role = await ensureUserDocument(user);
    
    return { user, role };
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

/**
 * Sign out
 */
export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

/**
 * Get user role from Firestore
 */
export const getUserRole = async (uid) => {
  try {
    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      return userDoc.data().role || 'user';
    }
    return 'user'; // Default role
  } catch (error) {
    console.error('Error getting user role:', error);
    return 'user';
  }
};

/**
 * Check if user has "humza" role
 */
export const isHumza = async (uid) => {
  const role = await getUserRole(uid);
  return role === 'humza';
};

/**
 * Subscribe to auth state changes
 */
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Ensure user document exists and get role
      // This ensures the document is created even if it wasn't created during sign-in
      const role = await ensureUserDocument(user);
      callback({ user, role });
    } else {
      callback(null);
    }
  });
};
