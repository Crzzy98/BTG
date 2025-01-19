import { router } from 'expo-router';
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

const { width } = Dimensions.get('window');

interface LoginProps {
  cognitoAuth: any; // Replace with proper type from your auth service
}

export default function Login({ cognitoAuth }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [handicap, setHandicap] = useState(0);
  const [isSignUp, setIsSignUp] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const showAlert = (message: string, type: 'success' | 'error') => {
    Alert.alert(
      type === 'success' ? 'Success' : 'Error',
      message,
      [{ text: 'OK' }],
      { cancelable: false }
    );
  };

  const handleFormSubmit = async () => {
    if (isSignUp) {
      try {
        await cognitoAuth.signUp(
          email,
          password,
          email,
          firstName,
          lastName,
          handicap.toString()
        );
        showAlert(
          'Sign up successful! Please check your email for verification.',
          'success'
        );
        fadeOut();
        setTimeout(() => {
          setIsSignUp(false);
          setPassword('');
          setFirstName('');
          setLastName('');
          setHandicap(0);
          fadeIn();
        }, 200);
      } catch (err: any) {
        showAlert(err.message, 'error');
      }
    } else {
      if (!email || !password) {
        showAlert('Please enter both email and password', 'error');
        return;
      }
      try {
        await cognitoAuth.signOutLocally();
        await cognitoAuth.signIn(email, password);
        showAlert('Login successful!', 'success');
        setTimeout(() => {
          router.replace('./CreateClubView');
        }, 1000);
      } catch (err: any) {
        showAlert(err.message, 'error');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View style={[styles.formContainer, { opacity: fadeAnim }]}>
          <Text style={styles.title}>
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {isSignUp && (
            <>
              <TextInput
                style={styles.input}
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
              />

              <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
              />

              <TextInput
                style={styles.input}
                placeholder="Handicap"
                value={handicap.toString()}
                onChangeText={(text) => setHandicap(Number(text))}
                keyboardType="numeric"
              />
            </>
          )}

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleFormSubmit}
          >
            <Text style={styles.submitButtonText}>
              {isSignUp ? 'Sign Up' : 'Login'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchButton}
            onPress={() => {
              fadeOut();
              setTimeout(() => {
                setIsSignUp(!isSignUp);
                setPassword('');
                fadeIn();
              }, 200);
            }}
          >
            <Text style={styles.switchButtonText}>
              {isSignUp ? 'Already have an account? Login' : 'Need an account? Sign Up'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3b873e',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#3b873e',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  switchButtonText: {
    color: '#3b873e',
    fontSize: 14,
  },
});
