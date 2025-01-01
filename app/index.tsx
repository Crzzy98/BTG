import { StyleSheet, View } from 'react-native';
import Login from './Login';
import CognitoAuth from '@/view-models/CognitoAuth'

//AWS config imports 
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react-native";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";

Amplify.configure(outputs);

export default function HomeScreen() {
  return (
        <View style={styles.container}>
          <Login cognitoAuth={CognitoAuth} />
          {/* <Login cognitoAuth="" /> */}
        </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3b873e',
  },
});
