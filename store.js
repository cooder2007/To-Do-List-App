// ─── Momentum App — Redux Store ───────────────────────────────────────────────
import { configureStore } from '@reduxjs/toolkit';
import taskReducer  from '../features/tasks/taskSlice';
import quoteReducer from '../features/quotes/quoteSlice';

export const store = configureStore({
  reducer: {
    tasks:  taskReducer,
    quotes: quoteReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for non-serializable values (dates, etc.)
        ignoredActions: [
          'tasks/add/fulfilled',
          'tasks/update/fulfilled',
          'tasks/toggle/fulfilled',
        ],
      },
    }),
});

export default store;
