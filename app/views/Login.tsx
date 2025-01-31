import { router, Href  } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { setUser, setLoading } from '@/store/reducers/userReducer';
import type { User } from '@/store/types';
import Icon from 'react-native-vector-icons/Ionicons';
import { Slider } from '@rneui/themed';

interface LoginProps {
  cognitoAuth: any;
}

export default function Login({ cognitoAuth }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [handicap, setHandicap] = useState(0);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

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
        if (!email || !password || !firstName || !lastName) {
          throw new Error('Please fill in all required fields');
        }
  
        try {
          console.log('Starting signup process...');
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
          setIsSignUp(false);
          setEmail('');
          setPassword('');
          setFirstName('');
          setLastName('');
          setHandicap(0);
        } catch (signUpError: any) {
          console.log('Sign up error:', signUpError);
          throw signUpError;
        }
      } else {
        // Login Logic
        if (!email || !password) {
          throw new Error('Please enter both email and password');
        }
  
        try {
          console.log('Starting login process...', { username: email });
          
          // First try to sign out any existing session
          await cognitoAuth.signOutLocally();
          
          // Attempt to sign in
          await cognitoAuth.signIn(email, password);
  
          // Check if login was successful by checking loggedIn flag
          if (cognitoAuth.loggedIn) {
            // Get current user data
            const currentUser = await cognitoAuth.getCurrentUser();
            console.log('Current user:', currentUser);
  
            if (currentUser) {
              const userData: User = {
                id: currentUser.userId,
                email: currentUser.email || email,
                name: `${currentUser.attributes?.['custom:first'] || ''} ${currentUser.attributes?.['custom:last'] || ''}`.trim(),
                isPro: false,
                clubs: [],
                handicap: parseFloat(currentUser.attributes?.['custom:handicap'] || '0'),
                firstName: currentUser.attributes?.['custom:first'] || '',
                lastName: currentUser.attributes?.['custom:last'] || ''
              };
  
              dispatch(setUser(userData));
              showAlert('Login successful!', 'success');
              
              setTimeout(() => {
                // router.push('views/MainNavigationView' as Href<string>);
                router.replace('views/MainNavigationView' as Href<string>);
              }, 1000);
            } else {
              throw new Error('Unable to fetch user data');
            }
          } else {
            throw new Error('Login failed. Please try again.');
          }
        } catch (signInError: any) {
          console.log('Sign in error:', signInError);
          
          if (cognitoAuth.confirmUser) {
            throw new Error('Please verify your email address before logging in.');
          } else if (cognitoAuth.error) {
            throw cognitoAuth.error;
          } else {
            throw signInError;
          }
        }
      }
    } catch (err: any) {
      console.log('Form submission error:', err);
      showAlert(err.message, 'error');
    } finally {
      dispatch(setLoading(false));
    }
  };  
  
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: '#3b873e' }}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/logo/bigteamgolflogo_1.png')}
            style={styles.logo}
          />
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.header}>
            {isSignUp ? 'Create Account' : 'Login'}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={styles.icon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Icon
                name={showPassword ? 'eye-off' : 'eye'}
                size={24}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          {isSignUp && (
            <>
              <Text style={styles.passwordRequirements}>
                Password must be at least 6 characters long and contain:
              </Text>

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

              <View style={styles.handicapContainer}>
                <Text style={styles.handicapLabel}>
                  Handicap: {Math.round(handicap)}
                </Text>
                <Slider
                  value={handicap}
                  onValueChange={setHandicap}
                  minimumValue={0}
                  maximumValue={50}
                  step={1}
                  allowTouchTrack
                  trackStyle={{ height: 5 }}
                  thumbStyle={{
                    height: 20,
                    width: 20,
                    backgroundColor: '#ffffff'
                  }}
                  minimumTrackTintColor="#ffffff"
                  maximumTrackTintColor="#000000"
                  thumbProps={{
                    children: (
                      <View
                        style={{
                          height: 20,
                          width: 20,
                          backgroundColor: '#ffffff',
                          borderRadius: 10,
                        }}
                      />
                    ),
                  }}
                />
              </View>

            </>
          )}

          <View style={styles.formButtons}>
            {!isSignUp ? (
              <>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: '#fff' }]}
                  onPress={handleFormSubmit}
                >
                  <Text style={[styles.buttonText, { color: '#3b873e' }]}>
                    Login
                  </Text>
                </TouchableOpacity>

                <View style={styles.dividerContainer}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or</Text>
                  <View style={styles.dividerLine} />
                </View>
                <Text style={styles.createAccountText}>
                  {isSignUp ? 'Already have an account?' : 'Need to create an account?'}
                </Text>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: '#fff' }]}
                  onPress={() => {
                    setIsSignUp(true);
                    setPassword('');
                    setFirstName('');
                    setLastName('');
                    setHandicap(0);
                  }}
                >
                  <Text style={[styles.buttonText, { color: '#3b873e' }]}>
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: '#fff' }]}
                  onPress={handleFormSubmit}
                >
                  <Text style={[styles.buttonText, { color: '#3b873e' }]}>
                    Sign Up
                  </Text>
                </TouchableOpacity>

                <View style={styles.dividerContainer}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or</Text>
                  <View style={styles.dividerLine} />
                </View>

                <TouchableOpacity
                  style={[styles.button, { backgroundColor: '#fff' }]}
                  onPress={() => {
                    setIsSignUp(false);
                    setPassword('');
                    setFirstName('');
                    setLastName('');
                    setHandicap(0);
                  }}
                >
                  <Text style={[styles.buttonText, { color: '#3b873e' }]}>
                    Login
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3b873e',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 500,
    height: 350,
    resizeMode: 'stretch',
    elevation: 3,
  },
  formContainer: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: '#3b873e',
    borderRadius: 10,
    paddingTop: 0,
    paddingRight: 10,
    paddingBottom: 20,
    paddingLeft: 10,
    width: '100%',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'left',
    paddingLeft: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#ffffff',
    width: '95%',
    fontSize: 16,
    alignSelf: 'center',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    width: '95%',
    marginBottom: 15,
    alignSelf: 'center',
  },
  passwordInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 15,
    paddingRight: 45,
    backgroundColor: '#ffffff',
    width: '100%',
    fontSize: 16,
  },
  icon: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -12 }],
    zIndex: 1,
  },
  passwordRequirements: {
    fontSize: 12,
    color: '#ffffff',
    marginBottom: 15,
    width: '95%',
    alignSelf: 'center',
  },
  handicapContainer: {
    width: '95%',
    alignSelf: 'center',
    marginBottom: 15,
    backgroundColor: '#3b873e',
    padding: 10,
    borderRadius: 5,
  },
  handicapLabel: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 10,
    fontWeight: '500',
  },
  formButtons: {
    marginTop: 20,
    marginBottom: 10,
    width: '100%',
  },
  button: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: '95%',
    marginVertical: 10,
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '95%',
    marginVertical: 10,
    alignSelf: 'center',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ffffff',
  },
  dividerText: {
    color: '#ffffff',
    paddingHorizontal: 15,
    fontSize: 16,
    fontWeight: '500',
  },
  createAccountText: {
    justifyContent: 'center',
    alignItems: 'center',
    color: '#ffffff',
    textAlign: 'center'
  },
});
