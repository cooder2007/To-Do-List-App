// ─── Momentum App — Quote Utility Functions ───────────────────────────────────

/**
 * Returns an emoji that matches a quote's first tag.
 */
export const tagEmoji = (tags = []) => {
  const map = {
    motivational:  '🔥',
    success:       '🏆',
    wisdom:        '🦉',
    leadership:    '🌟',
    courage:       '⚡',
    happiness:     '☀️',
    life:          '🌿',
    inspirational: '✨',
  };
  return map[tags[0]] ?? '💬';
};

/**
 * Splits a long quote into segments for animated display.
 */
export const segmentQuote = (content, maxChars = 80) => {
  if (!content || content.length <= maxChars) return [content];

  const words = content.split(' ');
  const segments = [];
  let current = '';

  for (const word of words) {
    if ((current + ' ' + word).trim().length > maxChars) {
      segments.push(current.trim());
      current = word;
    } else {
      current = current ? `${current} ${word}` : word;
    }
  }
  if (current) segments.push(current.trim());
  return segments;
};

/**
 * Estimates reading time (seconds) for a quote.
 */
export const readingTimeSeconds = (content = '') => {
  const words = content.trim().split(/\s+/).length;
  return Math.max(3, Math.ceil(words / 2.5)); // ~150 wpm
};

/**
 * Returns a soft background gradient suggestion based on the hour of day.
 */
export const timeBasedGradient = () => {
  const h = new Date().getHours();
  if (h < 6)  return ['#0D1117', '#161B22'];        // Night  — deep navy
  if (h < 10) return ['#1A1207', '#2D1F0E'];        // Dawn   — dark amber
  if (h < 17) return ['#0D1117', '#1C2333'];        // Day    — default
  if (h < 20) return ['#1A1207', '#0D1117'];        // Dusk   — amber-night
  return ['#0D1117', '#0A0D14'];                    // Night  — near black
};

/**
 * Formats author attribution for display.
 */
export const formatAuthor = (author) => (author ? `— ${author}` : '');

/**
 * Returns true if a quote is in the favorites list.
 */
export const isFavorite = (quoteId, favorites = []) =>
  favorites.some((q) => q.id === quoteId);
