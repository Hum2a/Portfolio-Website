import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  limit,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { OWNER_TAG_MINE } from '../constants/ownerTags';

const OWNER_TAGS_COLLECTION = 'analytics_owner_tags';
const BATCH_SIZE = 400;

const COLLECTIONS_BY_IP = [
  'analytics_pageviews',
  'analytics_events',
  'analytics_page_times',
  'analytics_media_clicks',
  'analytics_ref_hits',
  'analytics_sessions',
];

/** Anonymized IP key stored in localStorage by firebaseAnalytics. */
export function getBrowserAnonymizedIP() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('anonymizedIP');
}

export async function listOwnerTags() {
  const snap = await getDocs(collection(db, OWNER_TAGS_COLLECTION));
  const map = {};
  snap.docs.forEach((d) => {
    map[d.id] = { id: d.id, ...d.data() };
  });
  return map;
}

function getLocalVisitorId() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('analytics_visitor_id') || localStorage.getItem('visitorId');
}

export async function setOwnerTag(anonymizedIP, label = OWNER_TAG_MINE) {
  const key = (anonymizedIP || '').trim();
  if (!key) throw new Error('Invalid visitor key');

  await setDoc(doc(db, OWNER_TAGS_COLLECTION, key), {
    label: label || OWNER_TAG_MINE,
    taggedAt: serverTimestamp(),
    visitorId: getLocalVisitorId(),
  });
}

/** Batch-tag many visitor keys (e.g. auto-tag anon_* as Claude Cowork). */
export async function setOwnerTagsBatch(keys, label = OWNER_TAG_MINE) {
  const unique = [
    ...new Set(
      (keys || [])
        .map((k) => (k || '').trim())
        .filter(Boolean)
    ),
  ];
  if (!unique.length) return 0;

  const visitorId = getLocalVisitorId();
  const resolvedLabel = label || OWNER_TAG_MINE;

  for (let i = 0; i < unique.length; i += BATCH_SIZE) {
    const batch = writeBatch(db);
    const chunk = unique.slice(i, i + BATCH_SIZE);
    chunk.forEach((key) => {
      batch.set(doc(db, OWNER_TAGS_COLLECTION, key), {
        label: resolvedLabel,
        taggedAt: serverTimestamp(),
        visitorId,
      });
    });
    await batch.commit();
  }

  return unique.length;
}

export async function removeOwnerTag(anonymizedIP) {
  const key = (anonymizedIP || '').trim();
  if (!key) return;
  await deleteDoc(doc(db, OWNER_TAGS_COLLECTION, key));
}

async function deleteDocsInBatches(docRefs) {
  let deleted = 0;
  for (let i = 0; i < docRefs.length; i += BATCH_SIZE) {
    const batch = writeBatch(db);
    docRefs.slice(i, i + BATCH_SIZE).forEach((ref) => batch.delete(ref));
    await batch.commit();
    deleted += Math.min(BATCH_SIZE, docRefs.length - i);
  }
  return deleted;
}

async function deleteByField(collectionName, field, value) {
  if (!value) return 0;
  let total = 0;
  while (true) {
    const q = query(
      collection(db, collectionName),
      where(field, '==', value),
      limit(BATCH_SIZE)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) break;
    await deleteDocsInBatches(snapshot.docs.map((d) => d.ref));
    total += snapshot.size;
    if (snapshot.size < BATCH_SIZE) break;
  }
  return total;
}

async function deleteVisitorSubcollection(anonymizedIP) {
  const subRef = collection(db, 'analytics_visitors', anonymizedIP, 'pageviews');
  const snap = await getDocs(subRef);
  if (snap.empty) return 0;
  return deleteDocsInBatches(snap.docs.map((d) => d.ref));
}

/**
 * Delete all analytics documents tied to an anonymized IP (and optional visitorId).
 * Rollup docs in analytics_stats are not adjusted (headlines may be slightly high until reset).
 */
export async function deleteAnalyticsForIP(anonymizedIP) {
  const key = (anonymizedIP || '').trim();
  if (!key) throw new Error('Invalid visitor key');

  const result = {
    anonymizedIP: key,
    visitorDoc: 0,
    visitorSubPageviews: 0,
    pageviews: 0,
    events: 0,
    pageTimes: 0,
    mediaClicks: 0,
    refHits: 0,
    sessions: 0,
    ownerTag: 0,
  };

  const visitorRef = doc(db, 'analytics_visitors', key);
  const visitorSnap = await getDoc(visitorRef);
  const visitorId = visitorSnap.exists() ? visitorSnap.data()?.visitorId : null;

  result.visitorSubPageviews = await deleteVisitorSubcollection(key);

  for (const collName of COLLECTIONS_BY_IP) {
    const count = await deleteByField(collName, 'anonymizedIP', key);
    if (collName === 'analytics_pageviews') result.pageviews = count;
    else if (collName === 'analytics_events') result.events = count;
    else if (collName === 'analytics_page_times') result.pageTimes = count;
    else if (collName === 'analytics_media_clicks') result.mediaClicks = count;
    else if (collName === 'analytics_ref_hits') result.refHits = count;
    else if (collName === 'analytics_sessions') result.sessions = count;
  }

  if (visitorId) {
    for (const collName of COLLECTIONS_BY_IP) {
      await deleteByField(collName, 'visitorId', visitorId);
    }
  }

  if (visitorSnap.exists()) {
    await deleteDoc(visitorRef);
    result.visitorDoc = 1;
  }

  try {
    await removeOwnerTag(key);
    result.ownerTag = 1;
  } catch {
    // tag may not exist
  }

  result.total =
    result.visitorDoc +
    result.visitorSubPageviews +
    result.pageviews +
    result.events +
    result.pageTimes +
    result.mediaClicks +
    result.refHits +
    result.sessions;

  return result;
}
