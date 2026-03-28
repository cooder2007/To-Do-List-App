// ─── Momentum App — General Helpers ──────────────────────────────────────────
import { Platform } from 'react-native';

/**
 * Generates a UUID v4-like string without the uuid package dep on web.
 */
export const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Clamps a number between min and max.
 */
export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

/**
 * Returns a random element from an array.
 */
export const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];

/**
 * Debounce — returns a function that delays invoking fn by `delay` ms.
 */
export const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

/**
 * Capitalizes the first letter of a string.
 */
export const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

/**
 * Truncates text to maxLength and appends '…' if needed.
 */
export const truncate = (text, maxLength = 100) =>
  text && text.length > maxLength ? text.slice(0, maxLength).trimEnd() + '…' : text;

/**
 * Returns the completion percentage (0-100) for an array of tasks.
 */
export const taskCompletionPercent = (tasks) => {
  if (!tasks || tasks.length === 0) return 0;
  const done = tasks.filter((t) => t.status === 'done').length;
  return Math.round((done / tasks.length) * 100);
};

/**
 * Groups an array of tasks by their `day` field ('today' | 'tomorrow').
 */
export const groupTasksByDay = (tasks) => {
  return tasks.reduce(
    (acc, task) => {
      const day = task.day || 'today';
      if (!acc[day]) acc[day] = [];
      acc[day].push(task);
      return acc;
    },
    { today: [], tomorrow: [] }
  );
};

/**
 * Sorts tasks by: incomplete first, then by priority, then by createdAt.
 */
export const sortTasks = (tasks) => {
  const priorityOrder = { high: 0, medium: 1, low: 2, none: 3 };
  return [...tasks].sort((a, b) => {
    // Done tasks go to the bottom
    if (a.status === 'done' && b.status !== 'done') return 1;
    if (b.status === 'done' && a.status !== 'done') return -1;
    // Sort by priority
    const pa = priorityOrder[a.priority] ?? 3;
    const pb = priorityOrder[b.priority] ?? 3;
    if (pa !== pb) return pa - pb;
    // Sort by creation time
    return new Date(a.createdAt) - new Date(b.createdAt);
  });
};

/**
 * Returns a greeting based on the current hour.
 */
export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  if (hour < 21) return 'Good evening';
  return 'Good night';
};

/**
 * Platform helper.
 */
export const isIOS     = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
export const isWeb     = Platform.OS === 'web';

/**
 * Sleep utility (for async flows).
 */
export const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

/**
 * Deep-clone a plain JS object (tasks, settings, etc.).
 */
export const deepClone = (obj) => JSON.parse(JSON.stringify(obj));
