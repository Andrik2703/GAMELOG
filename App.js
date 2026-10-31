import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { MusicProvider } from './src/context/MusicContext';
import { SessionProvider } from './src/context/SessionContext'; // <-- NUEVO

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [loaded, error] = useFonts({
    'Inter-Regular': require('./src/assets/fonts/Inter-Regular.ttf'),
    'Inter-Bold': require('./src/assets/fonts/Inter-Bold.ttf'),
    'Inter-Black': require('./src/assets/fonts/Inter-Black.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <MusicProvider>
          {/* ENVOLVEMOS CON SESSION PROVIDER */}
          <SessionProvider>
            <StatusBar style="dark" />
            <AppNavigator />
          </SessionProvider>
        </MusicProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}