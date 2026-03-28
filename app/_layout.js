// ─── Momentum App — Root Layout ───────────────────────────────────────────────
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { Provider as ReduxProvider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { store }         from '../store';
import { AppProvider }   from '../context/AppContext';
import { ThemeProvider } from '../context/ThemeContext';
import { Colors }        from '../styles/colors';

// Keep the splash screen visible until fonts are loaded
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Playfair-Regular': require('../assets/fonts/PlayfairDisplay-Regular.ttf'),
    'Playfair-Bold':    require('../assets/fonts/PlayfairDisplay-Bold.ttf'),
    'DMSans-Regular':   require('../assets/fonts/DMSans-Regular.ttf'),
    'DMSans-Medium':    require('../assets/fonts/DMSans-Medium.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={styles.root}>
      <ReduxProvider store={store}>
        <SafeAreaProvider>
          <ThemeProvider>
            <AppProvider>
              <StatusBar style="light" backgroundColor={Colors.bg.primary} />
              <Stack
                screenOptions={{
                  headerShown:        false,
                  contentStyle:       { backgroundColor: Colors.bg.primary },
                  animation:          'slide_from_right',
                  gestureEnabled:     true,
                }}
              >
                <Stack.Screen name="index"    options={{ animation: 'none' }} />
                <Stack.Screen name="settings" options={{ animation: 'slide_from_right' }} />
              </Stack>
            </AppProvider>
          </ThemeProvider>
        </SafeAreaProvider>
      </ReduxProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.bg.primary,
  },
});
