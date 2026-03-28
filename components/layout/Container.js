// ─── Momentum App — Container Component ──────────────────────────────────────
import React from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../styles/colors';
import { Theme } from '../../styles/theme';

/**
 * Full-screen layout wrapper.
 * scrollable: wraps children in a ScrollView with pull-to-refresh.
 */
const Container = ({
  children,
  scrollable    = false,
  refreshing    = false,
  onRefresh,
  style,
  contentStyle,
  edges         = ['left', 'right', 'bottom'],
  paddingH      = Theme.spacing.xl,
}) => {
  if (scrollable) {
    return (
      <SafeAreaView style={[styles.safe, style]} edges={edges}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingHorizontal: paddingH },
            contentStyle,
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            onRefresh ? (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={Colors.amber[400]}
                colors={[Colors.amber[400]]}
              />
            ) : undefined
          }
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, style]} edges={edges}>
      <View style={[styles.inner, { paddingHorizontal: paddingH }, contentStyle]}>
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop:    Theme.spacing.base,
    paddingBottom: Theme.spacing['4xl'],
    flexGrow: 1,
  },
  inner: {
    flex: 1,
    paddingTop: Theme.spacing.base,
  },
});

export default Container;
