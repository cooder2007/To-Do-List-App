// ─── Momentum App — iOS Widget (WidgetKit bridge) ────────────────────────────
// iOS widgets use WidgetKit (Swift) and share data via App Groups / UserDefaults.
// This JS module writes the shared data container that the Swift widget reads.
//
// ⚠️  Requires native Swift WidgetExtension target. See README § iOS Widgets.
// Reference: https://developer.apple.com/documentation/widgetkit

import { NativeModules, Platform } from 'react-native';
import { loadData }                from '../../services/storage';
import { STORAGE_KEYS }            from '../../utils/constants';

// ── App Group identifier (must match Swift extension) ─────────────────────────
export const APP_GROUP_ID = 'group.com.yourname.momentum';

// ── Native module bridge (set up in Swift/ObjC) ───────────────────────────────
const { MomentumWidgetKit } = NativeModules;

/**
 * Writes the latest quote + today's tasks to the App Group shared container,
 * then requests WidgetKit to reload all widget timelines.
 *
 * Call this after:
 *   - A task is added / updated / deleted / toggled
 *   - The quote refreshes
 *   - The app goes to background (AppState listener)
 */
export const syncToWidget = async () => {
  if (Platform.OS !== 'ios') return;
  if (!MomentumWidgetKit?.syncData) {
    console.warn('[iOSWidget] MomentumWidgetKit native module not available.');
    return;
  }

  const tasks = await loadData(STORAGE_KEYS.TASKS, []);
  const quote = await loadData(STORAGE_KEYS.QUOTE_CACHE, null);

  const todayTasks = tasks
    .filter((t) => t.day === 'today' && t.status !== 'done')
    .slice(0, 5)
    .map(({ id, title, priority, dueTime }) => ({ id, title, priority, dueTime }));

  const payload = {
    tasks: todayTasks,
    quote: quote
      ? { content: quote.content, author: quote.author }
      : null,
    updatedAt: new Date().toISOString(),
  };

  try {
    await MomentumWidgetKit.syncData(APP_GROUP_ID, JSON.stringify(payload));
    MomentumWidgetKit.reloadAllTimelines?.();
  } catch (err) {
    console.error('[iOSWidget] syncToWidget failed:', err.message);
  }
};

/**
 * Call on app launch to hydrate the widget with the latest data.
 */
export const initWidgetSync = () => {
  if (Platform.OS === 'ios') {
    syncToWidget().catch(console.warn);
  }
};

// ── Widget size constants ─────────────────────────────────────────────────────
export const IOS_WIDGET_FAMILIES = {
  SMALL:       'systemSmall',   // ~155×155 pt
  MEDIUM:      'systemMedium',  // ~329×155 pt — quote + top 2 tasks
  LARGE:       'systemLarge',   // ~329×345 pt — quote + all today tasks
  ACCESSORY:   'accessoryRectangular', // Lock screen / Dynamic Island
};

// ── Payload shape (mirrors Swift WidgetEntry struct) ──────────────────────────
/**
 * @typedef {Object} WidgetPayload
 * @property {{ content: string, author: string }|null} quote
 * @property {Array<{ id: string, title: string, priority: string, dueTime: string|null }>} tasks
 * @property {string} updatedAt  — ISO date string
 */
