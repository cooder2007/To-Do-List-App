// ─── Momentum App — AddTaskInput Component ───────────────────────────────────
import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  ScrollView, Switch, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Haptics from 'expo-haptics';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { Colors } from '../../styles/colors';
import { Theme } from '../../styles/theme';
import { PRIORITY_OPTIONS, DAY_OPTIONS } from '../../features/tasks/taskUtils';
import { REMINDER_PRESETS } from '../../utils/constants';
import { formatTime } from '../../utils/dateUtils';

const INITIAL_FORM = {
  title:    '',
  notes:    '',
  day:      'today',
  priority: 'none',
  dueTime:  null,
  reminder: null,
};

/**
 * Bottom-sheet modal for adding or editing a task.
 */
const AddTaskInput = ({
  visible,
  onClose,
  onSubmit,
  initialValues = null,   // pre-fill for editing
}) => {
  const isEdit = !!initialValues;

  const [form,        setForm]        = useState(initialValues ?? INITIAL_FORM);
  const [showTimePicker, setShowTime] = useState(false);
  const [showReminderPicker, setShowReminder] = useState(false);
  const [errors,      setErrors]      = useState({});
  const titleRef = useRef(null);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const update = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  }, [errors]);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onSubmit({ ...form, title: form.title.trim() });
    setForm(INITIAL_FORM);
    onClose();
  };

  const handleClose = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    onClose();
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <Modal
      visible={visible}
      onClose={handleClose}
      title={isEdit ? 'Edit Task' : 'New Task'}
      position="bottom"
      scrollable
    >
      {/* Title */}
      <View style={styles.field}>
        <Text style={styles.label}>What needs to be done?</Text>
        <TextInput
          ref={titleRef}
          style={[styles.input, styles.titleInput, errors.title && styles.inputError]}
          value={form.title}
          onChangeText={(v) => update('title', v)}
          placeholder="Task title…"
          placeholderTextColor={Colors.text.muted}
          autoFocus
          returnKeyType="next"
          maxLength={120}
        />
        {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
      </View>

      {/* Notes */}
      <View style={styles.field}>
        <Text style={styles.label}>Notes (optional)</Text>
        <TextInput
          style={[styles.input, styles.notesInput]}
          value={form.notes}
          onChangeText={(v) => update('notes', v)}
          placeholder="Add notes…"
          placeholderTextColor={Colors.text.muted}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          maxLength={500}
        />
      </View>

      {/* Day selector */}
      <View style={styles.field}>
        <Text style={styles.label}>Scheduled for</Text>
        <View style={styles.pillRow}>
          {DAY_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              onPress={() => update('day', opt.value)}
              style={[
                styles.pill,
                form.day === opt.value && styles.pillActive,
              ]}
            >
              <Text style={[
                styles.pillText,
                form.day === opt.value && styles.pillTextActive,
              ]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Priority selector */}
      <View style={styles.field}>
        <Text style={styles.label}>Priority</Text>
        <View style={styles.pillRow}>
          {PRIORITY_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              onPress={() => update('priority', opt.value)}
              style={[
                styles.pill,
                form.priority === opt.value && { borderColor: opt.color, backgroundColor: `${opt.color}22` },
              ]}
            >
              <View style={[styles.dot, { backgroundColor: opt.color }]} />
              <Text style={[
                styles.pillText,
                form.priority === opt.value && { color: opt.color },
              ]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Due time */}
      <View style={styles.field}>
        <View style={styles.rowBetween}>
          <Text style={styles.label}>Due time</Text>
          {form.dueTime && (
            <TouchableOpacity onPress={() => update('dueTime', null)}>
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.timeButton}
          onPress={() => setShowTime(true)}
        >
          <Ionicons name="time-outline" size={18} color={Colors.amber[400]} />
          <Text style={styles.timeText}>
            {form.dueTime ? formatTime(new Date(form.dueTime)) : 'Set a time'}
          </Text>
        </TouchableOpacity>

        {showTimePicker && (
          <DateTimePicker
            value={form.dueTime ? new Date(form.dueTime) : new Date()}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(_, date) => {
              setShowTime(false);
              if (date) update('dueTime', date.toISOString());
            }}
            themeVariant="dark"
          />
        )}
      </View>

      {/* Reminder */}
      {form.dueTime && (
        <View style={styles.field}>
          <Text style={styles.label}>Reminder</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: Theme.spacing.sm }}
          >
            {REMINDER_PRESETS.map((preset) => (
              <TouchableOpacity
                key={preset.value}
                onPress={() => update('reminder', form.reminder === preset.value ? null : preset.value)}
                style={[
                  styles.pill,
                  form.reminder === preset.value && styles.pillActive,
                ]}
              >
                <Text style={[
                  styles.pillText,
                  form.reminder === preset.value && styles.pillTextActive,
                ]}>
                  {preset.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Submit */}
      <View style={styles.actions}>
        <Button
          title="Cancel"
          variant="ghost"
          onPress={handleClose}
          style={{ flex: 1 }}
        />
        <Button
          title={isEdit ? 'Save Changes' : 'Add Task'}
          variant="primary"
          onPress={handleSubmit}
          style={{ flex: 1 }}
          fullWidth
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  field: {
    marginBottom: Theme.spacing.lg,
  },
  label: {
    fontFamily:    Theme.fonts.bodyLight,
    fontSize:      Theme.fontSizes.xs,
    color:         Colors.text.muted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom:  Theme.spacing.sm,
  },
  input: {
    backgroundColor: Colors.bg.tertiary,
    borderRadius:    Theme.radius.md,
    borderWidth:     1,
    borderColor:     Colors.border.default,
    color:           Colors.text.primary,
    fontFamily:      Theme.fonts.body,
    fontSize:        Theme.fontSizes.base,
    paddingHorizontal: Theme.spacing.base,
    paddingVertical:   Theme.spacing.md,
  },
  titleInput: {
    fontSize: Theme.fontSizes.md,
  },
  notesInput: {
    minHeight:  90,
    paddingTop: Theme.spacing.md,
  },
  inputError: {
    borderColor: Colors.danger,
  },
  errorText: {
    fontFamily: Theme.fonts.bodyLight,
    fontSize:   Theme.fontSizes.xs,
    color:      Colors.danger,
    marginTop:  Theme.spacing.xs,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap:      'wrap',
    gap:           Theme.spacing.sm,
  },
  pill: {
    flexDirection:   'row',
    alignItems:      'center',
    gap:             6,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical:   Theme.spacing.sm,
    borderRadius:    Theme.radius.full,
    borderWidth:     1,
    borderColor:     Colors.border.default,
    backgroundColor: Colors.bg.tertiary,
  },
  pillActive: {
    borderColor:     Colors.amber[400],
    backgroundColor: `${Colors.amber[400]}22`,
  },
  pillText: {
    fontFamily: Theme.fonts.body,
    fontSize:   Theme.fontSizes.sm,
    color:      Colors.text.secondary,
  },
  pillTextActive: {
    color: Colors.amber[400],
  },
  dot: {
    width:        8,
    height:       8,
    borderRadius: Theme.radius.full,
  },
  rowBetween: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    marginBottom:   Theme.spacing.sm,
  },
  clearText: {
    fontFamily: Theme.fonts.body,
    fontSize:   Theme.fontSizes.sm,
    color:      Colors.danger,
  },
  timeButton: {
    flexDirection:   'row',
    alignItems:      'center',
    gap:             Theme.spacing.sm,
    padding:         Theme.spacing.md,
    borderRadius:    Theme.radius.md,
    borderWidth:     1,
    borderColor:     Colors.border.accent,
    backgroundColor: Colors.bg.tertiary,
  },
  timeText: {
    fontFamily: Theme.fonts.body,
    fontSize:   Theme.fontSizes.base,
    color:      Colors.amber[400],
  },
  actions: {
    flexDirection: 'row',
    gap:           Theme.spacing.md,
    marginTop:     Theme.spacing.sm,
    marginBottom:  Theme.spacing.lg,
  },
});

export default AddTaskInput;
