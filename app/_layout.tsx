import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* Define the screens here */}
        <Stack.Screen 
          name="index" 
          options={{ 
            headerShown: false,
            contentStyle: { backgroundColor: '#3b873e' },
          }} 
        />
        <Stack.Screen 
          name="clubListView" 
          options={{ 
            title: 'Club List',
            contentStyle: { backgroundColor: '#f5f5f5' },
          }} 
        />
        <Stack.Screen 
          name="createClubView" 
          options={{ 
            title: 'Create Club',
            contentStyle: { backgroundColor: '#ffffff' },
          }} 
        />
        <Stack.Screen 
          name="clubDetailedView" 
          options={{ 
            title: 'Club Details',
            contentStyle: { backgroundColor: '#ffffff' },
          }} 
        />
      </Stack>
    </ThemeProvider>
  );
}
