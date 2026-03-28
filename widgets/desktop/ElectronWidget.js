// ─── Momentum App — Electron Desktop Widget ──────────────────────────────────
// Renders a floating always-on-top window on macOS / Windows / Linux.
// Requires: Expo for Electron (or custom Electron + React Native Web setup).
//
// This module exports the widget window configuration and IPC message handlers.

/**
 * Electron BrowserWindow options for the floating widget.
 * Use in your electron/main.js when creating the widget window.
 */
export const WIDGET_WINDOW_OPTIONS = {
  width:           340,
  height:          440,
  minWidth:        280,
  minHeight:       180,
  maxWidth:        480,
  maxHeight:       600,
  frame:           false,        // Frameless — custom drag handle
  transparent:     true,         // Allows border-radius + shadow to show
  alwaysOnTop:     true,         // Float above other windows
  resizable:       true,
  skipTaskbar:     false,
  hasShadow:       true,
  vibrancy:        'under-window', // macOS blur
  visualEffectState: 'active',
  webPreferences: {
    nodeIntegration:    false,
    contextIsolation:   true,
    preload:            './electron/preload.js',
  },
  show: false,   // Show after 'ready-to-show'
};

/**
 * IPC channel names used between main and renderer.
 */
export const IPC = {
  // Main → Renderer
  WIDGET_DATA_UPDATED: 'widget:data-updated',
  WIDGET_SHOW:         'widget:show',
  WIDGET_HIDE:         'widget:hide',
  WIDGET_TOGGLE:       'widget:toggle',

  // Renderer → Main
  TASK_TOGGLE:         'task:toggle',
  QUOTE_REFRESH:       'quote:refresh',
  WIDGET_DRAG:         'widget:drag',
  OPEN_MAIN:           'app:open-main',
  CLOSE_WIDGET:        'widget:close',
};

/**
 * Builds the widget data payload from the Redux store state.
 * Call this in your Electron main process and send via IPC.
 */
export const buildWidgetPayload = ({ tasks, quote }) => {
  const todayTasks = (tasks ?? [])
    .filter((t) => t.day === 'today' && t.status !== 'done')
    .slice(0, 5)
    .map(({ id, title, priority, dueTime, status }) => ({
      id, title, priority, dueTime, status,
    }));

  return {
    tasks:     todayTasks,
    quote:     quote ? { content: quote.content, author: quote.author } : null,
    timestamp: Date.now(),
  };
};

/**
 * System tray menu template (Electron Menu.buildFromTemplate format).
 * Call this in electron/main.js to build the tray context menu.
 */
export const buildTrayMenuTemplate = (isWidgetVisible) => [
  { label: 'Momentum', enabled: false },
  { type: 'separator' },
  {
    label: isWidgetVisible ? 'Hide Widget' : 'Show Widget',
    click: () => {},   // Replace with actual IPC dispatch
  },
  { label: 'Open App', click: () => {} },
  { type: 'separator' },
  { label: 'Quit', role: 'quit' },
];

// ── Preload script API surface (electron/preload.js) ─────────────────────────
/**
 * Paste this into your electron/preload.js:
 *
 * const { contextBridge, ipcRenderer } = require('electron');
 * contextBridge.exposeInMainWorld('momentumBridge', {
 *   onDataUpdate: (cb) => ipcRenderer.on('widget:data-updated', (_, d) => cb(d)),
 *   toggleTask:   (id) => ipcRenderer.send('task:toggle', id),
 *   refreshQuote: ()   => ipcRenderer.send('quote:refresh'),
 *   openMain:     ()   => ipcRenderer.send('app:open-main'),
 *   closeWidget:  ()   => ipcRenderer.send('widget:close'),
 *   dragWidget:   (x, y) => ipcRenderer.send('widget:drag', { x, y }),
 * });
 */

// ── Widget React component (runs in renderer, React Native Web) ───────────────
/**
 * The floating desktop widget UI is in the React Native Web bundle.
 * It listens for window.momentumBridge.onDataUpdate and renders a
 * compact QuoteWidget + TaskList in a always-on-top frameless window.
 *
 * See the README for the full Electron setup guide.
 */
export const DESKTOP_WIDGET_DESCRIPTION = `
  Momentum Desktop Widget — Floating frameless window
  ├── QuoteWidget (compact, size='sm')
  ├── Divider
  ├── TaskList (today tasks, scrollable, max 5)
  └── Footer: "Open App" | "×" close button
`;
