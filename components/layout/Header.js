// ─── Momentum App — Header Component ─────────────────────────────────────────
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../styles/colors';
import { Theme } from '../../styles/theme';
import { getGreeting } from '../../utils/helpers';
import { formatShortDate } from '../../utils/dateUtils';

/**
 * App header with greeting, date, and optional actions.
 */
const Header = ({
  userName       = '',
  onSettingsPress,
  rightAction    = null,   // optional custom right-side element
  showGreeting   = true,
  showDate       = true,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + Theme.spacing.sm }]}>
      {/* Left: greeting + date */}
      <View style={styles.left}>
        {showGreeting && (
          <Text style={styles.greeting}>
            {getGreeting()}{userName ? `, ${userName}` : ''}
          </Text>
        )}
        {showDate && (
          <Text style={styles.date}>{formatShortDate(new Date())}</Text>
        )}
      </View>

      {/* Right: settings or custom action */}
      <View style={styles.right}>
        {rightAction ?? (
          <TouchableOpacity
            onPress={onSettingsPress}
            style={styles.iconBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="settings-outline" size={22} color={Colors.text.secondary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection:     'row',
    alignItems:        'flex-end',
    justifyContent:    'space-between',
    paddingHorizontal: Theme.spacing.xl,
    paddingBottom:     Theme.spacing.base,
    backgroundColor:   Colors.bg.primary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.subtle,
  },
  left: {
    flex: 1,
  },
  greeting: {
    fontFamily: Theme.fonts.display,
    fontSize:   Theme.fontSizes.xl,
    color:      Colors.text.primary,
    letterSpacing: -0.3,
  },
  date: {
    fontFamily: Theme.fonts.bodyLight,
    fontSize:   Theme.fontSizes.sm,
    color:      Colors.text.muted,
    marginTop:  2,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  right: {
    marginLeft: Theme.spacing.base,
  },
  iconBtn: {
    width:           40,
    height:          40,
    borderRadius:    Theme.radius.full,
    backgroundColor: Colors.bg.tertiary,
    alignItems:      'center',
    justifyContent:  'center',
    borderWidth:     1,
    borderColor:     Colors.border.subtle,
  },
});

export default Header;
