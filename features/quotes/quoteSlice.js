// ─── Momentum App — Quote Redux Slice ────────────────────────────────────────
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchRandomQuote, fetchQuotes } from './quoteService';
import { saveData, loadData } from '../../services/storage';
import { STORAGE_KEYS, FALLBACK_QUOTES } from '../../utils/constants';
import { hoursSince, randomFrom } from '../../utils/helpers';

// ── Async Thunks ──────────────────────────────────────────────────────────────

export const loadQuote = createAsyncThunk(
  'quotes/load',
  async ({ forceRefresh = false, tags = [] } = {}, { getState }) => {
    const { refreshInterval } = getState().quotes;

    // Check cache freshness
    const lastFetched = await loadData(STORAGE_KEYS.QUOTE_LAST_AT, null);
    const cached      = await loadData(STORAGE_KEYS.QUOTE_CACHE, null);

    const stale = !lastFetched || hoursSince(lastFetched) >= refreshInterval;

    if (!forceRefresh && cached && !stale) {
      return { quote: cached, fromCache: true };
    }

    const { quote, error } = await fetchRandomQuote(tags);
    if (error) throw new Error(error);

    // Persist to cache
    await saveData(STORAGE_KEYS.QUOTE_CACHE, quote);
    await saveData(STORAGE_KEYS.QUOTE_LAST_AT, new Date().toISOString());

    return { quote, fromCache: false };
  }
);

export const addToFavorites = createAsyncThunk(
  'quotes/addFavorite',
  async (quote, { getState }) => {
    const { favorites } = getState().quotes;
    const already = favorites.some((q) => q.id === quote.id);
    if (already) return null;

    const updated = [quote, ...favorites];
    await saveData(`${STORAGE_KEYS.QUOTE_CACHE}_favorites`, updated);
    return quote;
  }
);

export const removeFavorite = createAsyncThunk(
  'quotes/removeFavorite',
  async (quoteId, { getState }) => {
    const { favorites } = getState().quotes;
    const updated = favorites.filter((q) => q.id !== quoteId);
    await saveData(`${STORAGE_KEYS.QUOTE_CACHE}_favorites`, updated);
    return quoteId;
  }
);

export const loadFavorites = createAsyncThunk(
  'quotes/loadFavorites',
  async () => {
    const favorites = await loadData(`${STORAGE_KEYS.QUOTE_CACHE}_favorites`, []);
    return favorites;
  }
);

// ── Slice ─────────────────────────────────────────────────────────────────────

const initialState = {
  current:         null,       // { id, content, author, tags, source }
  favorites:       [],
  loading:         false,
  fromCache:       false,
  error:           null,
  refreshInterval: 24,         // hours — 24 = daily
  selectedTags:    [],
  lastRefreshed:   null,
};

const quoteSlice = createSlice({
  name: 'quotes',
  initialState,
  reducers: {
    setRefreshInterval(state, action) {
      state.refreshInterval = action.payload; // hours
    },
    setSelectedTags(state, action) {
      state.selectedTags = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // loadQuote
      .addCase(loadQuote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadQuote.fulfilled, (state, action) => {
        state.loading      = false;
        state.current      = action.payload.quote;
        state.fromCache    = action.payload.fromCache;
        state.lastRefreshed = new Date().toISOString();
      })
      .addCase(loadQuote.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.error.message;
        // Show fallback
        if (!state.current) {
          const fb = randomFrom(FALLBACK_QUOTES);
          state.current = { id: fb._id, content: fb.content, author: fb.author, tags: fb.tags };
        }
      })

      // favorites
      .addCase(addToFavorites.fulfilled, (state, action) => {
        if (action.payload) state.favorites.unshift(action.payload);
      })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.favorites = state.favorites.filter((q) => q.id !== action.payload);
      })
      .addCase(loadFavorites.fulfilled, (state, action) => {
        state.favorites = action.payload;
      });
  },
});

export const { setRefreshInterval, setSelectedTags, clearError } = quoteSlice.actions;

// ── Selectors ─────────────────────────────────────────────────────────────────
export const selectCurrentQuote    = (s) => s.quotes.current;
export const selectQuoteLoading    = (s) => s.quotes.loading;
export const selectQuoteError      = (s) => s.quotes.error;
export const selectFavorites       = (s) => s.quotes.favorites;
export const selectRefreshInterval = (s) => s.quotes.refreshInterval;
export const selectSelectedTags    = (s) => s.quotes.selectedTags;

export default quoteSlice.reducer;
