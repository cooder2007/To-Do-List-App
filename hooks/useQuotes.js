// ─── Momentum App — useQuotes Hook ────────────────────────────────────────────
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  loadQuote,
  addToFavorites,
  removeFavorite,
  loadFavorites,
  setRefreshInterval,
  setSelectedTags,
  selectCurrentQuote,
  selectQuoteLoading,
  selectQuoteError,
  selectFavorites,
  selectRefreshInterval,
  selectSelectedTags,
} from '../features/quotes/quoteSlice';
import { isFavorite } from '../features/quotes/quoteUtils';

export const useQuotes = () => {
  const dispatch = useDispatch();

  const current         = useSelector(selectCurrentQuote);
  const loading         = useSelector(selectQuoteLoading);
  const error           = useSelector(selectQuoteError);
  const favorites       = useSelector(selectFavorites);
  const refreshInterval = useSelector(selectRefreshInterval);
  const selectedTags    = useSelector(selectSelectedTags);

  // Load favorites once on mount
  useEffect(() => {
    dispatch(loadFavorites());
  }, [dispatch]);

  const refresh = useCallback(
    (force = false) => dispatch(loadQuote({ forceRefresh: force, tags: selectedTags })),
    [dispatch, selectedTags]
  );

  const favorite = useCallback(
    () => current && dispatch(addToFavorites(current)),
    [dispatch, current]
  );

  const unfavorite = useCallback(
    (id) => dispatch(removeFavorite(id ?? current?.id)),
    [dispatch, current]
  );

  const toggleFavorite = useCallback(() => {
    if (!current) return;
    if (isFavorite(current.id, favorites)) {
      dispatch(removeFavorite(current.id));
    } else {
      dispatch(addToFavorites(current));
    }
  }, [dispatch, current, favorites]);

  const changeInterval = useCallback(
    (hours) => dispatch(setRefreshInterval(hours)),
    [dispatch]
  );

  const changeTags = useCallback(
    (tags) => dispatch(setSelectedTags(tags)),
    [dispatch]
  );

  const isCurrentFavorite = current ? isFavorite(current.id, favorites) : false;

  return {
    current,
    loading,
    error,
    favorites,
    refreshInterval,
    selectedTags,
    isCurrentFavorite,
    refresh,
    favorite,
    unfavorite,
    toggleFavorite,
    changeInterval,
    changeTags,
  };
};

export default useQuotes;
