// ─── Momentum App — Card Component ────────────────────────────────────────────
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../styles/colors';
import { Theme } from '../../styles/theme';

/**
 * Reusable card surface.
 * variant: 'default' | 'elevated' | 'accent' | 'flat'
 */
const Card = ({
  children,
  variant   = 'default',
  onPress,
  style,
  padding   = Theme.spacing.base,
  radius    = Theme.radius.lg,
  ...props
}) => {
  const variantStyle = {
    default: {
      backgroundColor: Colors.bg.secondary,
      borderWidth: 1,
      borderColor: Colors.border.subtle,
      ...Theme.shadows.md,
    },
    elevated: {
      backgroundColor: Colors.bg.tertiary,
      borderWidth: 1,
      borderColor: Colors.border.default,
      ...Theme.shadows.lg,
    },
    accent: {
      backgroundColor: Colors.bg.secondary,
      borderWidth: 1,
      borderColor: Colors.border.accent,
      ...Theme.shadows.amber,
    },
    flat: {
      backgroundColor: Colors.bg.secondary,
      borderWidth: 0,
    },
  }[variant] ?? {};

  const containerStyle = [
    styles.base,
    variantStyle,
    { padding, borderRadius: radius },
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.82}
        style={containerStyle}
        {...props}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={containerStyle} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
});

export default Card;
