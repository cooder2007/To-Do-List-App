// ─── Momentum App — useTasks Hook ─────────────────────────────────────────────
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  loadTasks,
  addTask,
  updateTask,
  toggleTaskStatus,
  deleteTask,
  moveTomorrow,
  reorderTasks,
  setFilter,
  clearFilter,
  setEditingTask,
  clearEditingTask,
  selectAllTasks,
  selectFilteredTasks,
  selectTasksByDay,
  selectFilter,
  selectEditingTask,
  selectTasksLoading,
  selectCompletionStats,
} from '../features/tasks/taskSlice';
import {
  scheduleTaskReminder,
  cancelTaskReminder,
} from '../features/notifications/notificationService';
import {
  buildTriggerDate,
  buildReminderContent,
  isFutureTrigger,
} from '../features/notifications/notificationUtils';
import { useApp } from '../context/AppContext';

export const useTasks = () => {
  const dispatch  = useDispatch();
  const { settings } = useApp();

  // ── Selectors ────────────────────────────────────────────────────────────
  const allTasks        = useSelector(selectAllTasks);
  const filteredTasks   = useSelector(selectFilteredTasks);
  const todayTasks      = useSelector(selectTasksByDay('today'));
  const tomorrowTasks   = useSelector(selectTasksByDay('tomorrow'));
  const filter          = useSelector(selectFilter);
  const editingTask     = useSelector(selectEditingTask);
  const loading         = useSelector(selectTasksLoading);
  const stats           = useSelector(selectCompletionStats);

  // ── Actions ──────────────────────────────────────────────────────────────
  const load   = useCallback(() => dispatch(loadTasks()), [dispatch]);
  const add    = useCallback((data) => dispatch(addTask(data)), [dispatch]);
  const update = useCallback((id, changes) => dispatch(updateTask({ id, changes })), [dispatch]);
  const toggle = useCallback((id) => dispatch(toggleTaskStatus(id)), [dispatch]);
  const remove = useCallback((id) => dispatch(deleteTask(id)), [dispatch]);
  const moveToTomorrow = useCallback((id) => dispatch(moveTomorrow(id)), [dispatch]);
  const reorder = useCallback((tasks) => dispatch(reorderTasks(tasks)), [dispatch]);

  const updateFilter = useCallback((f) => dispatch(setFilter(f)), [dispatch]);
  const resetFilter  = useCallback(() => dispatch(clearFilter()), [dispatch]);

  const startEditing = useCallback((task) => dispatch(setEditingTask(task)), [dispatch]);
  const stopEditing  = useCallback(() => dispatch(clearEditingTask()), [dispatch]);

  // ── Reminder helpers ─────────────────────────────────────────────────────
  const scheduleReminder = useCallback(async (task) => {
    if (!settings.taskRemindersEnabled) return;
    if (!task.dueTime || task.reminder == null) return;

    const triggerDate = buildTriggerDate(task.dueTime, task.reminder);
    if (!isFutureTrigger(triggerDate)) return;

    const { title, body } = buildReminderContent(task, task.reminder);
    await scheduleTaskReminder({ taskId: task.id, title, body, triggerDate });
  }, [settings.taskRemindersEnabled]);

  const removeReminder = useCallback(async (taskId) => {
    await cancelTaskReminder(taskId);
  }, []);

  return {
    // data
    allTasks,
    filteredTasks,
    todayTasks,
    tomorrowTasks,
    filter,
    editingTask,
    loading,
    stats,
    // crud
    load,
    add,
    update,
    toggle,
    remove,
    moveToTomorrow,
    reorder,
    // filter
    updateFilter,
    resetFilter,
    // edit modal
    startEditing,
    stopEditing,
    // reminders
    scheduleReminder,
    removeReminder,
  };
};

export default useTasks;
