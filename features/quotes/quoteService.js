// ─── Momentum App — Quote Service ────────────────────────────────────────────
import { QUOTES_API_BASE, FALLBACK_QUOTES, QUOTE_CATEGORIES } from '../../utils/constants';
import { randomFrom } from '../../utils/helpers';

/**
 * Fetches a random quote from the quotable.io API.
 * Falls back to local quotes if the network fails.
 */
export const fetchRandomQuote = async (tags = []) => {
  try {
    const tagParam = tags.length > 0 ? `?tags=${tags.join('|')}` : '';
    const res = await fetch(`${QUOTES_API_BASE}/random${tagParam}`, {
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) throw new Error(`API error: ${res.status}`);

    const data = await res.json();
    return {
      quote: {
        id:      data._id,
        content: data.content,
        author:  data.author,
        tags:    data.tags ?? [],
        source:  'api',
      },
      error: null,
    };
  } catch (error) {
    console.warn('[QuoteService] Falling back to local quotes:', error.message);
    const fallback = randomFrom(FALLBACK_QUOTES);
    return {
      quote: {
        id:      fallback._id,
        content: fallback.content,
        author:  fallback.author,
        tags:    fallback.tags,
        source:  'fallback',
      },
      error: null,
    };
  }
};

/**
 * Fetches multiple quotes (for a quote collection / history).
 */
export const fetchQuotes = async ({ limit = 5, tags = [] } = {}) => {
  try {
    const tagParam = tags.length > 0 ? `&tags=${tags.join('|')}` : '';
    const res = await fetch(
      `${QUOTES_API_BASE}/quotes?limit=${limit}${tagParam}`,
      { signal: AbortSignal.timeout(6000) }
    );

    if (!res.ok) throw new Error(`API error: ${res.status}`);

    const data = await res.json();
    const quotes = data.results.map((q) => ({
      id:      q._id,
      content: q.content,
      author:  q.author,
      tags:    q.tags ?? [],
      source:  'api',
    }));

    return { quotes, error: null };
  } catch (error) {
    // Return shuffled fallbacks
    const shuffled = [...FALLBACK_QUOTES].sort(() => Math.random() - 0.5);
    const quotes = shuffled.slice(0, limit).map((q) => ({
      id:      q._id,
      content: q.content,
      author:  q.author,
      tags:    q.tags,
      source:  'fallback',
    }));
    return { quotes, error: null };
  }
};

/**
 * Returns a list of available tag categories.
 */
export const getQuoteCategories = () => QUOTE_CATEGORIES;
