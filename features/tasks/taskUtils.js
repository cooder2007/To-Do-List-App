// ─── Momentum App — Task Utility Functions ────────────────────────────────────
import { Colors } from '../../styles/colors';
import { TASK_PRIORITY, TASK_STATUS } from '../../utils/constants';

/**
 * Returns color config for a given priority level.
 */
export const priorityConfig = (priority) => {
  const map = {
    [TASK_PRIORITY.HIGH]:   { color: Colors.priority.high,   label: 'High',   emoji: '🔴' },
    [TASK_PRIORITY.MEDIUM]: { color: Colors.priority.medium, label: 'Medium', emoji: '🟡' },
    [TASK_PRIORITY.LOW]:    { color: Colors.priority.low,    label: 'Low',    emoji: '🟢' },
    [TASK_PRIORITY.NONE]:   { color: Colors.priority.none,   label: 'None',   emoji: '⚪' },
  };
  return map[priority] ?? map[TASK_PRIORITY.NONE];
};

/**
 * Returns display label for a task status.
 */
export const statusLabel = (status) => {
  const map = {
    [TASK_STATUS.TODO]:        'To Do',
    [TASK_STATUS.IN_PROGRESS]: 'In Progress',
    [TASK_STATUS.DONE]:        'Done',
  };
  return map[status] ?? 'To Do';
};

/**
 * Returns a motivational message based on completion percentage.
 */
export const completionMessage = (percent) => {
  if (percent === 0)   return 'Ready to conquer the day? 💪';
  if (percent < 25)    return 'Great start — keep going! 🚀';
  if (percent < 50)    return 'You\'re building momentum! ⚡';
  if (percent < 75)    return 'Halfway there — you\'ve got this! 🔥';
  if (percent < 100)   return 'Almost done — finish strong! 🏁';
  return '100% done — absolutely crushing it! 🏆';
};

/**
 * Returns priority options array for use in pickers / selectors.
 */
export const PRIORITY_OPTIONS = [
  { value: TASK_PRIORITY.NONE,   label: 'No Priority', color: Colors.priority.none },
  { value: TASK_PRIORITY.LOW,    label: 'Low',         color: Colors.priority.low },
  { value: TASK_PRIORITY.MEDIUM, label: 'Medium',      color: Colors.priority.medium },
  { value: TASK_PRIORITY.HIGH,   label: 'High',        color: Colors.priority.high },
];

/**
 * Returns DAY options array for the AddTask form.
 */
export const DAY_OPTIONS = [
  { value: 'today',    label: 'Today' },
  { value: 'tomorrow', label: 'Tomorrow' },
];

/**
 * Returns true if the task is considered urgent
 * (high priority AND not done AND due within 2 hours).
 */
export const isUrgent = (task) => {
  if (task.status === TASK_STATUS.DONE) return false;
  if (task.priority !== TASK_PRIORITY.HIGH) return false;
  if (!task.dueTime) return false;
  const due = new Date(task.dueTime).getTime();
  const twoHours = 2 * 60 * 60 * 1000;
  return due - Date.now() <= twoHours && due > Date.now();
};

/**
 * Calculates a progress bar width (0–1) for a set of tasks.
 */
export const progressRatio = (tasks = []) => {
  if (!tasks.length) return 0;
  const done = tasks.filter((t) => t.status === TASK_STATUS.DONE).length;
  return done / tasks.length;
};

/**
 * Returns a concise summary string: "3 of 5 done".
 */
export const taskSummary = (tasks = []) => {
  const done  = tasks.filter((t) => t.status === TASK_STATUS.DONE).length;
  const total = tasks.length;
  if (!total) return 'No tasks';
  if (done === total) return 'All done! 🎉';
  return `${done} of ${total} done`;
};
