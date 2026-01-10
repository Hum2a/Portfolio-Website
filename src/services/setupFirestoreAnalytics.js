import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

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