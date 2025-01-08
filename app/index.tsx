import { StyleSheet, View } from 'react-native';
import Login from './Login';
import CognitoAuth from '@/view-models/CognitoAuth'

//Dev View 
import ClubListView from './views/ClubListView';

//AWS config imports 
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";

Amplify.configure(outputs);

export default function HomeScreen() {
  return (
        <View style={styles.container}>
          <Login cognitoAuth={CognitoAuth} />
          {/* <ClubListView></ClubListView> */}
        </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3b873e',
  },
});
