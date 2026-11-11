import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { AssetsProvider } from '../context/Assets';
import { ThemeProvider, useTheme } from '../context/Theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [loaded, error] = useFonts({
    KindSans: require('../../assets/fonts/KindSans.otf'),
    OriginTech: require('../../assets/fonts/OriginTech.otf'),
  });

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync().catch(() => {});
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return <ThemeProvider><AssetsProvider><AppStack /></AssetsProvider></ThemeProvider>;
}

function AppStack() {
  const { colors, mode } = useTheme();
  return <><StatusBar style={mode === 'dark' ? 'light' : 'dark'} /><Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
    <Stack.Screen name="(tabs)" /><Stack.Screen name="series/[id]" /><Stack.Screen name="play" options={{ animation: 'fade' }} />
  </Stack></>;
}
