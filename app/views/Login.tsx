import { router } from 'expo-router';
import React, { useState } from 'react';
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
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { setUser, setLoading } from '@/store/reducers/userReducer';
import type { User } from '@/store/types';

const { width } = Dimensions.get('window');

interface LoginProps {
  cognitoAuth: any; // Replace with proper Cognito type
}

export default function Login({ cognitoAuth }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [handicap, setHandicap] = useState('0');
  const [isSignUp, setIsSignUp] = useState(false);
  
  const dispatch = useDispatch<AppDispatch>();
  const fadeAnim = React.useRef(new Animated.Value(1)).current;

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
    dispatch(setLoading(true));

    try {
      if (isSignUp) {
        // Handle Sign Up
        const signUpResult = await cognitoAuth.signUp(
          email,
          password,
          email, // username same as email
          firstName,
          lastName,
          handicap
        );

        if (signUpResult.success) {
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
            setHandicap('0');
            fadeIn();
          }, 200);
        } else {
          throw new Error(signUpResult.message);
        }
      } else {
        // Handle Sign In
        if (!email || !password) {
          throw new Error('Please enter both email and password');
        }

        // Sign out any existing session
        await cognitoAuth.signOutLocally();

        // Attempt sign in
        const signInResult = await cognitoAuth.signIn(email, password);

        //If Seuccessful update store data and navigate to ClubListView
        if (signInResult.success) {
          // Get user attributes from Cognito
          const userAttributes = await cognitoAuth.getCurrentUser();

          // Create user object from Cognito attributes
          const userData: User = {
            id: userAttributes.sub,
            email: userAttributes.email,
            name: `${userAttributes.given_name} ${userAttributes.family_name}`,
            isPro: false, // Set default value or get from attributes
            clubs: [], // Initialize empty clubs array
            handicap: parseFloat(userAttributes.custom['custom:handicap'] || '0'),
            firstName: userAttributes.given_name,
            lastName: userAttributes.family_name,
          };

          // Update Redux store with user data
          dispatch(setUser(userData));

          showAlert('Login successful!', 'success');
          
          // Navigate after successful login
          setTimeout(() => {
            router.replace('./ClubListView');
          }, 1000);
        } else {
          throw new Error(signInResult.message);
        }
      }
    } catch (err: any) {
      showAlert(err.message, 'error');
    } finally {
      dispatch(setLoading(false));
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
                value={handicap}
                onChangeText={setHandicap}
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
