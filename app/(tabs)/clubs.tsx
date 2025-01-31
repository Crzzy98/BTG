import { View } from 'react-native';
import ClubListView from '../views/Club/ClubListView';

export default function TabHomeScreen() {
  return (
    <View style={{ flex: 1 }}>
      <ClubListView />
    </View>
  );
}
