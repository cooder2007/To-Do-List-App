// ─── Momentum App — QuoteWidget (compact inline widget) ──────────────────────
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../styles/colors';
import { Theme } from '../../styles/theme';
import { tagEmoji, formatAuthor } from '../../features/quotes/quoteUtils';
import { truncate } from '../../utils/helpers';

/**
 * Compact quote widget — used in notification previews, desktop sidebar,
 * and home screen mini-card mode.
 *
 * size: 'sm' | 'md'
 */
const QuoteWidget = ({
  quote,
  size        = 'md',
  onPress,
  onRefresh,
  showActions = true,
}) => {
  if (!quote) return null;

  const maxChars = size === 'sm' ? 90 : 160;
  const emoji    = tagEmoji(quote.tags);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.8 : 1}
      style={styles.wrapper}
    >
      <LinearGradient
        colors={['#1E1508', '#161B22']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Accent left bar */}
        <View style={styles.accentBar} />

        <View style={styles.body}>
          <View style={styles.topRow}>
            <Text style={styles.emoji}>{emoji}</Text>
            {showActions && onRefresh && (
              <TouchableOpacity
                onPress={onRefresh}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="refresh-outline" size={16} color={Colors.text.muted} />
              </TouchableOpacity>
            )}
          </View>

          <Text style={[styles.quoteText, size === 'sm' && styles.quoteTextSm]}>
            {truncate(quote.content, maxChars)}
          </Text>

          <Text style={styles.author}>{formatAuthor(quote.author)}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: Theme.radius.lg,
    overflow:     'hidden',
    borderWidth:  1,
    borderColor:  Colors.border.accent,
  },
  gradient: {
    flexDirection: 'row',
  },
  accentBar: {
    width:           3,
    backgroundColor: Colors.amber[400],
  },
  body: {
    flex:    1,
    padding: Theme.spacing.md,
    gap:     Theme.spacing.xs,
  },
  topRow: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    marginBottom:   Theme.spacing.xs,
  },
  emoji: {
    fontSize: 16,
  },
  quoteText: {
    fontFamily:    Theme.fonts.heading,
    fontSize:      Theme.fontSizes.base,
    color:         Colors.text.primary,
    lineHeight:    Theme.fontSizes.base * 1.5,
    letterSpacing: -0.1,
  },
  quoteTextSm: {
    fontSize:   Theme.fontSizes.sm,
    lineHeight: Theme.fontSizes.sm * 1.5,
  },
  author: {
    fontFamily: Theme.fonts.bodyLight,
    fontSize:   Theme.fontSizes.xs,
    color:      Colors.amber[400],
    marginTop:  Theme.spacing.xs,
  },
});

export default QuoteWidget;
