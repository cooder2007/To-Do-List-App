// ─── Momentum App — Button Component ─────────────────────────────────────────
import React from 'react';
import {
  TouchableOpacity, Text, StyleSheet, ActivityIndicator, View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../styles/colors';
import { Theme } from '../../styles/theme';

/**
 * variant: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
 * size:    'sm' | 'md' | 'lg'
 */
const Button = ({
  title,
  onPress,
  variant  = 'primary',
  size     = 'md',
  loading  = false,
  disabled = false,
  icon     = null,       // optional left icon element
  iconRight= null,       // optional right icon element
  style,
  textStyle,
  fullWidth = false,
  haptic    = true,
}) => {
  const handlePress = () => {
    if (disabled || loading) return;
    if (haptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  const sizeStyles = {
    sm: { height: 36, paddingHorizontal: 14, radius: Theme.radius.sm },
    md: { height: 48, paddingHorizontal: 20, radius: Theme.radius.md },
    lg: { height: 56, paddingHorizontal: 28, radius: Theme.radius.lg },
  }[size];

  const textSizes = { sm: Theme.fontSizes.sm, md: Theme.fontSizes.base, lg: Theme.fontSizes.md };

  const isPrimary = variant === 'primary';

  const baseContainer = {
    height:         sizeStyles.height,
    paddingHorizontal: sizeStyles.paddingHorizontal,
    borderRadius:   sizeStyles.radius,
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'center',
    opacity:        disabled ? 0.5 : 1,
    alignSelf:      fullWidth ? 'stretch' : 'flex-start',
  };

  const variantStyles = {
    primary: {},
    secondary: {
      backgroundColor: Colors.bg.tertiary,
      borderWidth: 1,
      borderColor: Colors.border.accent,
    },
    ghost: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: Colors.border.default,
    },
    danger: {
      backgroundColor: Colors.danger,
    },
    success: {
      backgroundColor: Colors.success,
    },
  };

  const textColors = {
    primary:   Colors.text.inverse,
    secondary: Colors.text.accent,
    ghost:     Colors.text.secondary,
    danger:    '#fff',
    success:   '#fff',
  };

  const content = (
    <>
      {icon && <View style={{ marginRight: 8 }}>{icon}</View>}
      {loading
        ? <ActivityIndicator color={textColors[variant]} size="small" />
        : (
          <Text style={[
            styles.text,
            { fontSize: textSizes[size], color: textColors[variant] },
            textStyle,
          ]}>
            {title}
          </Text>
        )
      }
      {iconRight && !loading && <View style={{ marginLeft: 8 }}>{iconRight}</View>}
    </>
  );

  if (isPrimary) {
    return (
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.85}
        disabled={disabled || loading}
        style={[{ borderRadius: sizeStyles.radius, alignSelf: fullWidth ? 'stretch' : 'flex-start', opacity: disabled ? 0.5 : 1 }, style]}
      >
        <LinearGradient
          colors={Colors.gradients.amber}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[baseContainer, { borderRadius: sizeStyles.radius }]}
        >
          {content}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      disabled={disabled || loading}
      style={[baseContainer, variantStyles[variant], style]}
    >
      {content}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: Theme.fonts.body,
    letterSpacing: 0.3,
  },
});

export default Button;
