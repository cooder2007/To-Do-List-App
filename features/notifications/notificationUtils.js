// ─── Momentum App — Notification Utilities ────────────────────────────────────
import { REMINDER_PRESETS } from '../../utils/constants';
import { formatTime } from '../../utils/dateUtils';

/**
 * Builds a trigger Date for a task reminder.
 * `minutesBefore`: how many minutes before dueTime to fire.
 */
export const buildTriggerDate = (dueTimeISO, minutesBefore = 0) => {
  const due = new Date(dueTimeISO);
  const trigger = new Date(due.getTime() - minutesBefore * 60 * 1000);
  return trigger;
};

/**
 * Builds notification content strings for a task reminder.
 */
export const buildReminderContent = (task, minutesBefore = 0) => {
  const timeStr = task.dueTime ? formatTime(new Date(task.dueTime)) : '';
  const prefix  = minutesBefore === 0 ? 'Due now' : `Due at ${timeStr}`;

  return {
    title: `⏰ ${task.title}`,
    body:  minutesBefore === 0
      ? `"${task.title}" is due right now!`
      : `Reminder: "${task.title}" is due in ${minutesBefore} minutes.`,
  };
};

/**
 * Returns the label for a reminder preset value.
 */
export const reminderLabel = (minutes) => {
  const preset = REMINDER_PRESETS.find((p) => p.value === minutes);
  return preset ? preset.label : `${minutes} minutes before`;
};

/**
 * Returns whether a trigger date is still in the future.
 */
export const isFutureTrigger = (triggerDate) =>
  triggerDate instanceof Date && triggerDate.getTime() > Date.now();

/**
 * Groups scheduled notifications by their data.type field.
 */
export const groupNotificationsByType = (notifications) =>
  notifications.reduce((acc, notif) => {
    const type = notif.content?.data?.type ?? 'unknown';
    if (!acc[type]) acc[type] = [];
    acc[type].push(notif);
    return acc;
  }, {});
