import React, { useEffect, useState } from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import ClubListView from './Club/ClubListView';
import DetailedPlayerView from './Player/DetailedPlayerView';
import SettingsView from './SettingsView'; // Mock SettingsView
import { Player, Club } from '../../store/types'
const Tab = createBottomTabNavigator();

const MainNavigationView = () => {
    const [paywallShown, setPaywallShown] = useState(false);
    const [isPro, setIsPro] = useState(false);
    const [updateAvailable, setUpdateAvailable] = useState(false);
    const [error, setError] = useState(null);
    const [selectedPage, setSelectedPage] = useState(0);
    const [player, setPlayer] = useState<Player | null>(null);
    const [club, setClub] = useState<Club | null>(null);
    const [showEditDetails, setShowEditDetails] = useState(false);

    useEffect(() => {
        // Simulate fetching player data
        const fetchPlayer = async () => {
            const mockPlayer = {
                id: '12345',
                name: 'Mock',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                fullName: 'Doe',
                getWeight: (club: Club): number => {
                    // Implement your weight calculation logic here
                    return club.birdieWeight || 1.0; // Return a number
                }

            };
            const mockClub: Club = {
                id: 'club123',
                name: 'Golden Gate Golf Club',
                passcode: '1234',
                superAdmin: '12345', // matches mock player ID
                players: [], // This will be populated with player data
                admins: ['12345'], // Array of admin user IDs
                birdieWeight: 1.5,
                clubLimit: 100,
                password: 'clubpass123' // In real app, this should be handled securely
            };
            setPlayer(mockPlayer);
            setClub(mockClub)

            // Simulate update check
            setUpdateAvailable(true);

            // Simulate first-time login behavior
            if (!mockPlayer.name) {
                setSelectedPage(2); // Navigate to Settings
                setShowEditDetails(true); // Show edit details
            }
        };

        fetchPlayer();
    }, []);

    const handleSubscriptionCheck = () => {
        // Simulate subscription check
        const hasActiveSubscription = false; // Replace with real logic
        setIsPro(hasActiveSubscription);
        setPaywallShown(!hasActiveSubscription);
    };

    useEffect(() => {
        handleSubscriptionCheck();
    }, []);

    return (
        <NavigationContainer>
            <View style={styles.container}>
                {updateAvailable && (
                    <View style={styles.updateOverlay}>
                        <Text style={styles.updateText}>An update is available!</Text>
                    </View>
                )}

                {error && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorTitle}>Uh Oh</Text>
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity onPress={() => setError(null)} style={styles.dismissErrorButton}>
                            <Text style={styles.buttonText}>Dismiss</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <Tab.Navigator
                    initialRouteName="Clubs"
                    screenOptions={{
                        tabBarActiveTintColor: '#FFF',
                        tabBarInactiveTintColor: '#DDD',
                        tabBarStyle: { backgroundColor: '#1F8E3A' },
                    }}
                >
                    <Tab.Screen
                        name="Clubs"
                        options={{
                            tabBarIcon: ({ color }) => <Icon name="people" size={24} color={color} />,
                        }}
                    >
                        {() => <ClubListView />}
                    </Tab.Screen>

                    {player && club && (
                        <>
                            <Tab.Screen
                                name="My Data"
                                options={{
                                    tabBarIcon: ({ color }) => <Icon name="person-circle" size={24} color={color} />,
                                }}
                            >
                                {() => (
                                    <DetailedPlayerView
                                        player={player}
                                        club={club }
                                    />
                                )}
                            </Tab.Screen>


                            <Tab.Screen
                                name="Settings"
                                options={{
                                    tabBarIcon: ({ color }) => <Icon name="settings" size={24} color={color} />,
                                }}
                            >
                                {() => (
                                    <SettingsView
                                        player={player}
                                        showEditPlayer={showEditDetails}
                                        onEditDetails={() => setShowEditDetails(false)}
                                    />
                                )}
                            </Tab.Screen>
                        </>
                    )}
                </Tab.Navigator>

                {/* Paywall Modal */}
                <Modal visible={paywallShown} transparent animationType="slide">
                    <View style={styles.paywall}>
                        <Text style={styles.paywallText}>Upgrade to Pro to access this feature!</Text>
                        <TouchableOpacity onPress={() => setPaywallShown(false)} style={styles.dismissButton}>
                            <Text style={styles.buttonText}>Dismiss</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </View>
        </NavigationContainer>
    );
};

export default MainNavigationView;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1F8E3A' },
    updateOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: '#FFDD44',
        zIndex: 10,
    },
    updateText: { color: '#333', fontWeight: 'bold', textAlign: 'center' },
    errorContainer: {
        position: 'absolute',
        top: 100,
        left: 50,
        right: 50,
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 8,
        zIndex: 10,
    },
    errorTitle: { fontSize: 18, fontWeight: 'bold', color: '#FF4C4C' },
    errorText: { marginVertical: 8, color: '#333' },
    dismissErrorButton: {
        backgroundColor: '#1F8E3A',
        padding: 8,
        borderRadius: 4,
        alignItems: 'center',
    },
    buttonText: { color: '#FFF', fontWeight: 'bold' },
    paywall: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    paywallText: { color: '#FFF', fontSize: 18, marginBottom: 20 },
    dismissButton: {
        backgroundColor: '#FF4C4C',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
});
