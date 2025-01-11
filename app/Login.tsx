import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Slider } from '@rneui/themed';

const Login = ({ cognitoAuth }: { cognitoAuth: any }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [handicap, setHandicap] = useState(0);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    checkCurrentUser();
  }, []);

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

  const handleFormSubmit = async () => {
    if (isSignUp) {
      if (password.length < 6) {
        alert('Password must be at least 6 characters long.');
        return;
      }
      try {
        await cognitoAuth.signUp(email, password, email,
          firstName, lastName, handicap.toString());
        console.log("Sign up successful")
      } catch (err) {
        console.error('Sign up error:', err)
      }
    } else {
      try {
        // First try to sign out if there's an existing session
        await cognitoAuth.signOutLocally();

        await cognitoAuth.signIn(email, password);
      } catch (err) {
        console.error('Sign in error:', err);
      }
    }
  };

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <ScrollView style={styles.formContainer}>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/images/bigteamgolflogo_1.png')} style={styles.logo} />
      </View>

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
        {/* Primary Button */}
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

        {/* Secondary Button */}
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
    </ScrollView>
  );
};

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
});

export default Login;
