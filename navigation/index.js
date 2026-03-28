// ─── Momentum App — Navigation Config ────────────────────────────────────────
// Expo Router handles file-based routing; this file exports helpers and
// any programmatic navigation utilities used across the app.

import { router } from 'expo-router';

export const navigate = {
  home:     ()          => router.push('/'),
  settings: ()          => router.push('/settings'),
  back:     ()          => router.back(),
  replace:  (path)      => router.replace(path),

  // Navigate to home and highlight a specific task
  highlightTask: (taskId) =>
    router.push({ pathname: '/', params: { highlightTask: taskId } }),
};

// ── Tab Definitions ───────────────────────────────────────────────────────────
// Used by the bottom tab navigator in app/_layout.js
export const TABS = [
  {
    name:   'index',
    title:  'Today',
    icon:   'sunny-outline',      // Ionicons name
    active: 'sunny',
  },
  {
    name:   'settings',
    title:  'Settings',
    icon:   'settings-outline',
    active: 'settings',
  },
];

export default navigate;
