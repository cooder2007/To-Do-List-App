// ─── Momentum App — Constants ─────────────────────────────────────────────────

// ── App ──────────────────────────────────────────────────────────────────────
export const APP_NAME = 'Momentum';
export const APP_VERSION = '1.0.0';

// ── Storage Keys ─────────────────────────────────────────────────────────────
export const STORAGE_KEYS = {
  TASKS:          '@momentum/tasks',
  QUOTE_CACHE:    '@momentum/quote_cache',
  QUOTE_LAST_AT:  '@momentum/quote_last_at',
  SETTINGS:       '@momentum/settings',
  ONBOARDED:      '@momentum/onboarded',
  THEME:          '@momentum/theme',
  NOTIFICATION_ID:'@momentum/notification_ids',
};

// ── Task ─────────────────────────────────────────────────────────────────────
export const TASK_PRIORITY = {
  HIGH:   'high',
  MEDIUM: 'medium',
  LOW:    'low',
  NONE:   'none',
};

export const TASK_STATUS = {
  TODO:       'todo',
  IN_PROGRESS:'in_progress',
  DONE:       'done',
};

export const TASK_DAYS = {
  TODAY:    'today',
  TOMORROW: 'tomorrow',
};

// ── Quote ────────────────────────────────────────────────────────────────────
export const QUOTE_REFRESH = {
  DAILY:    'daily',
  HOURLY:   'hourly',
  MANUALLY: 'manually',
  EACH_OPEN:'each_open',
};

export const QUOTE_CATEGORIES = [
  'motivational',
  'success',
  'wisdom',
  'leadership',
  'courage',
  'happiness',
  'life',
  'inspirational',
];

// ── Notifications ─────────────────────────────────────────────────────────────
export const NOTIFICATION_CHANNEL_ID  = 'momentum-tasks';
export const NOTIFICATION_CHANNEL_NAME = 'Task Reminders';

export const REMINDER_PRESETS = [
  { label: '5 minutes before',  value: 5 },
  { label: '15 minutes before', value: 15 },
  { label: '30 minutes before', value: 30 },
  { label: '1 hour before',     value: 60 },
  { label: '2 hours before',    value: 120 },
  { label: 'At due time',       value: 0 },
];

// ── API ──────────────────────────────────────────────────────────────────────
export const QUOTES_API_BASE = process.env.EXPO_PUBLIC_QUOTES_API_URL ?? 'https://api.quotable.io';

// ── Fallback Quotes (offline mode) ───────────────────────────────────────────
export const FALLBACK_QUOTES = [
  {
    _id: 'f1',
    content: 'The secret of getting ahead is getting started.',
    author: 'Mark Twain',
    tags: ['motivational'],
  },
  {
    _id: 'f2',
    content: 'It does not matter how slowly you go as long as you do not stop.',
    author: 'Confucius',
    tags: ['wisdom'],
  },
  {
    _id: 'f3',
    content: 'Our greatest glory is not in never falling, but in rising every time we fall.',
    author: 'Confucius',
    tags: ['courage'],
  },
  {
    _id: 'f4',
    content: 'Believe you can and you\'re halfway there.',
    author: 'Theodore Roosevelt',
    tags: ['motivational'],
  },
  {
    _id: 'f5',
    content: 'Success is not final, failure is not fatal — it is the courage to continue that counts.',
    author: 'Winston Churchill',
    tags: ['success'],
  },
  {
    _id: 'f6',
    content: 'You are never too old to set another goal or to dream a new dream.',
    author: 'C.S. Lewis',
    tags: ['inspirational'],
  },
  {
    _id: 'f7',
    content: 'The future belongs to those who believe in the beauty of their dreams.',
    author: 'Eleanor Roosevelt',
    tags: ['inspirational'],
  },
];

// ── Date & Time ──────────────────────────────────────────────────────────────
export const DAY_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
export const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
