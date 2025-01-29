import { StyleSheet, View } from 'react-native';
import MainNavigationView from './views/MainNavigationView';
import Login from './views/Login';
//Dev View 
import ClubListView from './views/Club/ClubListView';

//AWS config imports 
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import CognitoAuth from '@/view-models/CognitoAuth';

Amplify.configure(outputs);

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Login cognitoAuth={CognitoAuth} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3b873e',
  },
});
