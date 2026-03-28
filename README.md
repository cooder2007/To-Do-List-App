# To-Do-List-App

# ⚡ Momentum — Motivational Quotes & Two-Day Task Manager

> _A cross-platform productivity app built with Expo / React Native._  
> Dark gold "executive journal" aesthetic. Runs on iOS, Android, and Web.

---

## ✨ Features

| Feature | Details |
|---|---|
| **Motivational Quotes** | Fetches from `quotable.io` with offline fallback — daily, hourly, or on demand |
| **Two-Day To-Do List** | Separate Today / Tomorrow tabs with swipe-to-delete, priority levels, and progress tracking |
| **Smart Reminders** | Per-task notifications (5 min → 2 hr presets) + daily quote push at a configurable time |
| **Widgets** | Android (home screen), iOS (WidgetKit lock/home screen), Desktop (Electron floating window) |
| **Offline-First** | AsyncStorage persists all tasks & quote cache; Firebase optional for sync |
| **Customisable** | Quote categories, refresh interval, notification time, haptics, user name |

---

## 🗂 Project Structure

```

momentum-app/
│
├── app/                         # Entry (Expo Router or navigation root)
│   ├── _layout.js
│   ├── index.js                # Home screen
│   ├── settings.js
│
├── assets/                     # Static files
│   ├── fonts/
│   ├── images/
│   └── icons/
│
├── components/                 # Reusable UI components
│   ├── common/
│   │   ├── Button.js
│   │   ├── Card.js
│   │   ├── Modal.js
│   │
│   ├── quote/
│   │   ├── QuoteCard.js
│   │   └── QuoteWidget.js
│   │
│   ├── tasks/
│   │   ├── TaskItem.js
│   │   ├── TaskList.js
│   │   └── AddTaskInput.js
│   │
│   └── layout/
│       ├── Header.js
│       └── Container.js
│
├── screens/                    # Full screens (if not using Expo Router)
│   ├── HomeScreen.js
│   ├── SettingsScreen.js
│
├── features/                   # Feature-based modular logic 🔥
│   ├── quotes/
│   │   ├── quoteSlice.js      # State (Redux/Context)
│   │   ├── quoteService.js    # API / logic
│   │   └── quoteUtils.js
│   │
│   ├── tasks/
│   │   ├── taskSlice.js
│   │   ├── taskService.js
│   │   └── taskUtils.js
│   │
│   └── notifications/
│       ├── notificationService.js
│       └── notificationUtils.js
│
├── hooks/                      # Custom hooks
│   ├── useTasks.js
│   ├── useQuotes.js
│   └── useNotifications.js
│
├── context/                    # Context API (if not Redux)
│   ├── AppContext.js
│   └── ThemeContext.js
│
├── services/                   # External integrations
│   ├── firebase/
│   │   ├── config.js
│   │   ├── auth.js
│   │   └── database.js
│   │
│   └── storage.js             # AsyncStorage / local storage
│
├── utils/                      # Helper functions
│   ├── dateUtils.js
│   ├── constants.js
│   └── helpers.js
│
├── styles/                     # Global styles
│   ├── theme.js
│   ├── colors.js
│   └── globalStyles.js
│
├── widgets/                    # Widget logic (advanced phase)
│   ├── mobile/
│   │   ├── AndroidWidget.js
│   │   └── iOSWidget.js
│   │
│   └── desktop/
│       └── ElectronWidget.js
│
├── notifications/              # Notification config
│   ├── index.js
│   └── scheduler.js
│
├── navigation/                 # Navigation config
│   └── index.js
│
├── .env                        # API keys
├── app.json                    # Expo config
├── package.json
└── README.md                   # Current file
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 18
- Expo CLI: `npm install -g expo`
- iOS: Xcode + Simulator  
- Android: Android Studio + Emulator or physical device

### Install

```bash
git clone https://github.com/yourname/momentum-app.git
cd momentum-app
npm install
```

### Environment

```bash
cp .env.example .env
# Fill in your Firebase keys and Quotes API key
```

### Run

```bash
# iOS Simulator
npm run ios

# Android Emulator / device
npm run android

# Web (browser)
npm run web
```

---

## 🔑 Environment Variables

| Key | Description |
|---|---|
| `EXPO_PUBLIC_QUOTES_API_URL` | Base URL for quotes API (`https://api.quotable.io`) |
| `EXPO_PUBLIC_FIREBASE_*` | Firebase project credentials |

> All `EXPO_PUBLIC_` prefixed vars are bundled into the client — never put secrets here.

---

## 🏗 Architecture

### State Management
- **Redux Toolkit** slices: `tasks`, `quotes`
- **Context API**: `AppContext` (settings, auth state), `ThemeContext`
- **AsyncStorage**: offline-first persistence for tasks + quote cache

### Navigation
- **Expo Router** (file-based): `app/index.js` → Home, `app/settings.js` → Settings
- Bottom sheet modals for Add / Edit task (no separate screen needed)

### Notifications
- **expo-notifications** for local scheduling
- Per-task reminders (triggered `N` minutes before due time)
- Daily quote notification (configurable hour)
- Deep-link on tap → navigates to home with task highlighted

---

## 📱 Widgets

### Android
Uses `react-native-android-widget` + a Kotlin `AppWidgetProvider`.

1. Add the dependency: `npm install react-native-android-widget`
2. Create `android/app/src/main/kotlin/.../MomentumWidgetProvider.kt`
3. Register in `AndroidManifest.xml`
4. Call `registerAndroidWidget()` in your app entry

See `widgets/mobile/AndroidWidget.js` for the JS handler.

### iOS (WidgetKit)
1. Add a **Widget Extension** target in Xcode
2. Set the **App Group** to `group.com.yourname.momentum`
3. Create a Swift `WidgetKit` timeline entry that reads from `UserDefaults(suiteName:)`
4. Call `syncToWidget()` after every task mutation

See `widgets/mobile/iOSWidget.js` for the sync bridge.

### Desktop (Electron)
1. Add `electron` + `electron-builder` to your project
2. Create `electron/main.js` using `WIDGET_WINDOW_OPTIONS` from `widgets/desktop/ElectronWidget.js`
3. Use `contextBridge` preload script (template in `ElectronWidget.js`)
4. The React Native Web build serves as the renderer

---

## 🧪 Testing

```bash
npm test                # Jest + jest-expo
npm run lint            # ESLint
```

Test files go in `__tests__/` alongside each module, e.g.:
- `features/tasks/__tests__/taskSlice.test.js`
- `utils/__tests__/dateUtils.test.js`

---

## 🎨 Design System

| Token | Value |
|---|---|
| Primary bg | `#0D1117` |
| Surface | `#161B22` |
| Accent | `#F5A623` (Amber 400) |
| Text primary | `#F0E6D3` (Warm cream) |
| Display font | Playfair Display (serif) |
| Body font | DM Sans |

All tokens live in `styles/colors.js` and `styles/theme.js`.

---

## 📦 Key Dependencies

| Package | Purpose |
|---|---|
| `expo` ~51 | Cross-platform runtime |
| `expo-router` | File-based navigation |
| `@reduxjs/toolkit` | State management |
| `expo-notifications` | Local push notifications |
| `expo-haptics` | Tactile feedback |
| `expo-linear-gradient` | Amber gradient accents |
| `firebase` | Optional cloud sync |
| `@react-native-async-storage/async-storage` | Offline persistence |

---

## 📄 Licence

MIT © 2026 Your Name
