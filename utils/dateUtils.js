// ─── Momentum App — Date Utilities ────────────────────────────────────────────
import { DAY_NAMES, MONTH_NAMES } from './constants';

/**
 * Returns a Date object for today at midnight (local time).
 */
export const today = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Returns a Date object for tomorrow at midnight (local time).
 */
export const tomorrow = () => {
  const d = today();
  d.setDate(d.getDate() + 1);
  return d;
};

/**
 * Formats a Date as "Monday, 28 March 2026"
 */
export const formatFullDate = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  return `${DAY_NAMES[d.getDay()]}, ${d.getDate()} ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
};

/**
 * Formats a Date as "Mon 28 Mar"
 */
export const formatShortDate = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  return `${DAY_NAMES[d.getDay()].slice(0, 3)} ${d.getDate()} ${MONTH_NAMES[d.getMonth()].slice(0, 3)}`;
};

/**
 * Formats time as "9:30 AM"
 */
export const formatTime = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  let hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
};

/**
 * Returns "Today" | "Tomorrow" | formatted short date
 */
export const humanizeDate = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  const todayMidnight = today();
  const tomorrowMidnight = tomorrow();

  d.setHours(0, 0, 0, 0);

  if (d.getTime() === todayMidnight.getTime()) return 'Today';
  if (d.getTime() === tomorrowMidnight.getTime()) return 'Tomorrow';
  return formatShortDate(d);
};

/**
 * Returns relative time string — "2 hours ago", "in 30 minutes", etc.
 */
export const relativeTime = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  const now = Date.now();
  const diffMs = d.getTime() - now;
  const absDiff = Math.abs(diffMs);
  const past = diffMs < 0;

  const seconds = Math.floor(absDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours   = Math.floor(minutes / 60);
  const days    = Math.floor(hours / 24);

  let label;
  if (seconds < 60)       label = 'just now';
  else if (minutes < 60)  label = `${minutes}m`;
  else if (hours < 24)    label = `${hours}h`;
  else                    label = `${days}d`;

  if (label === 'just now') return label;
  return past ? `${label} ago` : `in ${label}`;
};

/**
 * Returns true if the given date is in the past (before now).
 */
export const isPast = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  return d.getTime() < Date.now();
};

/**
 * Returns true if date is today.
 */
export const isToday = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  const t = today();
  return (
    d.getDate() === t.getDate() &&
    d.getMonth() === t.getMonth() &&
    d.getFullYear() === t.getFullYear()
  );
};

/**
 * Returns true if date is tomorrow.
 */
export const isTomorrow = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  const t = tomorrow();
  return (
    d.getDate() === t.getDate() &&
    d.getMonth() === t.getMonth() &&
    d.getFullYear() === t.getFullYear()
  );
};

/**
 * Calculates hours elapsed since a given timestamp.
 */
export const hoursSince = (timestamp) => {
  const ms = Date.now() - new Date(timestamp).getTime();
  return ms / (1000 * 60 * 60);
};

/**
 * Returns an ISO date string "YYYY-MM-DD" for a given Date.
 */
export const toISODate = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  return d.toISOString().split('T')[0];
};

/**
 * Build a date at a specific hour:minute for today or tomorrow.
 */
export const buildReminderDate = (day, hour, minute = 0) => {
  const base = day === 'tomorrow' ? tomorrow() : today();
  base.setHours(hour, minute, 0, 0);
  return base;
};
