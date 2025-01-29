import { router } from 'expo-router';
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

interface LoginProps {
  cognitoAuth: any;
}

export default function Login({ cognitoAuth }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [handicap, setHandicap] = useState('0');
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
        const signUpResult = await cognitoAuth.signUp(
          email,
          password,
          email,
          firstName,
          lastName,
          handicap
        );

        if (signUpResult.success) {
          showAlert(
            'Sign up successful! Please check your email for verification.',
            'success'
          );
          setIsSignUp(false);
          setPassword('');
          setFirstName('');
          setLastName('');
          setHandicap('0');
        } else {
          throw new Error(signUpResult.message);
        }
      } else {
        if (!email || !password) {
          throw new Error('Please enter both email and password');
        }

        await cognitoAuth.signOutLocally();
        const signInResult = await cognitoAuth.signIn(email, password);

        if (signInResult.success) {
          const userAttributes = await cognitoAuth.getCurrentUser();

          const userData: User = {
            id: userAttributes.sub,
            email: userAttributes.email,
            name: `${userAttributes.given_name} ${userAttributes.family_name}`,
            isPro: false,
            clubs: [],
            handicap: parseFloat(userAttributes.custom['custom:handicap'] || '0'),
            firstName: userAttributes.given_name,
            lastName: userAttributes.family_name,
          };

          dispatch(setUser(userData));
          showAlert('Login successful!', 'success');
          
          setTimeout(() => {
            router.replace('./MainNavigationView');
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
              style={[styles.passwordInput, styles.input]}
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
                {'\n'}- At least one uppercase letter
                {'\n'}- At least one lowercase letter
                {'\n'}- At least one number
                {'\n'}- At least one special character
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

              <TextInput
                style={styles.input}
                placeholder="Handicap"
                value={handicap}
                onChangeText={setHandicap}
                keyboardType="numeric"
              />
            </>
          )}

          <View style={styles.formButtons}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#fff' }]}
              onPress={handleFormSubmit}
            >
              <Text style={[styles.buttonText, { color: '#3b873e' }]}>
                {isSignUp ? 'Sign Up' : 'Login'}
              </Text>
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              onPress={() => {
                setIsSignUp(!isSignUp);
                setPassword('');
                setFirstName('');
                setLastName('');
                setHandicap('0');
              }}
            >
              <Text style={styles.signUpText}>
                {isSignUp ? 'Already have an account? Login' : 'Need an account? Sign Up'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 200,
    height: 100,
    resizeMode: 'contain',
  },
  formContainer: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: '#3b873e',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#ffffff',
    width: '100%',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
    marginBottom: 15,
  },
  icon: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -45 }], 
    zIndex: 1,
  },
  passwordInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    paddingRight: 45, // Make room for the icon
    backgroundColor: '#ffffff',
  },
  passwordRequirements: {
    fontSize: 12,
    color: '#ffffff',
    marginBottom: 15,
  },
  formButtons: {
    marginTop: 0,
    width: '100%',
  },
  button: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  signUpText: {
    justifyContent: 'center',
    alignItems:'center',
    color: '#ffffff',
    textAlign: 'center'
  },
  buttonText: {
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,  // Spacing above and below the divider
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ffffff',  // Match your design color
  },
  dividerText: {
    color: '#ffffff',  // Match your design color
    paddingHorizontal: 10,  // Space between lines and text
    fontSize: 16,
    fontWeight: '500',
  },
});