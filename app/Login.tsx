import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Animated 
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Slider } from '@rneui/themed';
import AlertModal from './view-components/AlertModal';

const Login = ({ cognitoAuth }: { cognitoAuth: any }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [handicap, setHandicap] = useState(0);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [fadeAnim] = useState(new Animated.Value(1));


  // Add alert state
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning' | 'info'>('info');

  useEffect(() => {
    checkCurrentUser();
  }, []);

  // Add showAlert helper function
  const showAlert = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'error') => {
    setAlertMessage(message);
    setAlertType(type);
    setAlertVisible(true);
  };

  const checkCurrentUser = async () => {
    try {
      const currentUser = await cognitoAuth.getCurrentUser();
      if (currentUser) {
        setEmail(currentUser.loginId || '');
      }
    } catch (err) {
      console.log('No current user found');
    }
  };

  const validateSignupForm = () => {
    if (!email || !password || !firstName || !lastName) {
      showAlert('Please fill in all required fields', 'error');
      return false;
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showAlert('Please enter a valid email address', 'error');
      return false;
    }
  
    if (password.length < 6) {
      showAlert('Password must be at least 6 characters long', 'warning');
      return false;
    }
  
    return true;
  };
  
  const handleFormSubmit = async () => {
    if (isSignUp) {
      if (!validateSignupForm()) {
        return;
      }
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
          'Sign up successful! Please check your email for a verification link. You must verify your email before logging in.',
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
        showAlert(err.message || 'Sign up error occurred', 'error');
        console.error('Sign up error:', err);
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
      } catch (err: any) {
        let errorMessage = 'Login error occurred';
        if (err.message.includes('User is not confirmed')) {
          errorMessage = 'Please verify your email before logging in. Check your inbox for the verification link.';
        } else if (err.message.includes('Incorrect username or password')) {
          errorMessage = 'Incorrect email or password';
        } else {
          errorMessage = err.message;
        }
        showAlert(errorMessage, 'error');
        console.error('Sign in error:', err);
      }
    }
  };

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };
  
  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };
  
  const toggleForm = () => {
    fadeOut();
    setTimeout(() => {
      setIsSignUp(!isSignUp);
      fadeIn();
    }, 200);
  };

  return (
    <ScrollView style={styles.formContainer}>
      <AlertModal
        visible={alertVisible}
        message={alertMessage}
        type={alertType}
        onClose={() => setAlertVisible(false)}
      />
  
      <View style={styles.logoContainer}>
        <Image source={require('../assets/images/bigteamgolflogo_1.png')} style={styles.logo} />
      </View>
  
      <Animated.View style={{ opacity: fadeAnim }}>
        <Text style={styles.header}>{isSignUp ? 'SIGN UP' : 'LOGIN'}</Text>
  
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
            <View style={styles.handicapContainer}>
              <Text style={styles.handicapLabel}>Handicap: {Math.round(handicap)}</Text>
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
                    >
                      <Text style={{ display: 'none' }}>
                        {Math.round(handicap)}
                      </Text>
                    </View>
                  )
                }}
              />
            </View>
          </>
        )}
  
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
  
        {isSignUp && (
          <Text style={styles.passwordRequirements}>
            Password must be at least 6 characters long.
          </Text>
        )}
  
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, styles.passwordInput]}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Icon
              style={styles.icon}
              name={showPassword ? 'eye' : 'eye-slash'}
              size={20}
              color="#000"
            />
          </TouchableOpacity>
        </View>
  
        <View style={styles.formButtons}>
          <TouchableOpacity onPress={handleFormSubmit}>
            <View style={[styles.button, {
              backgroundColor: '#ffffff',
              borderColor: '#3b873e',
              borderWidth: 2,
            }]}>
              <Text style={[styles.buttonText, { color: '#3b873e' }]}>
                {isSignUp ? 'Sign Up' : 'Login'}
              </Text>
            </View>
          </TouchableOpacity>
  
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>
  
          <Text style={styles.createAccountText}>
            {isSignUp ? 'Already have an account?' : 'Need to create an account?'}
          </Text>
  
          <TouchableOpacity onPress={toggleForm}>
            <View style={[styles.button, {
              backgroundColor: '#3b873e',
              borderColor: '#ffffff',
              borderWidth: 2,
              marginTop: 10,
            }]}>
              <Text style={[styles.buttonText, { color: '#ffffff' }]}>
                {isSignUp ? 'Login' : 'Sign Up'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </ScrollView>
  );
}  

const styles = StyleSheet.create({
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
    paddingRight: 20,
    paddingBottom: 20,
    paddingLeft: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
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
    paddingRight: 45,
  },
  passwordRequirements: {
    fontSize: 12,
    color: '#ffffff',
    marginBottom: 3,
  },
  formButtons: {
    marginTop: 0,
    marginBottom: 10,
    width: '100%',
  },
  button: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  createAccountText: {
    justifyContent: 'center',
    alignItems: 'center',
    color: '#ffffff',
    textAlign: 'center'
  },
  buttonText: {
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ffffff',
  },
  dividerText: {
    color: '#ffffff',
    paddingHorizontal: 10,
    fontSize: 16,
    fontWeight: '500',
  },
  handicapContainer: {
    marginBottom: 15,
    width: '100%',
  },
  handicapLabel: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 5,
  },
  inputError: {
    borderColor: '#ff6b6b',
    borderWidth: 1,
  },
});

export default Login;
