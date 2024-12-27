import { StyleSheet, View } from 'react-native';
import Login from './Login';
import CognitoAuth from '@/view-models/CognitoAuth';
export default function HomeScreen() {  // Renamed for clarity
  return (
    <View style={styles.container}>
      <Login cognitoAuth={CognitoAuth} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3b873e', // Match your login screen background
  },
});
