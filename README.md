# To-Do-List-App

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
