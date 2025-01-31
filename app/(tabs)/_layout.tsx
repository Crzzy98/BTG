import { Tabs } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FFF',
        tabBarInactiveTintColor: '#FFF',
        tabBarStyle: { backgroundColor: '#1F8E3A' },
        headerShown: false
      }}
    >
      <Tabs.Screen
        name="clubs"
        options={{
          title: "Clubs",
          tabBarIcon: ({ size }) => (
            <Icon name="people" size={size} color="#FFF" />
          ),
        }}
      />
      <Tabs.Screen
        name="playerView"
        options={{
          title: "My Data",
          tabBarIcon: ({ size }) => (
            <Icon name="person-circle" size={size} color="#FFF" />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ size }) => (
            <Icon name="settings" size={size} color="#FFF" />
          ),
        }}
      />
    </Tabs>
  );
}
