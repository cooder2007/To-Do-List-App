// ─── Momentum App — TaskList Component ───────────────────────────────────────
import React, { useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TaskItem from './TaskItem';
import { Colors } from '../../styles/colors';
import { Theme } from '../../styles/theme';
import { taskSummary, progressRatio } from '../../features/tasks/taskUtils';
import { TASK_STATUS } from '../../utils/constants';

/**
 * Renders a labelled list of tasks for a given day tab (Today / Tomorrow).
 */
const TaskList = ({
  tasks        = [],
  day          = 'today',
  onToggle,
  onDelete,
  onEdit,
  onMoveToTomorrow,
  showDay      = false,
  showProgress = true,
  emptyMessage = 'No tasks. Enjoy the peace! 🌿',
}) => {
  const ratio   = progressRatio(tasks);
  const summary = taskSummary(tasks);
  const allDone = tasks.length > 0 && tasks.every((t) => t.status === TASK_STATUS.DONE);

  const renderItem = useCallback(
    ({ item }) => (
      <TaskItem
        task={item}
        onToggle={onToggle}
        onDelete={onDelete}
        onEdit={onEdit}
        onMoveToTomorrow={onMoveToTomorrow}
        showDay={showDay}
      />
    ),
    [onToggle, onDelete, onEdit, onMoveToTomorrow, showDay]
  );

  const keyExtractor = useCallback((item) => item.id, []);

  const ListHeader = () => (
    <View style={styles.listHeader}>
      <Text style={styles.summary}>{summary}</Text>

      {showProgress && tasks.length > 0 && (
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${Math.round(ratio * 100)}%` }]} />
        </View>
      )}
    </View>
  );

  const ListEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="checkmark-circle-outline" size={48} color={Colors.text.muted} />
      <Text style={styles.emptyText}>{emptyMessage}</Text>
    </View>
  );

  const ListFooter = () =>
    allDone && tasks.length > 0 ? (
      <View style={styles.allDone}>
        <Text style={styles.allDoneText}>🎉 All done — you're on fire!</Text>
      </View>
    ) : null;

  return (
    <FlatList
      data={tasks}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListHeaderComponent={ListHeader}
      ListEmptyComponent={ListEmpty}
      ListFooterComponent={ListFooter}
      showsVerticalScrollIndicator={false}
      scrollEnabled={false}   // parent ScrollView handles scrolling
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    paddingBottom: Theme.spacing.base,
  },
  listHeader: {
    marginBottom: Theme.spacing.sm,
    gap:          Theme.spacing.sm,
  },
  summary: {
    fontFamily:    Theme.fonts.bodyLight,
    fontSize:      Theme.fontSizes.sm,
    color:         Colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  progressTrack: {
    height:          4,
    backgroundColor: Colors.bg.tertiary,
    borderRadius:    Theme.radius.full,
    overflow:        'hidden',
  },
  progressFill: {
    height:          4,
    backgroundColor: Colors.amber[400],
    borderRadius:    Theme.radius.full,
  },
  emptyContainer: {
    alignItems:     'center',
    justifyContent: 'center',
    paddingVertical: Theme.spacing['3xl'],
    gap:            Theme.spacing.md,
  },
  emptyText: {
    fontFamily: Theme.fonts.bodyLight,
    fontSize:   Theme.fontSizes.base,
    color:      Colors.text.muted,
    textAlign:  'center',
  },
  allDone: {
    alignItems:     'center',
    paddingVertical: Theme.spacing.base,
  },
  allDoneText: {
    fontFamily: Theme.fonts.body,
    fontSize:   Theme.fontSizes.sm,
    color:      Colors.success,
  },
});

export default TaskList;
