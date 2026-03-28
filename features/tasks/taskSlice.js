// ─── Momentum App — Task Redux Slice ──────────────────────────────────────────
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loadData, saveData } from '../../services/storage';
import { STORAGE_KEYS, TASK_STATUS } from '../../utils/constants';
import { generateId, sortTasks } from '../../utils/helpers';

// ── Async Thunks ──────────────────────────────────────────────────────────────

export const loadTasks = createAsyncThunk('tasks/load', async () => {
  const tasks = await loadData(STORAGE_KEYS.TASKS, []);
  return tasks;
});

const persistTasks = async (tasks) => {
  await saveData(STORAGE_KEYS.TASKS, tasks);
};

export const addTask = createAsyncThunk(
  'tasks/add',
  async (taskData, { getState }) => {
    const task = {
      id:        generateId(),
      title:     taskData.title.trim(),
      notes:     taskData.notes ?? '',
      day:       taskData.day ?? 'today',           // 'today' | 'tomorrow'
      priority:  taskData.priority ?? 'none',       // 'high' | 'medium' | 'low' | 'none'
      status:    TASK_STATUS.TODO,
      dueTime:   taskData.dueTime ?? null,          // ISO string
      reminder:  taskData.reminder ?? null,         // minutes before
      tags:      taskData.tags ?? [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: null,
    };
    const { tasks } = getState().tasks;
    const updated = [task, ...tasks];
    await persistTasks(updated);
    return task;
  }
);

export const updateTask = createAsyncThunk(
  'tasks/update',
  async ({ id, changes }, { getState }) => {
    const { tasks } = getState().tasks;
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, ...changes, updatedAt: new Date().toISOString() } : t
    );
    await persistTasks(updated);
    return { id, changes };
  }
);

export const toggleTaskStatus = createAsyncThunk(
  'tasks/toggle',
  async (taskId, { getState }) => {
    const { tasks } = getState().tasks;
    const task = tasks.find((t) => t.id === taskId);
    if (!task) throw new Error('Task not found');

    const isDone  = task.status === TASK_STATUS.DONE;
    const changes = {
      status:      isDone ? TASK_STATUS.TODO : TASK_STATUS.DONE,
      completedAt: isDone ? null : new Date().toISOString(),
      updatedAt:   new Date().toISOString(),
    };
    const updated = tasks.map((t) => (t.id === taskId ? { ...t, ...changes } : t));
    await persistTasks(updated);
    return { id: taskId, changes };
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/delete',
  async (taskId, { getState }) => {
    const { tasks } = getState().tasks;
    const updated = tasks.filter((t) => t.id !== taskId);
    await persistTasks(updated);
    return taskId;
  }
);

export const reorderTasks = createAsyncThunk(
  'tasks/reorder',
  async (reorderedTasks) => {
    await persistTasks(reorderedTasks);
    return reorderedTasks;
  }
);

export const moveTomorrow = createAsyncThunk(
  'tasks/moveTomorrow',
  async (taskId, { getState }) => {
    const { tasks } = getState().tasks;
    const updated = tasks.map((t) =>
      t.id === taskId
        ? { ...t, day: 'tomorrow', updatedAt: new Date().toISOString() }
        : t
    );
    await persistTasks(updated);
    return { id: taskId };
  }
);

// ── Slice ─────────────────────────────────────────────────────────────────────

const initialState = {
  tasks:   [],
  loading: false,
  error:   null,
  filter: {
    day:      null,        // 'today' | 'tomorrow' | null (all)
    priority: null,
    status:   null,
    search:   '',
  },
  editingTask: null,       // task being edited in modal
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setFilter(state, action) {
      state.filter = { ...state.filter, ...action.payload };
    },
    clearFilter(state) {
      state.filter = { day: null, priority: null, status: null, search: '' };
    },
    setEditingTask(state, action) {
      state.editingTask = action.payload;
    },
    clearEditingTask(state) {
      state.editingTask = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const pending  = (state) => { state.loading = true; state.error = null; };
    const rejected = (state, action) => { state.loading = false; state.error = action.error.message; };

    builder
      .addCase(loadTasks.pending, pending)
      .addCase(loadTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks   = action.payload;
      })
      .addCase(loadTasks.rejected, rejected)

      .addCase(addTask.fulfilled, (state, action) => {
        state.tasks.unshift(action.payload);
      })

      .addCase(updateTask.fulfilled, (state, action) => {
        const { id, changes } = action.payload;
        const idx = state.tasks.findIndex((t) => t.id === id);
        if (idx !== -1) state.tasks[idx] = { ...state.tasks[idx], ...changes };
      })

      .addCase(toggleTaskStatus.fulfilled, (state, action) => {
        const { id, changes } = action.payload;
        const idx = state.tasks.findIndex((t) => t.id === id);
        if (idx !== -1) state.tasks[idx] = { ...state.tasks[idx], ...changes };
      })

      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((t) => t.id !== action.payload);
      })

      .addCase(reorderTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
      })

      .addCase(moveTomorrow.fulfilled, (state, action) => {
        const { id } = action.payload;
        const idx = state.tasks.findIndex((t) => t.id === id);
        if (idx !== -1) state.tasks[idx].day = 'tomorrow';
      });
  },
});

export const {
  setFilter, clearFilter, setEditingTask, clearEditingTask, clearError,
} = taskSlice.actions;

// ── Selectors ─────────────────────────────────────────────────────────────────

export const selectAllTasks   = (s) => s.tasks.tasks;
export const selectFilter     = (s) => s.tasks.filter;
export const selectEditingTask= (s) => s.tasks.editingTask;
export const selectTasksLoading=(s) => s.tasks.loading;

export const selectFilteredTasks = (s) => {
  const { tasks, filter } = s.tasks;
  let result = [...tasks];

  if (filter.day)      result = result.filter((t) => t.day === filter.day);
  if (filter.priority) result = result.filter((t) => t.priority === filter.priority);
  if (filter.status)   result = result.filter((t) => t.status === filter.status);
  if (filter.search)   result = result.filter((t) =>
    t.title.toLowerCase().includes(filter.search.toLowerCase())
  );

  return sortTasks(result);
};

export const selectTasksByDay = (day) => (s) =>
  sortTasks(s.tasks.tasks.filter((t) => t.day === day));

export const selectCompletionStats = (s) => {
  const tasks    = s.tasks.tasks;
  const today    = tasks.filter((t) => t.day === 'today');
  const tomorrow = tasks.filter((t) => t.day === 'tomorrow');

  const countDone = (arr) => arr.filter((t) => t.status === 'done').length;

  return {
    today:    { total: today.length,    done: countDone(today) },
    tomorrow: { total: tomorrow.length, done: countDone(tomorrow) },
    all:      { total: tasks.length,    done: countDone(tasks) },
  };
};

export default taskSlice.reducer;
