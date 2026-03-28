// ─── Momentum App — Firebase Auth ────────────────────────────────────────────
import {
  getAuth,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { app } from './config';

export const auth = getAuth(app);

/**
 * Sign in anonymously (no account required — data stored locally).
 */
export const signInAnon = async () => {
  try {
    const result = await signInAnonymously(auth);
    return { user: result.user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

/**
 * Register with email and password.
 */
export const register = async (email, password, displayName) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(result.user, { displayName });
    }
    return { user: result.user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

/**
 * Sign in with email and password.
 */
export const login = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return { user: result.user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

/**
 * Sign out the current user.
 */
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

/**
 * Listen for auth state changes. Returns the unsubscribe function.
 */
export const listenAuthState = (callback) => onAuthStateChanged(auth, callback);

/**
 * Returns the currently signed-in user (or null).
 */
export const currentUser = () => auth.currentUser;
