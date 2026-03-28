// ─── Momentum App — Settings Screen ──────────────────────────────────────────
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Switch,
  TouchableOpacity, Alert, TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import { useApp }   from '../context/AppContext';
import { useQuotes } from '../hooks/useQuotes';
import { useNotifications } from '../hooks/useNotifications';
import { clearAllMomentumData } from '../services/storage';

import { Colors }  from '../styles/colors';
import { Theme }   from '../styles/theme';
import {
  QUOTE_CATEGORIES, REMINDER_PRESETS,
} from '../utils/constants';

// ── Sub-components ────────────────────────────────────────────────────────────
const SectionHeader = ({ title, icon }) => (
  <View style={s.sectionHeader}>
    <Ionicons name={icon} size={16} color={Colors.amber[400]} />
    <Text style={s.sectionTitle}>{title}</Text>
  </View>
);

const SettingRow = ({ label, description, children, onPress }) => {
  const Wrap = onPress ? TouchableOpacity : View;
  return (
    <Wrap onPress={onPress} style={s.settingRow} activeOpacity={0.75}>
      <View style={s.settingLeft}>
        <Text style={s.settingLabel}>{label}</Text>
        {description && <Text style={s.settingDesc}>{description}</Text>}
      </View>
      <View style={s.settingRight}>{children}</View>
    </Wrap>
  );
};

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { settings, updateSettings } = useApp();
  const { changeInterval, changeTags, selectedTags } = useQuotes();
  const { granted, clearAll } = useNotifications();

  const [editingName, setEditingName] = useState(false);
  const [nameInput,   setNameInput]   = useState(settings.userName ?? '');

  // ── Handlers ─────────────────────────────────────────────────────────────
  const toggle = (key) => {
    Haptics.selectionAsync();
    updateSettings({ [key]: !settings[key] });
  };

  const saveName = () => {
    updateSettings({ userName: nameInput.trim() });
    setEditingName(false);
  };

  const handleQuoteInterval = (hours) => {
    updateSettings({ quoteRefreshInterval: hours });
    changeInterval(hours);
  };

  const handleTagToggle = (tag) => {
    const next = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    changeTags(next);
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all tasks and reset your settings. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await clearAll();
            await clearAllMomentumData();
            Alert.alert('Done', 'All Momentum data has been cleared.');
          },
        },
      ]
    );
  };

  const INTERVALS = [
    { label: 'Every hour',   value: 1 },
    { label: 'Every 6h',     value: 6 },
    { label: 'Daily (24h)',  value: 24 },
    { label: 'Manually',     value: 999 },
  ];

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <View style={[s.screen, { paddingTop: insets.top }]}>

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.text.secondary} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Settings</Text>
      </View>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={[s.content, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Profile ──────────────────────────────────────────────────── */}
        <SectionHeader title="Profile" icon="person-outline" />
        <View style={s.card}>
          <SettingRow
            label="Your name"
            description="Shown in the greeting"
            onPress={() => setEditingName(true)}
          >
            {editingName ? (
              <View style={s.nameRow}>
                <TextInput
                  style={s.nameInput}
                  value={nameInput}
                  onChangeText={setNameInput}
                  autoFocus
                  returnKeyType="done"
                  onSubmitEditing={saveName}
                  placeholder="Enter name"
                  placeholderTextColor={Colors.text.muted}
                />
                <TouchableOpacity onPress={saveName}>
                  <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={s.settingValue}>
                {settings.userName || 'Not set'}
              </Text>
            )}
          </SettingRow>
        </View>

        {/* ── Quotes ───────────────────────────────────────────────────── */}
        <SectionHeader title="Motivational Quotes" icon="sparkles-outline" />
        <View style={s.card}>
          <Text style={s.subLabel}>Refresh interval</Text>
          <View style={s.pillRow}>
            {INTERVALS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                onPress={() => handleQuoteInterval(opt.value)}
                style={[
                  s.pill,
                  settings.quoteRefreshInterval === opt.value && s.pillActive,
                ]}
              >
                <Text style={[
                  s.pillText,
                  settings.quoteRefreshInterval === opt.value && s.pillTextActive,
                ]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={s.divider} />

          <Text style={s.subLabel}>Quote categories</Text>
          <View style={s.pillRow}>
            {QUOTE_CATEGORIES.map((tag) => (
              <TouchableOpacity
                key={tag}
                onPress={() => handleTagToggle(tag)}
                style={[
                  s.pill,
                  selectedTags.includes(tag) && s.pillActive,
                ]}
              >
                <Text style={[
                  s.pillText,
                  selectedTags.includes(tag) && s.pillTextActive,
                ]}>
                  {tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Notifications ─────────────────────────────────────────────── */}
        <SectionHeader title="Notifications" icon="notifications-outline" />
        <View style={s.card}>
          {!granted && (
            <View style={s.warningBanner}>
              <Ionicons name="warning-outline" size={16} color={Colors.warning} />
              <Text style={s.warningText}>
                Notifications are disabled. Enable them in system settings.
              </Text>
            </View>
          )}

          <SettingRow
            label="Task reminders"
            description="Get notified before tasks are due"
          >
            <Switch
              value={settings.taskRemindersEnabled}
              onValueChange={() => toggle('taskRemindersEnabled')}
              trackColor={{ false: Colors.bg.tertiary, true: Colors.amber[500] }}
              thumbColor={Colors.text.primary}
            />
          </SettingRow>

          <View style={s.divider} />

          <SettingRow
            label="Daily quote"
            description="Morning inspiration every day"
          >
            <Switch
              value={settings.dailyQuoteEnabled}
              onValueChange={() => toggle('dailyQuoteEnabled')}
              trackColor={{ false: Colors.bg.tertiary, true: Colors.amber[500] }}
              thumbColor={Colors.text.primary}
            />
          </SettingRow>

          {settings.dailyQuoteEnabled && (
            <>
              <View style={s.divider} />
              <Text style={s.subLabel}>Quote delivery time</Text>
              <View style={s.pillRow}>
                {[6, 7, 8, 9, 10, 12].map((h) => (
                  <TouchableOpacity
                    key={h}
                    onPress={() => updateSettings({ dailyQuoteHour: h })}
                    style={[
                      s.pill,
                      settings.dailyQuoteHour === h && s.pillActive,
                    ]}
                  >
                    <Text style={[
                      s.pillText,
                      settings.dailyQuoteHour === h && s.pillTextActive,
                    ]}>
                      {h > 12 ? `${h - 12} PM` : `${h} AM`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}
        </View>

        {/* ── Accessibility ─────────────────────────────────────────────── */}
        <SectionHeader title="Accessibility" icon="accessibility-outline" />
        <View style={s.card}>
          <SettingRow
            label="Haptic feedback"
            description="Vibration on interactions"
          >
            <Switch
              value={settings.hapticFeedback}
              onValueChange={() => toggle('hapticFeedback')}
              trackColor={{ false: Colors.bg.tertiary, true: Colors.amber[500] }}
              thumbColor={Colors.text.primary}
            />
          </SettingRow>
        </View>

        {/* ── Danger Zone ───────────────────────────────────────────────── */}
        <SectionHeader title="Data" icon="server-outline" />
        <View style={s.card}>
          <SettingRow
            label="Clear all data"
            description="Delete all tasks, settings and cache"
            onPress={handleClearData}
          >
            <Ionicons name="chevron-forward" size={18} color={Colors.danger} />
          </SettingRow>
        </View>

        {/* ── About ─────────────────────────────────────────────────────── */}
        <View style={s.about}>
          <Text style={s.aboutText}>Momentum · v1.0.0</Text>
          <Text style={s.aboutText}>Built with Expo · React Native · Redux</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  screen: {
    flex:            1,
    backgroundColor: Colors.bg.primary,
  },
  header: {
    flexDirection:     'row',
    alignItems:        'center',
    paddingHorizontal: Theme.spacing.xl,
    paddingVertical:   Theme.spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.subtle,
    gap:               Theme.spacing.base,
  },
  backBtn: {
    width:           36,
    height:          36,
    borderRadius:    Theme.radius.full,
    backgroundColor: Colors.bg.secondary,
    alignItems:      'center',
    justifyContent:  'center',
  },
  headerTitle: {
    fontFamily: Theme.fonts.display,
    fontSize:   Theme.fontSizes.xl,
    color:      Colors.text.primary,
  },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: Theme.spacing.xl,
    paddingTop:        Theme.spacing.base,
  },

  sectionHeader: {
    flexDirection:  'row',
    alignItems:     'center',
    gap:            Theme.spacing.sm,
    marginTop:      Theme.spacing.lg,
    marginBottom:   Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.xs,
  },
  sectionTitle: {
    fontFamily:    Theme.fonts.bodyLight,
    fontSize:      Theme.fontSizes.xs,
    color:         Colors.text.muted,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  card: {
    backgroundColor: Colors.bg.secondary,
    borderRadius:    Theme.radius.lg,
    borderWidth:     1,
    borderColor:     Colors.border.subtle,
    paddingHorizontal: Theme.spacing.base,
    paddingVertical:   Theme.spacing.sm,
    ...Theme.shadows.sm,
  },

  settingRow: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    paddingVertical: Theme.spacing.md,
    gap:            Theme.spacing.base,
  },
  settingLeft: { flex: 1 },
  settingRight: { alignItems: 'flex-end' },
  settingLabel: {
    fontFamily: Theme.fonts.body,
    fontSize:   Theme.fontSizes.base,
    color:      Colors.text.primary,
  },
  settingDesc: {
    fontFamily: Theme.fonts.bodyLight,
    fontSize:   Theme.fontSizes.xs,
    color:      Colors.text.muted,
    marginTop:  2,
  },
  settingValue: {
    fontFamily: Theme.fonts.body,
    fontSize:   Theme.fontSizes.sm,
    color:      Colors.amber[400],
  },

  subLabel: {
    fontFamily:    Theme.fonts.bodyLight,
    fontSize:      Theme.fontSizes.xs,
    color:         Colors.text.muted,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginTop:     Theme.spacing.sm,
    marginBottom:  Theme.spacing.sm,
  },

  pillRow: {
    flexDirection: 'row',
    flexWrap:      'wrap',
    gap:           Theme.spacing.sm,
    marginBottom:  Theme.spacing.sm,
  },
  pill: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical:   Theme.spacing.xs,
    borderRadius:      Theme.radius.full,
    borderWidth:       1,
    borderColor:       Colors.border.default,
    backgroundColor:   Colors.bg.tertiary,
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

  divider: {
    height:          1,
    backgroundColor: Colors.border.subtle,
    marginVertical:  Theme.spacing.sm,
  },

  nameRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           Theme.spacing.sm,
  },
  nameInput: {
    backgroundColor: Colors.bg.tertiary,
    borderRadius:    Theme.radius.sm,
    borderWidth:     1,
    borderColor:     Colors.border.accent,
    color:           Colors.text.primary,
    fontFamily:      Theme.fonts.body,
    fontSize:        Theme.fontSizes.sm,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical:   4,
    minWidth:          120,
  },

  warningBanner: {
    flexDirection:   'row',
    alignItems:      'center',
    gap:             Theme.spacing.sm,
    backgroundColor: `${Colors.warning}15`,
    borderRadius:    Theme.radius.sm,
    padding:         Theme.spacing.sm,
    marginVertical:  Theme.spacing.sm,
    borderWidth:     1,
    borderColor:     `${Colors.warning}30`,
  },
  warningText: {
    fontFamily: Theme.fonts.bodyLight,
    fontSize:   Theme.fontSizes.xs,
    color:      Colors.warning,
    flex:       1,
  },

  about: {
    alignItems:    'center',
    marginTop:     Theme.spacing['3xl'],
    gap:           Theme.spacing.xs,
  },
  aboutText: {
    fontFamily: Theme.fonts.bodyLight,
    fontSize:   Theme.fontSizes.xs,
    color:      Colors.text.muted,
    letterSpacing: 0.3,
  },
});
