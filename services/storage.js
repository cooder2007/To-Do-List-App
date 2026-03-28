// ─── Momentum App — AsyncStorage Service ─────────────────────────────────────
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Saves a JSON-serializable value under `key`.
 */
export const saveData = async (key, value) => {
  try {
    const json = JSON.stringify(value);
    await AsyncStorage.setItem(key, json);
    return true;
  } catch (error) {
    console.error(`[Storage] saveData(${key}) failed:`, error);
    return false;
  }
};

/**
 * Loads and JSON-parses the value stored at `key`.
 * Returns `defaultValue` if the key doesn't exist or parsing fails.
 */
export const loadData = async (key, defaultValue = null) => {
  try {
    const json = await AsyncStorage.getItem(key);
    if (json === null) return defaultValue;
    return JSON.parse(json);
  } catch (error) {
    console.error(`[Storage] loadData(${key}) failed:`, error);
    return defaultValue;
  }
};

/**
 * Removes the value stored at `key`.
 */
export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`[Storage] removeData(${key}) failed:`, error);
    return false;
  }
};

/**
 * Merges `updates` into the existing JSON object at `key`.
 */
export const mergeData = async (key, updates) => {
  try {
    const existing = await loadData(key, {});
    const merged = { ...existing, ...updates };
    await saveData(key, merged);
    return merged;
  } catch (error) {
    console.error(`[Storage] mergeData(${key}) failed:`, error);
    return null;
  }
};

/**
 * Clears all keys used by Momentum (prefix "@momentum/").
 */
export const clearAllMomentumData = async () => {
  try {
    const allKeys = await AsyncStorage.getAllKeys();
    const momentumKeys = allKeys.filter((k) => k.startsWith('@momentum/'));
    await AsyncStorage.multiRemove(momentumKeys);
    return true;
  } catch (error) {
    console.error('[Storage] clearAllMomentumData failed:', error);
    return false;
  }
};

/**
 * Returns all keys currently stored by Momentum.
 */
export const listKeys = async () => {
  try {
    const allKeys = await AsyncStorage.getAllKeys();
    return allKeys.filter((k) => k.startsWith('@momentum/'));
  } catch {
    return [];
  }
};
