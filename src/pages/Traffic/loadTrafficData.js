import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../services/firebase';

/**
 * Load all analytics data from Firestore. Returns raw data; caller is responsible for setState.
 */
export async function loadTrafficData() {
  const [
    visitorsSnapshot,
    pageViewsSnapshot,
    eventsSnapshot,
    pageTimesSnapshot,
    mediaClicksSnapshot,
    enquiriesSnapshot,
    statsSnapshot,
  ] = await Promise.all([
    getDocs(query(collection(db, 'analytics_visitors'), orderBy('lastVisit', 'desc'))),
    getDocs(query(collection(db, 'analytics_pageviews'), orderBy('timestamp', 'desc'))),
    getDocs(query(collection(db, 'analytics_events'), orderBy('timestamp', 'desc'))),
    getDocs(query(collection(db, 'analytics_page_times'), orderBy('timestamp', 'desc'))),
    getDocs(query(collection(db, 'analytics_media_clicks'), orderBy('timestamp', 'desc'))),
    getDocs(query(collection(db, 'enquiries'), orderBy('timestamp', 'desc'))),
    getDocs(collection(db, 'analytics_stats')),
  ]);

  const visitors = visitorsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const pageViews = pageViewsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const events = eventsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const pageTimes = pageTimesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const mediaClicks = mediaClicksSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const enquiries = enquiriesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  const stats = {};
  statsSnapshot.forEach((doc) => {
    stats[doc.id] = doc.data();
  });

  return {
    visitors,
    pageViews,
    events,
    pageTimes,
    mediaClicks,
    enquiries,
    stats,
  };
}
