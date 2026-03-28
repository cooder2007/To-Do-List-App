// ─── Momentum App — Modal Component ───────────────────────────────────────────
import React, { useEffect, useRef } from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../styles/colors';
import { Theme } from '../../styles/theme';

const { height: SCREEN_H } = Dimensions.get('window');

/**
 * Modal wrapper with slide-up animation.
 * position: 'bottom' | 'center'
 */
const Modal = ({
  visible,
  onClose,
  title,
  children,
  position    = 'bottom',
  showClose   = true,
  scrollable  = true,
  maxHeight   = SCREEN_H * 0.88,
  style,
}) => {
  const slideAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          ...Theme.animation.spring,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: Theme.animation.normal,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 300,
          duration: Theme.animation.normal,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: Theme.animation.fast,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const sheetStyle = position === 'bottom'
    ? styles.bottomSheet
    : styles.centerSheet;

  const ContentWrapper = scrollable ? ScrollView : View;
  const contentProps   = scrollable
    ? { keyboardShouldPersistTaps: 'handled', showsVerticalScrollIndicator: false }
    : {};

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} activeOpacity={1} />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={position === 'bottom' ? styles.bottomContainer : styles.centerContainer}
        >
          <Animated.View
            style={[
              styles.sheet,
              sheetStyle,
              { transform: [{ translateY: slideAnim }], maxHeight },
              style,
            ]}
          >
            {/* Handle bar */}
            {position === 'bottom' && <View style={styles.handle} />}

            {/* Header */}
            {(title || showClose) && (
              <View style={styles.header}>
                {title && <Text style={styles.title}>{title}</Text>}
                {showClose && (
                  <TouchableOpacity onPress={onClose} style={styles.closeBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Ionicons name="close" size={22} color={Colors.text.secondary} />
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Divider */}
            {title && <View style={styles.divider} />}

            {/* Content */}
            <ContentWrapper style={styles.content} {...contentProps}>
              {children}
            </ContentWrapper>
          </Animated.View>
        </KeyboardAvoidingView>
      </Animated.View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Theme.spacing.base,
  },
  sheet: {
    backgroundColor: Colors.bg.secondary,
    borderWidth: 1,
    borderColor: Colors.border.default,
    ...Theme.shadows.lg,
  },
  bottomSheet: {
    borderTopLeftRadius:  Theme.radius['2xl'],
    borderTopRightRadius: Theme.radius['2xl'],
    borderBottomLeftRadius:  0,
    borderBottomRightRadius: 0,
    paddingBottom: Platform.OS === 'ios' ? 34 : Theme.spacing.xl,
  },
  centerSheet: {
    borderRadius: Theme.radius.xl,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border.strong,
    borderRadius: Theme.radius.full,
    alignSelf: 'center',
    marginTop: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
  },
  header: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    paddingHorizontal: Theme.spacing.xl,
    paddingTop: Theme.spacing.md,
    paddingBottom: Theme.spacing.sm,
  },
  title: {
    fontFamily: Theme.fonts.heading,
    fontSize:   Theme.fontSizes.lg,
    color:      Colors.text.primary,
    flex: 1,
  },
  closeBtn: {
    padding: 4,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border.subtle,
    marginHorizontal: Theme.spacing.xl,
  },
  content: {
    paddingHorizontal: Theme.spacing.xl,
    paddingTop:        Theme.spacing.base,
  },
});

export default Modal;
