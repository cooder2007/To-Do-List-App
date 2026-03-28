// ─── Momentum App — Notification Service ─────────────────────────────────────
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import {
  NOTIFICATION_CHANNEL_ID,
  NOTIFICATION_CHANNEL_NAME,
} from '../../utils/constants';
import { saveData, loadData } from '../../services/storage';
import { STORAGE_KEYS } from '../../utils/constants';

// ── Configure foreground behaviour ────────────────────────────────────────────
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge:  true,
  }),
});

// ── Permission ────────────────────────────────────────────────────────────────

/**
 * Requests push notification permissions.
 * Returns { granted: boolean, token: string | null }.
 */
export const requestPermissions = async () => {
  if (!Device.isDevice) {
    console.warn('[Notifications] Must use physical device for push notifications.');
    return { granted: false, token: null };
  }

  // Android channel
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNEL_ID, {
      name:               NOTIFICATION_CHANNEL_NAME,
      importance:         Notifications.AndroidImportance.HIGH,
      vibrationPattern:   [0, 250, 250, 250],
      lightColor:         '#F5A623',
      enableVibrate:      true,
      showBadge:          true,
    });
  }

  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;

  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return { granted: false, token: null };
  }

  const { data: token } = await Notifications.getExpoPushTokenAsync();
  return { granted: true, token };
};

// ── Schedule ──────────────────────────────────────────────────────────────────

/**
 * Schedules a local reminder for a task.
 * Returns the notification identifier string.
 */
export const scheduleTaskReminder = async ({ taskId, title, body, triggerDate }) => {
  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data:  { taskId, type: 'task_reminder' },
        sound: true,
        badge: 1,
        color: '#F5A623',
      },
      trigger: {
        date:      triggerDate,
        channelId: NOTIFICATION_CHANNEL_ID,
      },
    });

    // Persist mapping taskId → notificationId
    const existing = await loadData(STORAGE_KEYS.NOTIFICATION_ID, {});
    await saveData(STORAGE_KEYS.NOTIFICATION_ID, { ...existing, [taskId]: id });

    return id;
  } catch (error) {
    console.error('[Notifications] scheduleTaskReminder failed:', error);
    return null;
  }
};

/**
 * Cancels the scheduled reminder for a task.
 */
export const cancelTaskReminder = async (taskId) => {
  try {
    const map = await loadData(STORAGE_KEYS.NOTIFICATION_ID, {});
    const notifId = map[taskId];
    if (notifId) {
      await Notifications.cancelScheduledNotificationAsync(notifId);
      const updated = { ...map };
      delete updated[taskId];
      await saveData(STORAGE_KEYS.NOTIFICATION_ID, updated);
    }
  } catch (error) {
    console.error('[Notifications] cancelTaskReminder failed:', error);
  }
};

/**
 * Cancels all Momentum scheduled notifications.
 */
export const cancelAllReminders = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await saveData(STORAGE_KEYS.NOTIFICATION_ID, {});
  } catch (error) {
    console.error('[Notifications] cancelAllReminders failed:', error);
  }
};

/**
 * Sends an immediate local notification.
 */
export const sendImmediateNotification = async ({ title, body, data = {} }) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: { title, body, data, sound: true, color: '#F5A623' },
      trigger: null, // immediate
    });
  } catch (error) {
    console.error('[Notifications] sendImmediateNotification failed:', error);
  }
};

/**
 * Schedule daily motivational quote notification at a given hour.
 */
export const scheduleDailyQuoteReminder = async (hour = 8, minute = 0) => {
  try {
    // Cancel any existing daily quote notification
    const map = await loadData(STORAGE_KEYS.NOTIFICATION_ID, {});
    if (map['daily_quote']) {
      await Notifications.cancelScheduledNotificationAsync(map['daily_quote']);
    }

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: '✨ Your Daily Momentum',
        body:  'Your quote of the day is ready. Tap to get inspired.',
        data:  { type: 'daily_quote' },
        sound: true,
        color: '#F5A623',
      },
      trigger: {
        hour,
        minute,
        repeats: true,
        channelId: NOTIFICATION_CHANNEL_ID,
      },
    });

    await saveData(STORAGE_KEYS.NOTIFICATION_ID, { ...map, daily_quote: id });
    return id;
  } catch (error) {
    console.error('[Notifications] scheduleDailyQuoteReminder failed:', error);
    return null;
  }
};

/**
 * Returns all currently scheduled notifications.
 */
export const getAllScheduled = async () => {
  return Notifications.getAllScheduledNotificationsAsync();
};

/**
 * Adds a received-notification listener.
 * Returns the subscription (call .remove() to clean up).
 */
export const addReceivedListener = (handler) =>
  Notifications.addNotificationReceivedListener(handler);

/**
 * Adds a response (tap) listener.
 * Returns the subscription.
 */
export const addResponseListener = (handler) =>
  Notifications.addNotificationResponseReceivedListener(handler);
