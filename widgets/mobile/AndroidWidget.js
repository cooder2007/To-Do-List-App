// ─── Momentum App — Android Home Screen Widget ───────────────────────────────
// Android widgets use react-native-android-widget (or Glance via Kotlin bridge).
// This module exports the widget definition + registration helpers.
//
// ⚠️  Requires native Kotlin/Gradle setup. See README § Widgets for setup steps.
// Reference: https://github.com/sAleksovski/react-native-android-widget

import { registerWidgetTaskHandler } from 'react-native-android-widget';
import { loadData, saveData }        from '../../services/storage';
import { STORAGE_KEYS }              from '../../utils/constants';

// ── Widget task handler (runs in background JS context) ───────────────────────
export const widgetTaskHandler = async (props) => {
  const { widgetName, widgetId, widgetAction, clickAction } = props;

  switch (widgetAction) {
    // Called when the widget is first placed or updated
    case 'WIDGET_ADDED':
    case 'WIDGET_UPDATE': {
      await updateWidgetData(widgetId);
      break;
    }

    // User tapped a task checkbox in the widget
    case 'WIDGET_CLICK': {
      if (clickAction?.type === 'TOGGLE_TASK') {
        await handleWidgetToggle(clickAction.taskId);
        await updateWidgetData(widgetId);
      }
      break;
    }

    case 'WIDGET_DELETED': {
      console.log(`[AndroidWidget] Widget ${widgetId} removed.`);
      break;
    }
  }
};

// ── Data helpers ──────────────────────────────────────────────────────────────
const updateWidgetData = async (widgetId) => {
  const tasks = await loadData(STORAGE_KEYS.TASKS, []);
  const quote = await loadData(STORAGE_KEYS.QUOTE_CACHE, null);
  const today = tasks.filter((t) => t.day === 'today' && t.status !== 'done').slice(0, 4);

  // Push new data to the widget via the native module
  // (Implementation depends on the Kotlin WidgetProvider)
  try {
    const { MomentumWidgetModule } = require('react-native').NativeModules;
    if (MomentumWidgetModule?.updateWidget) {
      await MomentumWidgetModule.updateWidget(widgetId, JSON.stringify({ tasks: today, quote }));
    }
  } catch (err) {
    console.warn('[AndroidWidget] Could not update widget data:', err.message);
  }
};

const handleWidgetToggle = async (taskId) => {
  const tasks   = await loadData(STORAGE_KEYS.TASKS, []);
  const updated = tasks.map((t) =>
    t.id === taskId
      ? { ...t, status: t.status === 'done' ? 'todo' : 'done', updatedAt: new Date().toISOString() }
      : t
  );
  await saveData(STORAGE_KEYS.TASKS, updated);
};

// ── Registration (call once at app startup) ────────────────────────────────────
export const registerAndroidWidget = () => {
  try {
    registerWidgetTaskHandler(widgetTaskHandler);
    console.log('[AndroidWidget] Widget task handler registered.');
  } catch (err) {
    console.warn('[AndroidWidget] Registration failed (likely not installed):', err.message);
  }
};

// ── Widget size configurations ────────────────────────────────────────────────
export const WIDGET_CONFIGS = {
  // 4×2 home screen widget
  QUOTE_TASK: {
    name:        'MomentumWidget',
    label:       'Momentum — Quotes & Tasks',
    description: 'Today\'s quote + task list on your home screen',
    minWidth:    250,
    minHeight:   120,
    targetWidth: 280,
    targetHeight:160,
    resizable:   true,
  },
  // 2×1 compact quote widget
  QUOTE_ONLY: {
    name:        'MomentumQuoteWidget',
    label:       'Momentum Quote',
    description: 'Daily motivational quote',
    minWidth:    120,
    minHeight:   60,
    targetWidth: 200,
    targetHeight: 80,
    resizable:   false,
  },
};
