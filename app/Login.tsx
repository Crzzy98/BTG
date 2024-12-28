import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Login = ({ cognitoAuth }: { cognitoAuth: any }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const transition = new Animated.Value(0);

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    Animated.timing(transition, {
      toValue: isSignUp ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleSignIn = async () => {
    await cognitoAuth.signIn(username, password);

    // Transition back to login view after signing in
    setIsSignUp(false);
    Animated.timing(transition, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleSignUp = async () => {
    if (password.length < 6) {
      alert('Password must be at least 6 characters long.');
      return;
    }
    await cognitoAuth.signUp(username, password, username, firstName, lastName);
  };

  const loginButtonColor = transition.interpolate({
    inputRange: [0, 1],
    outputRange: ['#ffffff', '#3b873e'],
  });

  const signUpButtonColor = transition.interpolate({
    inputRange: [0, 1],
    outputRange: ['#3b873e', '#ffffff'],
  });

  const loginTextColor = transition.interpolate({
    inputRange: [0, 1],
    outputRange: ['#3b873e', '#ffffff'],
  });

  const signUpTextColor = transition.interpolate({
    inputRange: [0, 1],
    outputRange: ['#ffffff', '#3b873e'],
  });

  const signUpButtonBorderColor = transition.interpolate({
    inputRange: [0, 1],
    outputRange: ['#ffffff', '#ffffff'], // White border when in sign-up mode
  });

  return (
      <View style={styles.formContainer}>
        <View style={styles.logoContainer}>
          <Image source={require('../assets/images/bigteamgolflogo.png')} style={styles.logo} />
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
          </>
        )}

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={username}
          onChangeText={setUsername}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.passwordRequirements}>
          Password must be at least 6 characters long.
        </Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, styles.passwordInput]}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Icon style={styles.icon} name={showPassword ? 'eye' : 'eye-slash'} size={20} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.formButtons}>
          <TouchableOpacity onPress={handleSignIn}>
            <Animated.View
              style={[styles.button, { backgroundColor: loginButtonColor }]}
            >
              <Animated.Text style={[styles.buttonText, { color: loginTextColor }]}>
                Login
              </Animated.Text>
            </Animated.View>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <Text style={styles.signUpText}>
            Need to create an account?
          </Text>
          <TouchableOpacity onPress={toggleMode}>
            <Animated.View
              style={[
                styles.button,
                {
                  backgroundColor: signUpButtonColor,
                  borderColor: signUpButtonBorderColor,
                  borderWidth: 2,
                  marginTop: 10,
                },
              ]}
            >
              <Animated.Text style={[styles.buttonText, { color: signUpTextColor }]}>
                Sign Up
              </Animated.Text>
            </Animated.View>
          </TouchableOpacity>
        </View>
      </View>
  );
};

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
    width: '100%',
  },
  passwordRequirements: {
    fontSize: 12,
    color: '#ffffff',
    marginBottom: 3,
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

export default Login;
