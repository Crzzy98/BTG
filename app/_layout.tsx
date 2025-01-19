import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { AppState } from 'react-native'; // Add this import
import { useColorScheme } from '@/components/useColorScheme';
import CognitoAuth from '../view-models/CognitoAuth'; // Add this import

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index',
};

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

  // Add the auto-logout effect
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active' && CognitoAuth.loggedIn) {
        CognitoAuth.resetAutoLogoutTimer();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

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
        <Stack.Screen 
          name="index" 
          options={{ 
            headerShown: false,
            contentStyle: { backgroundColor: '#3b873e' },
          }} 
        />
        <Stack.Screen 
          name="ClubListView" 
          options={{ 
            title: 'Club List',
            contentStyle: { backgroundColor: '#f5f5f5' },
          }} 
        />
        <Stack.Screen 
          name="CreateClubView" 
          options={{ 
            title: 'Create Club',
            contentStyle: { backgroundColor: '#ffffff' },
          }} 
        />
        <Stack.Screen 
          name="ClubDetailedView" 
          options={{ 
            title: 'Club Details',
            contentStyle: { backgroundColor: '#ffffff' },
          }} 
        />
      </Stack>
    </ThemeProvider>
  );
}
