import DetailedPlayerView from '../views/Player/DetailedPlayerView';
import { useLocalSearchParams } from 'expo-router';
import { Player, Club } from '../../store/types';
import { View } from 'react-native';

//Replace mock with data retrieved from store
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

export default function MyDataScreen() {
    return (
        <View style={{ flex: 1 }}>
            <DetailedPlayerView player={mockPlayer} club={mockClub} />
        </View>
    );
}

