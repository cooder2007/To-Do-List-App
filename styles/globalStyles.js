// ─── Momentum App — Global StyleSheet ────────────────────────────────────────
import { StyleSheet, Platform } from 'react-native';
import { Colors } from './colors';
import { Theme } from './theme';

export const globalStyles = StyleSheet.create({
  // ── Layouts ──────────────────────────────────────────────────────────────────
  flex1: { flex: 1 },
  flexRow: { flexDirection: 'row' },
  flexCol: { flexDirection: 'column' },
  flexCenter: { alignItems: 'center', justifyContent: 'center' },
  flexBetween: { alignItems: 'center', justifyContent: 'space-between' },
  flexStart: { alignItems: 'flex-start' },
  flexEnd: { alignItems: 'flex-end' },

  // ── Screen ───────────────────────────────────────────────────────────────────
  screen: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
  },
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
  },

  // ── Cards ────────────────────────────────────────────────────────────────────
  card: {
    backgroundColor: Colors.bg.secondary,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.base,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
    ...Theme.shadows.md,
  },
  cardElevated: {
    backgroundColor: Colors.bg.tertiary,
    borderRadius: Theme.radius.xl,
    padding: Theme.spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border.default,
    ...Theme.shadows.lg,
  },

  // ── Typography ───────────────────────────────────────────────────────────────
  displayText: {
    fontFamily: Theme.fonts.display,
    fontSize: Theme.fontSizes['3xl'],
    color: Colors.text.primary,
    lineHeight: Theme.fontSizes['3xl'] * Theme.lineHeights.tight,
  },
  headingText: {
    fontFamily: Theme.fonts.heading,
    fontSize: Theme.fontSizes.xl,
    color: Colors.text.primary,
  },
  bodyText: {
    fontFamily: Theme.fonts.body,
    fontSize: Theme.fontSizes.base,
    color: Colors.text.secondary,
    lineHeight: Theme.fontSizes.base * Theme.lineHeights.normal,
  },
  captionText: {
    fontFamily: Theme.fonts.bodyLight,
    fontSize: Theme.fontSizes.xs,
    color: Colors.text.muted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  accentText: {
    fontFamily: Theme.fonts.body,
    color: Colors.text.accent,
  },

  // ── Separators ───────────────────────────────────────────────────────────────
  divider: {
    height: 1,
    backgroundColor: Colors.border.subtle,
    marginVertical: Theme.spacing.base,
  },
  dividerAccent: {
    height: 1,
    backgroundColor: Colors.border.accent,
    marginVertical: Theme.spacing.md,
  },

  // ── Input ────────────────────────────────────────────────────────────────────
  input: {
    backgroundColor: Colors.bg.tertiary,
    borderRadius: Theme.radius.md,
    borderWidth: 1,
    borderColor: Colors.border.default,
    color: Colors.text.primary,
    fontFamily: Theme.fonts.body,
    fontSize: Theme.fontSizes.base,
    paddingHorizontal: Theme.spacing.base,
    paddingVertical: Theme.spacing.md,
  },
  inputFocused: {
    borderColor: Colors.amber[400],
  },

  // ── Pill / Badge ─────────────────────────────────────────────────────────────
  pill: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.radius.full,
    alignSelf: 'flex-start',
  },
  pillText: {
    fontFamily: Theme.fonts.bodyLight,
    fontSize: Theme.fontSizes.xs,
    letterSpacing: 0.5,
  },

  // ── Utility ──────────────────────────────────────────────────────────────────
  p: (val) => ({ padding: val }),
  px: (val) => ({ paddingHorizontal: val }),
  py: (val) => ({ paddingVertical: val }),
  m: (val) => ({ margin: val }),
  mx: (val) => ({ marginHorizontal: val }),
  my: (val) => ({ marginVertical: val }),
  mt: (val) => ({ marginTop: val }),
  mb: (val) => ({ marginBottom: val }),

  // ── Platform ─────────────────────────────────────────────────────────────────
  shadow: Platform.select({
    ios: Theme.shadows.md,
    android: { elevation: 6 },
  }),
});

export default globalStyles;
