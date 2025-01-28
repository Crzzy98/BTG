import { StyleSheet, View } from 'react-native';
import Login from './views/Login';
import CognitoAuth from '@/view-models/CognitoAuth'
import SettingsView from './views/SettingsView';

//Dev View 
import ClubListView from './views/Club/ClubListView';

//AWS config imports 
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";

Amplify.configure(outputs);

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* <Login cognitoAuth={CognitoAuth} /> */}
      {/* <ClubListView></ClubListView> */}
      <SettingsView></SettingsView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3b873e',
  },
});
