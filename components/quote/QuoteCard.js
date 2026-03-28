// ─── Momentum App — QuoteCard Component ──────────────────────────────────────
import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Colors } from '../../styles/colors';
import { Theme } from '../../styles/theme';
import { tagEmoji, formatAuthor, timeBasedGradient } from '../../features/quotes/quoteUtils';

/**
 * Large hero quote card for the home screen.
 */
const QuoteCard = ({
  quote,
  loading,
  isFavorite,
  onRefresh,
  onToggleFavorite,
  onShare,
}) => {
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.96)).current;
  const [gradients] = useState(timeBasedGradient());

  // Animate in whenever quote changes
  useEffect(() => {
    if (!quote) return;
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.96);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue:         1,
        duration:        500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue:         1,
        useNativeDriver: true,
        ...Theme.animation.spring,
      }),
    ]).start();
  }, [quote?.id]);

  const emoji = quote?.tags ? tagEmoji(quote.tags) : '💬';

  return (
    <Animated.View
      style={[
        styles.wrapper,
        { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
      ]}
    >
      <LinearGradient
        colors={['#1A1207', '#0D1117', '#161B22']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Decorative amber border-top accent */}
        <LinearGradient
          colors={[Colors.amber[400], Colors.amber[600], 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.accentBar}
        />

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator color={Colors.amber[400]} size="large" />
            <Text style={styles.loadingText}>Finding your moment…</Text>
          </View>
        ) : (
          <View style={styles.body}>
            {/* Emoji tag */}
            <Text style={styles.emoji}>{emoji}</Text>

            {/* Quote text */}
            <Text style={styles.quoteText}>
              {quote?.content ?? '…'}
            </Text>

            {/* Author */}
            <Text style={styles.author}>
              {formatAuthor(quote?.author)}
            </Text>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Actions */}
            <View style={styles.actions}>
              {/* Favorite */}
              <TouchableOpacity
                onPress={onToggleFavorite}
                style={styles.actionBtn}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons
                  name={isFavorite ? 'heart' : 'heart-outline'}
                  size={22}
                  color={isFavorite ? Colors.danger : Colors.text.muted}
                />
              </TouchableOpacity>

              {/* Share */}
              {onShare && (
                <TouchableOpacity
                  onPress={onShare}
                  style={styles.actionBtn}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="share-outline" size={22} color={Colors.text.muted} />
                </TouchableOpacity>
              )}

              {/* Refresh */}
              <TouchableOpacity
                onPress={() => onRefresh(true)}
                style={[styles.actionBtn, styles.refreshBtn]}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="refresh" size={18} color={Colors.text.inverse} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: Theme.radius.xl,
    overflow:     'hidden',
    borderWidth:  1,
    borderColor:  Colors.border.accent,
    ...Theme.shadows.amber,
  },
  gradient: {
    minHeight: 220,
  },
  accentBar: {
    height: 3,
    width:  '60%',
  },
  body: {
    padding: Theme.spacing.xl,
  },
  loaderContainer: {
    minHeight:      180,
    alignItems:     'center',
    justifyContent: 'center',
    gap:            Theme.spacing.sm,
  },
  loadingText: {
    fontFamily: Theme.fonts.bodyLight,
    fontSize:   Theme.fontSizes.sm,
    color:      Colors.text.muted,
    marginTop:  Theme.spacing.sm,
  },
  emoji: {
    fontSize:    28,
    marginBottom: Theme.spacing.sm,
  },
  quoteText: {
    fontFamily:    Theme.fonts.display,
    fontSize:      Theme.fontSizes['2xl'],
    color:         Colors.text.primary,
    lineHeight:    Theme.fontSizes['2xl'] * 1.4,
    letterSpacing: -0.3,
    marginBottom:  Theme.spacing.base,
  },
  author: {
    fontFamily:    Theme.fonts.bodyLight,
    fontSize:      Theme.fontSizes.sm,
    color:         Colors.amber[400],
    letterSpacing: 0.5,
    marginBottom:  Theme.spacing.base,
  },
  divider: {
    height:          1,
    backgroundColor: Colors.border.subtle,
    marginBottom:    Theme.spacing.md,
  },
  actions: {
    flexDirection:  'row',
    alignItems:     'center',
    gap:            Theme.spacing.sm,
  },
  actionBtn: {
    width:           38,
    height:          38,
    borderRadius:    Theme.radius.full,
    backgroundColor: Colors.bg.tertiary,
    alignItems:      'center',
    justifyContent:  'center',
    borderWidth:     1,
    borderColor:     Colors.border.subtle,
  },
  refreshBtn: {
    backgroundColor: Colors.amber[400],
    borderColor:     Colors.amber[500],
    marginLeft:      'auto',
  },
});

export default QuoteCard;
