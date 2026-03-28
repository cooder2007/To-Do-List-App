// ─── Momentum App — Task Service ──────────────────────────────────────────────
import { loadData, saveData } from '../../services/storage';
import { STORAGE_KEYS } from '../../utils/constants';

/**
 * Loads all tasks from local storage.
 */
export const loadTasksFromStorage = async () => {
  return loadData(STORAGE_KEYS.TASKS, []);
};

/**
 * Persists the full tasks array to local storage.
 */
export const saveTasksToStorage = async (tasks) => {
  return saveData(STORAGE_KEYS.TASKS, tasks);
};

/**
 * Advances "tomorrow" tasks to "today" (called at midnight or app launch).
 * Returns the updated task list.
 */
export const advanceTasks = (tasks) => {
  return tasks.map((task) => {
    if (task.day === 'tomorrow') {
      return { ...task, day: 'today', updatedAt: new Date().toISOString() };
    }
    return task;
  });
};

/**
 * Removes all completed tasks older than `days` days from the list.
 */
export const pruneDoneTasks = (tasks, days = 7) => {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return tasks.filter((task) => {
    if (task.status !== 'done') return true;
    const completedAt = task.completedAt ? new Date(task.completedAt).getTime() : 0;
    return completedAt > cutoff;
  });
};

/**
 * Returns tasks that have a dueTime within the next `minutes` minutes.
 */
export const getUpcomingTasks = (tasks, minutes = 60) => {
  const now    = Date.now();
  const cutoff = now + minutes * 60 * 1000;

  return tasks.filter((task) => {
    if (!task.dueTime || task.status === 'done') return false;
    const due = new Date(task.dueTime).getTime();
    return due > now && due <= cutoff;
  });
};

/**
 * Returns overdue tasks (dueTime in the past, not done).
 */
export const getOverdueTasks = (tasks) => {
  const now = Date.now();
  return tasks.filter((task) => {
    if (!task.dueTime || task.status === 'done') return false;
    return new Date(task.dueTime).getTime() < now;
  });
};
