import React, { useState, useEffect } from 'react';
import { View, Text, Alert, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const SettingsView = () => {
  const router = useRouter();
// Mock player data
const player = {
    id: '12345',
    name: 'John Doe',
    email: 'john.doe@example.com',
  };
  const [appName, setAppName] = useState('');
  const [showEditPlayer, setShowEditPlayer] = useState(false);

  const handleLogout = async () => {
    // Clear user data (adjust as needed)
    console.log('Logged out');
    // Redirect to login screen
    router.push('./Login');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete your Account?',
      'Are you sure you want to delete your account? You will lose all your round and club data.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: async () => {
            console.log('Deleted account for:', player?.id);
            // Add your delete logic here


            console.log("Account deletion successful!")
            // router.push('/signup');
          },
        },
      ]
    );
  };

  const handleEditPlayer = () => {
    setShowEditPlayer(true);
    console.log('Edit Player screen');
    // router.push('/edit-player'); // Navigate to Edit Player screen
  };

  useEffect(() => {
    // Get app name from the app configuration
    setAppName('Big Team Golf'); // Replace with dynamic logic if needed
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Account</Text>

        <TouchableOpacity onPress={handleEditPlayer} style={styles.button}>
          <Text style={styles.buttonText}>Edit Player</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => console.log("Change password screen/modal")} style={styles.button}>
          <Text style={styles.buttonText}>Change Password</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogout} style={styles.button}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleDeleteAccount} style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Delete Player</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{appName}</Text>

        <TouchableOpacity
          onPress={() =>
            Linking.openURL('https://www.apple.com/legal/internet-services/itunes/dev/stdeula/')
          }
          style={styles.button}
        >
          <Text style={styles.buttonText}>Terms of Service</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            Linking.openURL('https://sites.google.com/view/bigteamgolfprojecthcc')
          }
          style={styles.button}
        >
          <Text style={styles.buttonText}>Privacy Policy</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => Linking.openURL('https://bigteamgolf.com/faqs')}
          style={styles.button}
        >
          <Text style={styles.buttonText}>FAQ</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SettingsView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#1F8E3A',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  deleteButton: {
    backgroundColor: '#FF4C4C',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  deleteButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
