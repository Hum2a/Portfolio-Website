import { doc, getDoc, setDoc, updateDoc, deleteDoc, increment, collection, query, orderBy, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

const TOKENS_COLLECTION = 'analytics_tracking_tokens';
const COOKIE_NAME = '_pb_ref';
const COOKIE_DAYS = 90;

/**
 * Generate a short URL-safe token (8 chars)
 */
function generateToken() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const randomValues = new Uint8Array(8);
  crypto.getRandomValues(randomValues);
  for (let i = 0; i < 8; i++) {
    result += chars[randomValues[i] % chars.length];
  }
  return result;
}

/**
 * Create a new tracking token and store in Firestore
 * @param {Object} params - { source, medium, campaign, label }
 * @returns {Promise<{ token, url }>}
 */
export async function createTrackingToken({ source, medium = null, campaign = null, label = null }) {
  if (!source || typeof source !== 'string') {
    throw new Error('Source is required');
  }

  let token = generateToken();
  let attempts = 0;
  const maxAttempts = 5;

  while (attempts < maxAttempts) {
    const tokenRef = doc(db, TOKENS_COLLECTION, token);
    const existing = await getDoc(tokenRef);
    if (!existing.exists()) {
      await setDoc(tokenRef, {
        token,
        source: source.toLowerCase().trim(),
        medium: medium ? medium.toLowerCase().trim() : null,
        campaign: campaign ? campaign.toLowerCase().trim() : null,
        label: label || null,
        createdAt: serverTimestamp(),
        clicks: 0,
      });
      return { token };
    }
    token = generateToken();
    attempts++;
  }

  throw new Error('Could not generate unique token');
}

/**
 * Look up a tracking token from Firestore
 * @param {string} token
 * @returns {Promise<{ source, medium, campaign } | null>}
 */
export async function lookupTrackingToken(token) {
  if (!token || typeof token !== 'string') return null;

  const tokenRef = doc(db, TOKENS_COLLECTION, token.toLowerCase().trim());
  const snap = await getDoc(tokenRef);
  if (!snap.exists()) return null;

  const data = snap.data();
  return {
    source: data.source,
    medium: data.medium || null,
    campaign: data.campaign || null,
  };
}

/**
 * Increment click count for a token (fire-and-forget)
 */
export async function incrementTokenClicks(token) {
  try {
    const tokenRef = doc(db, TOKENS_COLLECTION, token.toLowerCase().trim());
    await updateDoc(tokenRef, { clicks: increment(1), lastUsedAt: new Date() });
  } catch {
    // Ignore - analytics shouldn't block
  }
}

/**
 * Set attribution cookie (persists source across visits)
 */
export function setAttributionCookie(attribution) {
  const expires = new Date();
  expires.setDate(expires.getDate() + COOKIE_DAYS);
  const value = JSON.stringify({
    ...attribution,
    setAt: Date.now(),
  });
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(value)}; path=/; max-age=${COOKIE_DAYS * 24 * 60 * 60}; SameSite=Lax`;
}

/**
 * Get attribution from cookie (for returning visitors)
 */
export function getAttributionFromCookie() {
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
  if (!match) return null;

  try {
    const decoded = decodeURIComponent(match[1]);
    const data = JSON.parse(decoded);
    if (data.source) {
      return {
        source: data.source,
        medium: data.medium || null,
        campaign: data.campaign || null,
      };
    }
  } catch {
    // Invalid cookie
  }
  return null;
}

/**
 * List all tracking tokens (for Traffic panel)
 */
export async function listTrackingTokens() {
  const ref = collection(db, TOKENS_COLLECTION);
  const q = query(ref, orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Update tracking token attributes (source, medium, campaign, label)
 * @param {string} tokenId - Document ID (the token string)
 * @param {Object} attrs - { source?, medium?, campaign?, label? }
 */
export async function updateTrackingToken(tokenId, { source, medium, campaign, label }) {
  if (!tokenId || typeof tokenId !== 'string') {
    throw new Error('Token ID is required');
  }
  const tokenRef = doc(db, TOKENS_COLLECTION, tokenId.toLowerCase().trim());
  const snap = await getDoc(tokenRef);
  if (!snap.exists()) {
    throw new Error('Token not found');
  }
  const updates = {};
  if (source !== undefined) updates.source = source ? source.toLowerCase().trim() : null;
  if (medium !== undefined) updates.medium = medium ? medium.toLowerCase().trim() : null;
  if (campaign !== undefined) updates.campaign = campaign ? campaign.toLowerCase().trim() : null;
  if (label !== undefined) updates.label = label || null;
  if (Object.keys(updates).length === 0) return;
  await updateDoc(tokenRef, updates);
}

/**
 * Delete a tracking token
 * @param {string} tokenId - Document ID (the token string)
 */
export async function deleteTrackingToken(tokenId) {
  if (!tokenId || typeof tokenId !== 'string') {
    throw new Error('Token ID is required');
  }
  const tokenRef = doc(db, TOKENS_COLLECTION, tokenId.toLowerCase().trim());
  await deleteDoc(tokenRef);
}
