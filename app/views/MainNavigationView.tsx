import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Tabs } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';
import ClubListView from './Club/ClubListView';
import DetailedPlayerView from './Player/DetailedPlayerView';
import SettingsView from './SettingsView';
import { Player, Club } from '../../store/types';

function TabLayout({ player, club, showEditDetails, onEditDetails }: {
    player: Player | null;
    club: Club | null;
    showEditDetails: boolean;
    onEditDetails: () => void;
}) {
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
            {player && club && (
                <>
                    <Tabs.Screen
                        name="mydata"
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
                </>
            )}
        </Tabs>
    );
}

export default function MainNavigationView() {
    const [isPro, setIsPro] = useState(false);
    const [updateAvailable, setUpdateAvailable] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedPage, setSelectedPage] = useState(0);
    const [player, setPlayer] = useState<Player | null>(null);
    const [club, setClub] = useState<Club | null>(null);
    const [showEditDetails, setShowEditDetails] = useState(false);

    useEffect(() => {
        const fetchPlayer = async () => {
            const mockPlayer = {
                id: '12345',
                name: 'Mock',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                fullName: 'Doe',
                getWeight: (club: Club): number => {
                    return club.birdieWeight || 1.0;
                }
            };

            const mockClub: Club = {
                id: 'club123',
                name: 'Golden Gate Golf Club',
                passcode: '1234',
                superAdmin: '12345',
                players: [],
                admins: ['12345'],
                birdieWeight: 1.5,
                clubLimit: 100,
                password: 'clubpass123'
            };

            setPlayer(mockPlayer);
            setClub(mockClub);
            setUpdateAvailable(true);

            if (!mockPlayer.name) {
                setSelectedPage(2);
                setShowEditDetails(true);
            }
        };

        fetchPlayer();
    }, []);

    return (
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
                    <TouchableOpacity
                        onPress={() => setError(null)}
                        style={styles.dismissErrorButton}
                    >
                        <Text style={styles.buttonText}>Dismiss</Text>
                    </TouchableOpacity>
                </View>
            )}

            <TabLayout
                player={player}
                club={club}
                showEditDetails={showEditDetails}
                onEditDetails={() => setShowEditDetails(false)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1F8E3A'
    },
    updateOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: '#FFDD44',
        zIndex: 10,
    },
    updateText: {
        color: '#333',
        fontWeight: 'bold',
        textAlign: 'center'
    },
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
    errorTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FF4C4C'
    },
    errorText: {
        marginVertical: 8,
        color: '#333'
    },
    dismissErrorButton: {
        backgroundColor: '#1F8E3A',
        padding: 8,
        borderRadius: 4,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold'
    },
    paywall: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    paywallText: {
        color: '#FFF',
        fontSize: 18,
        marginBottom: 20
    },
    dismissButton: {
        backgroundColor: '#FF4C4C',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
});
