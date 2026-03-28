// ─── Momentum App — Theme Context ─────────────────────────────────────────────
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { Theme } from '../styles/theme';
import { Colors } from '../styles/colors';
import { loadData, saveData } from '../services/storage';
import { STORAGE_KEYS } from '../utils/constants';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const systemScheme = useColorScheme();
  const [mode, setMode] = useState('dark'); // 'dark' | 'light' | 'system'

  useEffect(() => {
    loadData(STORAGE_KEYS.THEME, 'dark').then(setMode);
  }, []);

  const activeScheme = mode === 'system' ? systemScheme : mode;
  // Currently only dark palette is implemented; extend Colors for light if needed.
  const theme = { ...Theme, activeScheme, isDark: activeScheme !== 'light' };

  const setThemeMode = async (newMode) => {
    setMode(newMode);
    await saveData(STORAGE_KEYS.THEME, newMode);
  };

  return (
    <ThemeContext.Provider value={{ theme, mode, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within <ThemeProvider>');
  return ctx;
};

export default ThemeContext;
