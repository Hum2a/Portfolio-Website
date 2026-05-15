import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../services/firebase';

/** Max documents per collection (keeps Traffic page responsive). */
export const TRAFFIC_LOAD_LIMIT = 800;

/**
 * Load analytics data from Firestore. Returns raw data; caller is responsible for setState.
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
    refHitsSnapshot,
  ] = await Promise.all([
    getDocs(query(collection(db, 'analytics_visitors'), orderBy('lastVisit', 'desc'), limit(TRAFFIC_LOAD_LIMIT))),
    getDocs(query(collection(db, 'analytics_pageviews'), orderBy('timestamp', 'desc'), limit(TRAFFIC_LOAD_LIMIT))),
    getDocs(query(collection(db, 'analytics_events'), orderBy('timestamp', 'desc'), limit(TRAFFIC_LOAD_LIMIT))),
    getDocs(query(collection(db, 'analytics_page_times'), orderBy('timestamp', 'desc'), limit(TRAFFIC_LOAD_LIMIT))),
    getDocs(query(collection(db, 'analytics_media_clicks'), orderBy('timestamp', 'desc'), limit(TRAFFIC_LOAD_LIMIT))),
    getDocs(query(collection(db, 'enquiries'), orderBy('timestamp', 'desc'), limit(TRAFFIC_LOAD_LIMIT))),
    getDocs(collection(db, 'analytics_stats')),
    getDocs(query(collection(db, 'analytics_ref_hits'), orderBy('timestamp', 'desc'), limit(TRAFFIC_LOAD_LIMIT))),
  ]);

  const visitors = visitorsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const pageViews = pageViewsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const events = eventsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const pageTimes = pageTimesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const mediaClicks = mediaClicksSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const enquiries = enquiriesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const refHits = refHitsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

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
    refHits,
    stats,
    loadLimit: TRAFFIC_LOAD_LIMIT,
    truncated: {
      visitors: visitors.length >= TRAFFIC_LOAD_LIMIT,
      pageViews: pageViews.length >= TRAFFIC_LOAD_LIMIT,
      events: events.length >= TRAFFIC_LOAD_LIMIT,
    },
  };
}
