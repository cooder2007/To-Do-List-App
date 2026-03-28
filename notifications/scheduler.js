// ─── Momentum App — Notification Scheduler ───────────────────────────────────
// High-level scheduler: wires together tasks + notification service.

import {
  scheduleTaskReminder,
  cancelTaskReminder,
  cancelAllReminders,
} from '../features/notifications/notificationService';
import {
  buildTriggerDate,
  buildReminderContent,
  isFutureTrigger,
} from '../features/notifications/notificationUtils';

/**
 * (Re)schedules reminders for all tasks that have a dueTime and reminder set.
 * Call this after loading tasks or changing notification settings.
 */
export const rescheduleAll = async (tasks = [], remindersEnabled = true) => {
  // Always cancel first to avoid duplicates
  await cancelAllReminders();

  if (!remindersEnabled) return;

  const promises = tasks
    .filter((t) => t.status !== 'done' && t.dueTime && t.reminder != null)
    .map(async (task) => {
      const triggerDate = buildTriggerDate(task.dueTime, task.reminder);
      if (!isFutureTrigger(triggerDate)) return;
      const { title, body } = buildReminderContent(task, task.reminder);
      await scheduleTaskReminder({ taskId: task.id, title, body, triggerDate });
    });

  await Promise.allSettled(promises);
};

/**
 * Schedules a single task's reminder (or cancels it if done/no reminder).
 */
export const syncTaskReminder = async (task, remindersEnabled = true) => {
  // Always cancel existing first
  await cancelTaskReminder(task.id);

  if (!remindersEnabled) return;
  if (task.status === 'done') return;
  if (!task.dueTime || task.reminder == null) return;

  const triggerDate = buildTriggerDate(task.dueTime, task.reminder);
  if (!isFutureTrigger(triggerDate)) return;

  const { title, body } = buildReminderContent(task, task.reminder);
  await scheduleTaskReminder({ taskId: task.id, title, body, triggerDate });
};
