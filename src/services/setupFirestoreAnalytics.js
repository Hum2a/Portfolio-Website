import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

const ts = () => serverTimestamp();

const setupFirestoreAnalytics = async () => {
  try {
    const docs = {
      visitors: { total: 0, newVisitors: 0, returning: 0, prod_total: 0, local_total: 0, lastUpdated: ts() },
      pages: { total: 0, prod_total: 0, local_total: 0, lastUpdated: ts() },
      events: { total: 0, prod_total: 0, lastUpdated: ts() },
      page_times: { total: 0, count: 0, prod_total: 0, prod_count: 0, lastUpdated: ts() },
      media_clicks: { total: 0, prod_total: 0, lastUpdated: ts() },
      daily: { days: {}, lastUpdated: ts() },
      ref_tokens: { totalClicks: 0, tokens: {}, lastUpdated: ts() },
      campaigns: { total: 0, prod_total: 0, lastUpdated: ts() },
      engagement: { sessionsEnded: 0, bounce_under_5s: 0, sessions_over_30s: 0, lastUpdated: ts() },
      contact_forms: { total: 0, prod_total: 0, lastUpdated: ts() },
      scroll_depth: { total: 0, prod_total: 0, lastUpdated: ts() },
    };

    await Promise.all(
      Object.entries(docs).map(([id, data]) =>
        setDoc(doc(db, 'analytics_stats', id), data, { merge: true })
      )
    );

    return true;
  } catch (error) {
    return false;
  }
};

export default setupFirestoreAnalytics;
