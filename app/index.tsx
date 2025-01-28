import { StyleSheet, View } from 'react-native';
import MainNavigationView from './views/MainNavigationView';

//Dev View 
import ClubListView from './views/Club/ClubListView';

//AWS config imports 
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";

Amplify.configure(outputs);

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <MainNavigationView/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3b873e',
  },
});
