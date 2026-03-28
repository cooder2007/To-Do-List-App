// ─── Momentum App — TaskItem Component ───────────────────────────────────────
import React, { useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Animated, PanResponder, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../styles/colors';
import { Theme } from '../../styles/theme';
import { priorityConfig } from '../../features/tasks/taskUtils';
import { formatTime, humanizeDate, isPast } from '../../utils/dateUtils';
import { TASK_STATUS } from '../../utils/constants';

const SWIPE_THRESHOLD = 80;

/**
 * Individual task row with:
 * - Checkbox to toggle done
 * - Priority color dot
 * - Swipe-left to delete
 * - Tap to edit
 * - Long-press for quick actions
 */
const TaskItem = ({
  task,
  onToggle,
  onDelete,
  onEdit,
  onMoveToTomorrow,
  showDay = false,
}) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const deleteOpacity = useRef(new Animated.Value(0)).current;
  const isDone   = task.status === TASK_STATUS.DONE;
  const priority = priorityConfig(task.priority);
  const isOverdue = task.dueTime && isPast(new Date(task.dueTime)) && !isDone;

  // ── Swipe to delete ────────────────────────────────────────────────────────
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) =>
        Math.abs(g.dx) > 8 && Math.abs(g.dy) < 20,

      onPanResponderMove: (_, g) => {
        if (g.dx < 0) {
          translateX.setValue(g.dx);
          deleteOpacity.setValue(Math.min(1, Math.abs(g.dx) / SWIPE_THRESHOLD));
        }
      },

      onPanResponderRelease: (_, g) => {
        if (g.dx < -SWIPE_THRESHOLD) {
          // Confirm delete
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          Alert.alert('Delete Task', `Delete "${task.title}"?`, [
            {
              text: 'Cancel',
              onPress: () => Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start(),
            },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: () => {
                Animated.timing(translateX, {
                  toValue: -400, duration: 200, useNativeDriver: true,
                }).start(() => onDelete(task.id));
              },
            },
          ]);
        } else {
          Animated.spring(translateX, {
            toValue: 0, useNativeDriver: true, ...Theme.animation.spring,
          }).start();
          deleteOpacity.setValue(0);
        }
      },
    })
  ).current;

  // ── Checkbox ───────────────────────────────────────────────────────────────
  const handleToggle = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onToggle(task.id);
  }, [task.id, onToggle]);

  // ── Long press actions ─────────────────────────────────────────────────────
  const handleLongPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    const options = ['Edit', 'Move to Tomorrow', 'Delete', 'Cancel'];
    Alert.alert(task.title, '', [
      { text: 'Edit',             onPress: () => onEdit?.(task) },
      { text: 'Move to Tomorrow', onPress: () => onMoveToTomorrow?.(task.id) },
      { text: 'Delete',           style: 'destructive', onPress: () => onDelete(task.id) },
      { text: 'Cancel',           style: 'cancel' },
    ]);
  }, [task, onEdit, onMoveToTomorrow, onDelete]);

  return (
    <View style={styles.container}>
      {/* Delete background */}
      <Animated.View style={[styles.deleteBg, { opacity: deleteOpacity }]}>
        <Ionicons name="trash-outline" size={22} color="#fff" />
        <Text style={styles.deleteLabel}>Delete</Text>
      </Animated.View>

      {/* Main row */}
      <Animated.View
        style={[styles.row, { transform: [{ translateX }] }]}
        {...panResponder.panHandlers}
      >
        {/* Priority dot */}
        <View style={[styles.priorityDot, { backgroundColor: priority.color }]} />

        {/* Checkbox */}
        <TouchableOpacity onPress={handleToggle} style={styles.checkbox} activeOpacity={0.7}>
          {isDone ? (
            <View style={styles.checkboxDone}>
              <Ionicons name="checkmark" size={14} color={Colors.text.inverse} />
            </View>
          ) : (
            <View style={styles.checkboxEmpty} />
          )}
        </TouchableOpacity>

        {/* Content */}
        <TouchableOpacity
          style={styles.content}
          onPress={() => onEdit?.(task)}
          onLongPress={handleLongPress}
          delayLongPress={500}
          activeOpacity={0.85}
        >
          <Text
            style={[styles.title, isDone && styles.titleDone, isOverdue && styles.titleOverdue]}
            numberOfLines={2}
          >
            {task.title}
          </Text>

          {/* Meta row */}
          <View style={styles.meta}>
            {task.dueTime && (
              <View style={styles.metaItem}>
                <Ionicons
                  name="time-outline"
                  size={12}
                  color={isOverdue ? Colors.danger : Colors.text.muted}
                />
                <Text style={[styles.metaText, isOverdue && { color: Colors.danger }]}>
                  {formatTime(new Date(task.dueTime))}
                </Text>
              </View>
            )}

            {showDay && (
              <View style={styles.metaItem}>
                <Ionicons name="calendar-outline" size={12} color={Colors.text.muted} />
                <Text style={styles.metaText}>
                  {task.day === 'today' ? 'Today' : 'Tomorrow'}
                </Text>
              </View>
            )}

            {task.reminder != null && (
              <View style={styles.metaItem}>
                <Ionicons name="notifications-outline" size={12} color={Colors.amber[400]} />
              </View>
            )}

            {task.notes ? (
              <View style={styles.metaItem}>
                <Ionicons name="document-text-outline" size={12} color={Colors.text.muted} />
              </View>
            ) : null}
          </View>
        </TouchableOpacity>

        {/* Chevron */}
        <Ionicons name="chevron-forward" size={16} color={Colors.text.muted} style={styles.chevron} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position:     'relative',
    marginBottom: Theme.spacing.sm,
    borderRadius: Theme.radius.md,
    overflow:     'hidden',
  },
  deleteBg: {
    position:       'absolute',
    right:          0,
    top:            0,
    bottom:         0,
    width:          90,
    backgroundColor: Colors.danger,
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'center',
    gap:             4,
    borderRadius:    Theme.radius.md,
  },
  deleteLabel: {
    color:      '#fff',
    fontFamily: Theme.fonts.body,
    fontSize:   Theme.fontSizes.xs,
  },
  row: {
    flexDirection:   'row',
    alignItems:      'center',
    backgroundColor: Colors.bg.secondary,
    borderRadius:    Theme.radius.md,
    borderWidth:     1,
    borderColor:     Colors.border.subtle,
    paddingVertical: Theme.spacing.md,
    paddingRight:    Theme.spacing.md,
    ...Theme.shadows.sm,
  },
  priorityDot: {
    width:        3,
    alignSelf:    'stretch',
    borderRadius: Theme.radius.full,
    marginRight:  Theme.spacing.md,
    marginLeft:   0,
    minHeight:    40,
  },
  checkbox: {
    marginRight: Theme.spacing.md,
  },
  checkboxEmpty: {
    width:        22,
    height:       22,
    borderRadius: Theme.radius.sm,
    borderWidth:  2,
    borderColor:  Colors.border.strong,
  },
  checkboxDone: {
    width:           22,
    height:          22,
    borderRadius:    Theme.radius.sm,
    backgroundColor: Colors.success,
    alignItems:      'center',
    justifyContent:  'center',
  },
  content: {
    flex: 1,
    gap:  4,
  },
  title: {
    fontFamily: Theme.fonts.body,
    fontSize:   Theme.fontSizes.base,
    color:      Colors.text.primary,
  },
  titleDone: {
    color:           Colors.text.muted,
    textDecorationLine: 'line-through',
  },
  titleOverdue: {
    color: Colors.danger,
  },
  meta: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           Theme.spacing.md,
    marginTop:     2,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           3,
  },
  metaText: {
    fontFamily: Theme.fonts.bodyLight,
    fontSize:   Theme.fontSizes.xs,
    color:      Colors.text.muted,
  },
  chevron: {
    marginLeft: Theme.spacing.sm,
  },
});

export default TaskItem;
