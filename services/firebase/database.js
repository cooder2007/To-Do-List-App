// ─── Momentum App — Firestore Database Helpers ───────────────────────────────
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { app } from './config';

export const db = getFirestore(app);

// ── Tasks ─────────────────────────────────────────────────────────────────────

export const tasksCollection = (userId) =>
  collection(db, 'users', userId, 'tasks');

export const saveTaskRemote = async (userId, task) => {
  try {
    const ref = doc(tasksCollection(userId), task.id);
    await setDoc(ref, { ...task, updatedAt: serverTimestamp() }, { merge: true });
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

export const deleteTaskRemote = async (userId, taskId) => {
  try {
    await deleteDoc(doc(tasksCollection(userId), taskId));
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

export const fetchTasksRemote = async (userId) => {
  try {
    const q = query(tasksCollection(userId), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    const tasks = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return { tasks, error: null };
  } catch (error) {
    return { tasks: [], error: error.message };
  }
};

/**
 * Real-time listener for tasks.
 * Returns the unsubscribe function.
 */
export const listenTasks = (userId, callback) => {
  const q = query(tasksCollection(userId), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    const tasks = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(tasks);
  });
};

// ── Settings ──────────────────────────────────────────────────────────────────

export const saveSettingsRemote = async (userId, settings) => {
  try {
    const ref = doc(db, 'users', userId, 'settings', 'prefs');
    await setDoc(ref, { ...settings, updatedAt: serverTimestamp() }, { merge: true });
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

export const fetchSettingsRemote = async (userId) => {
  try {
    const ref = doc(db, 'users', userId, 'settings', 'prefs');
    const snap = await getDoc(ref);
    return { settings: snap.exists() ? snap.data() : null, error: null };
  } catch (error) {
    return { settings: null, error: error.message };
  }
};
