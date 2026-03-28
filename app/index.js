// ─── Momentum App — Home Screen ───────────────────────────────────────────────
import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Animated, Dimensions, RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import { useApp }           from '../context/AppContext';
import { useTasks }         from '../hooks/useTasks';
import { useQuotes }        from '../hooks/useQuotes';
import { useNotifications } from '../hooks/useNotifications';

import Header        from '../components/layout/Header';
import QuoteCard     from '../components/quote/QuoteCard';
import TaskList      from '../components/tasks/TaskList';
import AddTaskInput  from '../components/tasks/AddTaskInput';

import { Colors }  from '../styles/colors';
import { Theme }   from '../styles/theme';
import { completionMessage } from '../features/tasks/taskUtils';
import { taskCompletionPercent, getGreeting } from '../utils/helpers';
import { formatFullDate } from '../utils/dateUtils';

const { width: SCREEN_W } = Dimensions.get('window');
const TAB_TODAY    = 'today';
const TAB_TOMORROW = 'tomorrow';

export default function HomeScreen() {
  const router   = useRouter();
  const insets   = useSafeAreaInsets();
  const params   = useLocalSearchParams();
  const { settings } = useApp();

  // ── Feature hooks ────────────────────────────────────────────────────────
  const {
    todayTasks, tomorrowTasks, stats, loading: tasksLoading,
    load, add, update, toggle, remove, moveToTomorrow,
    editingTask, startEditing, stopEditing, scheduleReminder, removeReminder,
  } = useTasks();

  const {
    current: quote, loading: quoteLoading, isCurrentFavorite,
    refresh: refreshQuote, toggleFavorite,
  } = useQuotes();

  useNotifications(); // sets up listeners / permissions

  // ── Local state ──────────────────────────────────────────────────────────
  const [activeTab,      setActiveTab]      = useState(TAB_TODAY);
  const [addModalVisible, setAddModal]      = useState(false);
  const [refreshing,      setRefreshing]    = useState(false);
  const tabAnim = useRef(new Animated.Value(0)).current;
  const fabAnim = useRef(new Animated.Value(1)).current;

  // ── Bootstrap ─────────────────────────────────────────────────────────────
  useEffect(() => {
    load();
    refreshQuote();
  }, []);

  // ── Handle notification deep-link ─────────────────────────────────────────
  useEffect(() => {
    if (params?.highlightTask) {
      // Find which day the task belongs to and switch tab
      const taskInToday = todayTasks.find((t) => t.id === params.highlightTask);
      setActiveTab(taskInToday ? TAB_TODAY : TAB_TOMORROW);
    }
  }, [params?.highlightTask]);

  // ── Tab animation ─────────────────────────────────────────────────────────
  const switchTab = useCallback((tab) => {
    Haptics.selectionAsync();
    setActiveTab(tab);
    Animated.spring(tabAnim, {
      toValue:         tab === TAB_TODAY ? 0 : 1,
      useNativeDriver: true,
      ...Theme.animation.spring,
    }).start();
  }, [tabAnim]);

  // ── Pull-to-refresh ───────────────────────────────────────────────────────
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([load(), refreshQuote(true)]);
    setRefreshing(false);
  }, [load, refreshQuote]);

  // ── Task handlers ─────────────────────────────────────────────────────────
  const handleAddTask = useCallback(async (formData) => {
    const action = await add(formData);
    if (action?.payload) {
      await scheduleReminder(action.payload);
    }
  }, [add, scheduleReminder]);

  const handleUpdateTask = useCallback(async (id, changes) => {
    await update(id, changes);
    stopEditing();
  }, [update, stopEditing]);

  const handleToggle = useCallback(async (id) => {
    await toggle(id);
  }, [toggle]);

  const handleDelete = useCallback(async (id) => {
    await removeReminder(id);
    await remove(id);
  }, [remove, removeReminder]);

  const handleMoveToTomorrow = useCallback(async (id) => {
    await moveToTomorrow(id);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [moveToTomorrow]);

  // ── Derived ───────────────────────────────────────────────────────────────
  const currentTasks = activeTab === TAB_TODAY ? todayTasks : tomorrowTasks;
  const todayPercent = taskCompletionPercent(todayTasks);
  const todayStats   = stats.today;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <View style={styles.screen}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <Header
        userName={settings.userName}
        onSettingsPress={() => router.push('/settings')}
      />

      {/* ── Main scroll ────────────────────────────────────────────────────── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.amber[400]}
            colors={[Colors.amber[400]]}
          />
        }
      >
        {/* ── Quote Card ─────────────────────────────────────────────────── */}
        <View style={styles.section}>
          <QuoteCard
            quote={quote}
            loading={quoteLoading}
            isFavorite={isCurrentFavorite}
            onRefresh={refreshQuote}
            onToggleFavorite={toggleFavorite}
          />
        </View>

        {/* ── Progress Banner ────────────────────────────────────────────── */}
        {todayTasks.length > 0 && (
          <View style={styles.progressBanner}>
            <Text style={styles.progressMessage}>
              {completionMessage(todayPercent)}
            </Text>
            <Text style={styles.progressStats}>
              {todayStats.done}/{todayStats.total} today
            </Text>
          </View>
        )}

        {/* ── Day Tabs ───────────────────────────────────────────────────── */}
        <View style={styles.tabs}>
          {[TAB_TODAY, TAB_TOMORROW].map((tab) => {
            const isActive = activeTab === tab;
            const count    = tab === TAB_TODAY ? todayTasks.length : tomorrowTasks.length;
            return (
              <TouchableOpacity
                key={tab}
                onPress={() => switchTab(tab)}
                style={[styles.tab, isActive && styles.tabActive]}
                activeOpacity={0.75}
              >
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                  {tab === TAB_TODAY ? 'Today' : 'Tomorrow'}
                </Text>
                {count > 0 && (
                  <View style={[styles.badge, isActive && styles.badgeActive]}>
                    <Text style={[styles.badgeText, isActive && styles.badgeTextActive]}>
                      {count}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Task List ──────────────────────────────────────────────────── */}
        <View style={styles.section}>
          <TaskList
            tasks={currentTasks}
            day={activeTab}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onEdit={startEditing}
            onMoveToTomorrow={handleMoveToTomorrow}
            showProgress={false}
            emptyMessage={
              activeTab === TAB_TODAY
                ? 'Nothing for today. Add your first task! ✨'
                : 'No tasks for tomorrow yet.'
            }
          />
        </View>
      </ScrollView>

      {/* ── FAB — Add Task ─────────────────────────────────────────────────── */}
      <Animated.View style={[styles.fabContainer, { transform: [{ scale: fabAnim }] }]}>
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            setAddModal(true);
          }}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={Colors.gradients.amber}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.fab, { marginBottom: insets.bottom || Theme.spacing.base }]}
          >
            <Ionicons name="add" size={28} color={Colors.text.inverse} />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      {/* ── Add Task Modal ────────────────────────────────────────────────── */}
      <AddTaskInput
        visible={addModalVisible}
        onClose={() => setAddModal(false)}
        onSubmit={handleAddTask}
        initialValues={editingTask ? {
          title:    editingTask.title,
          notes:    editingTask.notes,
          day:      editingTask.day,
          priority: editingTask.priority,
          dueTime:  editingTask.dueTime,
          reminder: editingTask.reminder,
        } : null}
      />

      {/* ── Edit Task Modal ───────────────────────────────────────────────── */}
      {editingTask && (
        <AddTaskInput
          visible={!!editingTask}
          onClose={stopEditing}
          onSubmit={(data) => handleUpdateTask(editingTask.id, data)}
          initialValues={{
            title:    editingTask.title,
            notes:    editingTask.notes,
            day:      editingTask.day,
            priority: editingTask.priority,
            dueTime:  editingTask.dueTime,
            reminder: editingTask.reminder,
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex:            1,
    backgroundColor: Colors.bg.primary,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Theme.spacing.xl,
    paddingTop:        Theme.spacing.base,
  },
  section: {
    marginBottom: Theme.spacing.lg,
  },

  // Progress banner
  progressBanner: {
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'space-between',
    marginBottom:    Theme.spacing.base,
    paddingHorizontal: Theme.spacing.sm,
  },
  progressMessage: {
    fontFamily: Theme.fonts.body,
    fontSize:   Theme.fontSizes.sm,
    color:      Colors.text.secondary,
    flex: 1,
  },
  progressStats: {
    fontFamily:    Theme.fonts.bodyLight,
    fontSize:      Theme.fontSizes.xs,
    color:         Colors.amber[400],
    letterSpacing: 0.5,
  },

  // Tabs
  tabs: {
    flexDirection:   'row',
    backgroundColor: Colors.bg.secondary,
    borderRadius:    Theme.radius.lg,
    padding:         4,
    marginBottom:    Theme.spacing.base,
    borderWidth:     1,
    borderColor:     Colors.border.subtle,
  },
  tab: {
    flex:           1,
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'center',
    paddingVertical: Theme.spacing.sm,
    borderRadius:   Theme.radius.md,
    gap:            6,
  },
  tabActive: {
    backgroundColor: Colors.bg.tertiary,
    borderWidth:     1,
    borderColor:     Colors.border.accent,
  },
  tabText: {
    fontFamily: Theme.fonts.body,
    fontSize:   Theme.fontSizes.sm,
    color:      Colors.text.muted,
  },
  tabTextActive: {
    color: Colors.amber[400],
  },
  badge: {
    backgroundColor: Colors.bg.primary,
    borderRadius:    Theme.radius.full,
    paddingHorizontal: 6,
    paddingVertical:   1,
    minWidth:          20,
    alignItems:        'center',
  },
  badgeActive: {
    backgroundColor: Colors.amber[400],
  },
  badgeText: {
    fontFamily: Theme.fonts.body,
    fontSize:   Theme.fontSizes.xs,
    color:      Colors.text.muted,
  },
  badgeTextActive: {
    color: Colors.text.inverse,
  },

  // FAB
  fabContainer: {
    position: 'absolute',
    right:    Theme.spacing.xl,
    bottom:   Theme.spacing.xl,
    ...Theme.shadows.amber,
  },
  fab: {
    width:          60,
    height:         60,
    borderRadius:   Theme.radius.full,
    alignItems:     'center',
    justifyContent: 'center',
  },
});
