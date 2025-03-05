import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC2z-bw004i2Ns5bLReBv444RZO2mu0ZiY",
  authDomain: "portfolio-110f1.firebaseapp.com",
  projectId: "portfolio-110f1",
  storageBucket: "portfolio-110f1.firebasestorage.app",
  messagingSenderId: "236653178863",
  appId: "1:236653178863:web:f14820795c55cfd785901a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Setup Firestore collections for analytics
const setupFirestoreAnalytics = async () => {
  try {
    // Create analytics_stats document with initial values
    await setDoc(doc(db, 'analytics_stats', 'visitors'), {
      total: 0,
      lastUpdated: new Date()
    }, { merge: true });
    
    await setDoc(doc(db, 'analytics_stats', 'pages'), {
      total: 0,
      lastUpdated: new Date()
    }, { merge: true });
    
    await setDoc(doc(db, 'analytics_stats', 'events'), {
      total: 0,
      lastUpdated: new Date()
    }, { merge: true });
    
    return true;
  } catch (error) {
    return false;
  }
};

export default setupFirestoreAnalytics; 