import { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useHydration } from '@/hooks/useHydration';
import { useNotificationRoot } from '@/hooks/useNotifications';
import { useAppStore } from '@/store/useAppStore';
import { Colors } from '@/constants/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const isHydrated = useHydration();
  const { settings } = useAppStore();

  // Mount notification scheduler + tap listener once at the root
  useNotificationRoot();

  // Hide the native splash as soon as JS is ready so our loading
  // screen is visible while the store hydrates.
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  if (!isHydrated) {
    return (
      <View style={loadingStyles.screen}>
        <Image
          source={require('@/assets/logo-dark.png')}
          style={loadingStyles.logo}
          resizeMode="contain"
        />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="onboarding/index" options={{ animation: 'fade' }} />
        <Stack.Screen
          name="prompt"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
      </Stack>
    </>
  );
}

const loadingStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 280,
    height: 84,
  },
});
