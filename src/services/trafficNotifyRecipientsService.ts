import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import {
  DEFAULT_NOTIFY_TO_EMAIL,
  NOTIFY_RECIPIENTS_DOC,
  normalizeNotifyEmail,
  isDefaultNotifyEmail,
} from '../constants/trafficNotify';

const docRef = () => doc(db, ...NOTIFY_RECIPIENTS_DOC.split('/'));

/**
 * Extra recipients only (default To is always applied in the Worker).
 * @returns {Promise<string[]>}
 */
export async function listExtraNotifyRecipients() {
  try {
    const snap = await getDoc(docRef());
    if (!snap.exists()) return [];
    const raw = snap.data()?.recipients;
    if (!Array.isArray(raw)) return [];
    const seen = new Set();
    const out = [];
    for (const item of raw) {
      const email = normalizeNotifyEmail(item);
      if (!email || isDefaultNotifyEmail(email) || seen.has(email)) continue;
      seen.add(email);
      out.push(email);
    }
    return out;
  } catch (e) {
    console.warn('listExtraNotifyRecipients failed:', e);
    return [];
  }
}

/**
 * Full recipient list for sending (default + extras).
 * @returns {Promise<string[]>}
 */
export async function listNotifyRecipientsForSend() {
  const extras = await listExtraNotifyRecipients();
  return [DEFAULT_NOTIFY_TO_EMAIL, ...extras];
}

/**
 * @param {string} email
 * @returns {Promise<string[]>} updated extras list
 */
export async function addNotifyRecipient(email) {
  const normalized = normalizeNotifyEmail(email);
  if (!normalized) {
    throw new Error('Enter a valid email address');
  }
  if (isDefaultNotifyEmail(normalized)) {
    throw new Error('That address is already the default recipient');
  }

  const current = await listExtraNotifyRecipients();
  if (current.includes(normalized)) {
    throw new Error('That email is already on the list');
  }

  const next = [...current, normalized];
  const snap = await getDoc(docRef());
  if (snap.exists()) {
    await updateDoc(docRef(), { recipients: next, updatedAt: new Date() });
  } else {
    await setDoc(docRef(), { recipients: next, updatedAt: new Date() });
  }
  return next;
}

/**
 * @param {string} email
 * @returns {Promise<string[]>} updated extras list
 */
export async function removeNotifyRecipient(email) {
  const normalized = normalizeNotifyEmail(email);
  if (!normalized) {
    throw new Error('Invalid email');
  }
  if (isDefaultNotifyEmail(normalized)) {
    throw new Error('Cannot remove the default recipient');
  }

  const current = await listExtraNotifyRecipients();
  const next = current.filter((e) => e !== normalized);
  const snap = await getDoc(docRef());
  if (snap.exists()) {
    await updateDoc(docRef(), { recipients: next, updatedAt: new Date() });
  } else {
    await setDoc(docRef(), { recipients: next, updatedAt: new Date() });
  }
  return next;
}
