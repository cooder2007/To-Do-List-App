// ─── Momentum App — App-level Context ────────────────────────────────────────
// Provides: auth state, settings, and lightweight helpers to all screens.
import React, { createContext, useContext, useEffect, useReducer, useCallback } from 'react';
import { loadData, saveData } from '../services/storage';
import { STORAGE_KEYS } from '../utils/constants';
import { listenAuthState, signInAnon } from '../services/firebase/auth';

// ── Default Settings ──────────────────────────────────────────────────────────
const DEFAULT_SETTINGS = {
  quoteRefreshInterval: 24,      // hours
  quoteCategories:      [],
  dailyQuoteHour:       8,
  dailyQuoteMinute:     0,
  dailyQuoteEnabled:    true,
  taskRemindersEnabled: true,
  hapticFeedback:       true,
  theme:                'dark',
  userName:             '',
};

// ── State ─────────────────────────────────────────────────────────────────────
const initialState = {
  user:        null,
  settings:    DEFAULT_SETTINGS,
  isReady:     false,    // app fully initialised
  onboarded:   false,
};

// ── Reducer ───────────────────────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    case 'SET_USER':      return { ...state, user: action.payload };
    case 'SET_SETTINGS':  return { ...state, settings: { ...state.settings, ...action.payload } };
    case 'SET_READY':     return { ...state, isReady: action.payload };
    case 'SET_ONBOARDED': return { ...state, onboarded: action.payload };
    default:              return state;
  }
}

// ── Context ───────────────────────────────────────────────────────────────────
const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // ── Bootstrap ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      // Load persisted settings
      const saved    = await loadData(STORAGE_KEYS.SETTINGS, {});
      const onboarded = await loadData(STORAGE_KEYS.ONBOARDED, false);

      dispatch({ type: 'SET_SETTINGS', payload: { ...DEFAULT_SETTINGS, ...saved } });
      dispatch({ type: 'SET_ONBOARDED', payload: onboarded });

      // Auth listener
      const unsubscribe = listenAuthState(async (user) => {
        if (user) {
          dispatch({ type: 'SET_USER', payload: { uid: user.uid, isAnon: user.isAnonymous, email: user.email } });
        } else {
          // Sign in anonymously so Firestore works without an account
          await signInAnon();
        }
        dispatch({ type: 'SET_READY', payload: true });
      });

      return unsubscribe;
    };

    let cleanup;
    init().then((unsub) => { cleanup = unsub; });
    return () => { if (cleanup) cleanup(); };
  }, []);

  // ── Actions ───────────────────────────────────────────────────────────────
  const updateSettings = useCallback(async (updates) => {
    dispatch({ type: 'SET_SETTINGS', payload: updates });
    const current = await loadData(STORAGE_KEYS.SETTINGS, {});
    await saveData(STORAGE_KEYS.SETTINGS, { ...current, ...updates });
  }, []);

  const completeOnboarding = useCallback(async () => {
    dispatch({ type: 'SET_ONBOARDED', payload: true });
    await saveData(STORAGE_KEYS.ONBOARDED, true);
  }, []);

  const value = {
    user:               state.user,
    settings:           state.settings,
    isReady:            state.isReady,
    onboarded:          state.onboarded,
    updateSettings,
    completeOnboarding,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within <AppProvider>');
  return ctx;
};

export default AppContext;
