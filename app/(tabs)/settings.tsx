import SettingsView from '../views/SettingsView';
import { useLocalSearchParams } from 'expo-router';
import { Player, Club } from '../../store/types';
import { View } from 'react-native';

export default function SettingsScreen() {
    const { player, showEditDetails } = useLocalSearchParams();
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
    return (
        <View>
            <SettingsView
                player={mockPlayer}
                showEditPlayer={showEditDetails === 'true'}
            />
        </View>
    );
}