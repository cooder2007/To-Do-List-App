// ─── Momentum App — Color Palette ─────────────────────────────────────────────
// Aesthetic: Executive Journal — deep navy, warm amber, cream accents

export const Colors = {
  // ── Backgrounds ──────────────────────────────────────────────────────────────
  bg: {
    primary:   '#0D1117',   // Deep charcoal-navy
    secondary: '#161B22',   // Card surface
    tertiary:  '#1C2333',   // Elevated card
    overlay:   'rgba(13, 17, 23, 0.92)',
    glass:     'rgba(22, 27, 34, 0.75)',
  },

  // ── Brand / Accent ───────────────────────────────────────────────────────────
  amber: {
    100: '#FFF8E7',
    200: '#FFE9A0',
    300: '#FFCC5C',
    400: '#F5A623',   // Primary accent
    500: '#D4881A',
    600: '#A86410',
  },

  // ── Text ─────────────────────────────────────────────────────────────────────
  text: {
    primary:   '#F0E6D3',   // Warm cream
    secondary: '#9CA3AF',   // Muted grey
    muted:     '#4B5563',
    inverse:   '#0D1117',
    accent:    '#F5A623',
  },

  // ── Semantic ─────────────────────────────────────────────────────────────────
  success:  '#34D399',
  danger:   '#F87171',
  warning:  '#FBBF24',
  info:     '#60A5FA',

  // ── Priority ──────────────────────────────────────────────────────────────────
  priority: {
    high:   '#F87171',
    medium: '#FBBF24',
    low:    '#34D399',
    none:   '#6B7280',
  },

  // ── Task States ──────────────────────────────────────────────────────────────
  task: {
    complete:   '#34D399',
    incomplete: '#4B5563',
    overdue:    '#F87171',
  },

  // ── Border & Divider ─────────────────────────────────────────────────────────
  border: {
    subtle:  'rgba(240, 230, 211, 0.06)',
    default: 'rgba(240, 230, 211, 0.12)',
    strong:  'rgba(240, 230, 211, 0.24)',
    accent:  'rgba(245, 166, 35, 0.35)',
  },

  // ── Shadow ───────────────────────────────────────────────────────────────────
  shadow: {
    amber: 'rgba(245, 166, 35, 0.25)',
    dark:  'rgba(0, 0, 0, 0.6)',
  },

  // ── Gradients (use with LinearGradient) ──────────────────────────────────────
  gradients: {
    amber:   ['#F5A623', '#D4881A'],
    night:   ['#0D1117', '#1C2333'],
    card:    ['#161B22', '#1C2333'],
    success: ['#34D399', '#059669'],
  },
};

export default Colors;
