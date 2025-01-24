'use client';

import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    ScrollView,
    StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useMain, useClub } from "../context";

// Define interfaces
interface ClubDetailedViewProps {
    club: {
        id: string;
        name: string;
    };
}

interface Player {
    id: string;
    name: string;
}

interface ClubData {
    id: string;
    name: string;
    players: Player[];
    admins: string[];
    events: any[]; // Define proper event type
    superAdmin: string;
}

const ClubDetailedView: React.FC<ClubDetailedViewProps> = ({ club }) => {
    const navigation = useNavigation();
    
    // Use custom hooks from context
    const { user } = useMain();
    const { selectedClub, setSelectedClub, refreshClubs } = useClub();

    const [pageIndex, setPageIndex] = useState(0);
    const [showAlert, setShowAlert] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(false);
    const [clubData, setClubData] = useState<ClubData | null>(null);

    useEffect(() => {
        if (club?.id) {
            setLoading(true);
            // Fetch club data
            const fetchClubData = async () => {
                try {
                    // Replace with your actual API call
                    // const response = await fetch(`/api/clubs/${club.id}`);
                    // const data = await response.json();
                    // setClubData(data);
                    
                    // setIsAdmin(clubData?.admins?.includes(user?.id || ''));
                } catch (error) {
                    console.error('Error fetching club data:', error);
                } finally {
                    setLoading(false);
                }
            };

            fetchClubData();
        }
    }, [club?.id, user?.id]);

    const handleLeaveClub = async () => {
        Alert.alert(
            "Leave Club?",
            "Are you sure you want to leave the club? You will have to be invited back to join.",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Yes",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            // Replace with your actual API call
                            // await fetch(`/api/clubs/${club.id}/leave`, {
                            //     method: 'POST',
                            //     body: JSON.stringify({ userId: user?.id }),
                            // });
                            
                            await refreshClubs(); // Refresh clubs list
                            navigation.goBack();
                        } catch (error) {
                            console.error('Error leaving club:', error);
                            Alert.alert('Error', 'Failed to leave club');
                        }
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.menuBar}>
                <MenuItem
                    title={`${clubData?.players?.length || 0} member${
                        (clubData?.players?.length || 0) === 1 ? "" : "s"
                    }`}
                    icon="👥"
                    isChosen={pageIndex === 0}
                    onPress={() => setPageIndex(0)}
                />
                <MenuItem
                    title="Run Teams"
                    icon="✏️"
                    isChosen={pageIndex === 1}
                    onPress={() => setPageIndex(1)}
                />
                <MenuItem
                    title="Games"
                    icon="📅"
                    isChosen={pageIndex === 2}
                    onPress={() => setPageIndex(2)}
                />
                {isAdmin && (
                    <MenuItem
                        title="Admin"
                        icon="⚙️"
                        isChosen={pageIndex === 3}
                        onPress={() => setPageIndex(3)}
                    />
                )}
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {loading ? (
                    <ActivityIndicator size="large" color="#ffffff" />
                ) : pageIndex === 0 ? (
                    <PlayerList players={clubData?.players || []} isAdmin={isAdmin} />
                ) : pageIndex === 1 ? (
                    <RunTeams players={clubData?.players || []} />
                ) : pageIndex === 2 ? (
                    <EventList />
                ) : pageIndex === 3 ? (
                    <AdminPanel />
                ) : null}
            </ScrollView>

            <View style={styles.toolbar}>
                <Text style={styles.title}>{clubData?.name || "Club Name"}</Text>
                {clubData?.superAdmin !== user?.id ? (
                    <TouchableOpacity onPress={handleLeaveClub} style={styles.leaveButton}>
                        <Text style={styles.leaveText}>Leave</Text>
                    </TouchableOpacity>
                ) : (
                    <Text style={styles.ownerText}>Owner</Text>
                )}
            </View>
        </View>
    );
};

// Component interfaces
interface MenuItemProps {
    title: string;
    icon: string;
    isChosen: boolean;
    onPress: () => void;
}

interface PlayerListProps {
    players: Player[];
    isAdmin: boolean;
}

interface RunTeamsProps {
    players: Player[];
}

const MenuItem: React.FC<MenuItemProps> = ({ title, icon, isChosen, onPress }) => (
    <TouchableOpacity
        style={[styles.menuItem, isChosen && styles.menuItemChosen]}
        onPress={onPress}
    >
        <Text style={[styles.menuIcon, isChosen && styles.menuIconChosen]}>{icon}</Text>
        <Text style={[styles.menuText, isChosen && styles.menuTextChosen]}>{title}</Text>
    </TouchableOpacity>
);

const PlayerList: React.FC<PlayerListProps> = ({ players, isAdmin }) => (
    <View>
        {players.map((player, index) => (
            <Text key={player.id || index} style={styles.playerItem}>
                {player.name} {isAdmin && "(Admin)"}
            </Text>
        ))}
    </View>
);

const RunTeams: React.FC<RunTeamsProps> = ({ players }) => (
    <View>
        <Text style={styles.playerItem}>Run Teams Component</Text>
    </View>
);

const EventList: React.FC = () => (
    <View>
        <Text style={styles.playerItem}>Event List Component</Text>
    </View>
);

const AdminPanel: React.FC = () => (
    <View>
        <Text style={styles.playerItem}>Admin Panel Component</Text>
    </View>
);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#013220", // master's green
    },
    menuBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
        backgroundColor: "#015D3A",
    },
    menuItem: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 10,
        marginHorizontal: 5,
        borderRadius: 5,
    },
    menuItemChosen: {
        backgroundColor: "#ffffff",
    },
    menuIcon: {
        fontSize: 20,
        color: "#ffffff",
    },
    menuIconChosen: {
        color: "#013220",
    },
    menuText: {
        color: "#ffffff",
        fontSize: 12,
        fontWeight: "600",
    },
    menuTextChosen: {
        color: "#013220",
    },
    content: {
        flex: 1,
        padding: 10,
    },
    toolbar: {
        padding: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#015D3A",
    },
    title: {
        color: "#ffffff",
        fontSize: 20,
        fontWeight: "600",
    },
    leaveButton: {
        padding: 5,
        borderWidth: 1,
        borderColor: "red",
        borderRadius: 5,
    },
    leaveText: {
        color: "red",
        fontWeight: "600",
    },
    ownerText: {
        color: "#FFD700",
        fontWeight: "600",
    },
    playerItem: {
        color: "#ffffff",
        paddingVertical: 5,
        fontSize: 16,
    },
});

export default ClubDetailedView;
