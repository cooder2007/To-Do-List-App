// ─── Momentum App — Design Tokens / Theme ────────────────────────────────────
import { Colors } from './colors';

export const Theme = {
  // ── Typography ───────────────────────────────────────────────────────────────
  fonts: {
    display:  'Playfair-Bold',      // Serif — quotes, headings
    heading:  'Playfair-Regular',   // Serif — sub-headings
    body:     'DMSans-Medium',      // Sans — body text
    bodyLight:'DMSans-Regular',     // Sans — labels, captions
  },

  fontSizes: {
    xs:   10,
    sm:   12,
    base: 14,
    md:   16,
    lg:   18,
    xl:   22,
    '2xl': 26,
    '3xl': 32,
    '4xl': 40,
    '5xl': 52,
  },

  lineHeights: {
    tight:   1.2,
    normal:  1.5,
    relaxed: 1.75,
  },

  // ── Spacing ──────────────────────────────────────────────────────────────────
  spacing: {
    xs:   4,
    sm:   8,
    md:   12,
    base: 16,
    lg:   20,
    xl:   24,
    '2xl': 32,
    '3xl': 40,
    '4xl': 56,
    '5xl': 72,
  },

  // ── Border Radius ────────────────────────────────────────────────────────────
  radius: {
    sm:   6,
    md:   10,
    lg:   16,
    xl:   24,
    '2xl':32,
    full: 999,
  },

  // ── Shadows ──────────────────────────────────────────────────────────────────
  shadows: {
    sm: {
      shadowColor: Colors.shadow.dark,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3,
    },
    md: {
      shadowColor: Colors.shadow.dark,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 6,
    },
    lg: {
      shadowColor: Colors.shadow.dark,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.5,
      shadowRadius: 16,
      elevation: 12,
    },
    amber: {
      shadowColor: Colors.shadow.amber,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.5,
      shadowRadius: 12,
      elevation: 8,
    },
  },

  // ── Animation Durations ──────────────────────────────────────────────────────
  animation: {
    fast:   150,
    normal: 250,
    slow:   400,
    spring: { damping: 14, stiffness: 150 },
  },

  // ── Colors shortcut ──────────────────────────────────────────────────────────
  colors: Colors,
};

export default Theme;
