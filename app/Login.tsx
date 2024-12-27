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

  return (
    <ScrollView contentContainerStyle={styles.container}>
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

        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, styles.passwordInput]}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Icon name={showPassword ? 'eye' : 'eye-slash'} size={20} color="#000" />
          </TouchableOpacity>
        </View>

        {isSignUp && (
          <Text style={styles.passwordRequirements}>
            Password must be at least 6 characters long.
          </Text>
        )}

        <Animated.View
          style={[
            styles.button,
            { backgroundColor: loginButtonColor },
          ]}
        >
          <TouchableOpacity onPress={handleSignIn}>
            <Animated.Text style={[styles.buttonText, { color: loginTextColor }]}>Login</Animated.Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View
          style={[
            styles.button,
            { backgroundColor: signUpButtonColor, marginTop: 10 },
          ]}
        >
          <TouchableOpacity onPress={toggleMode}>
            <Animated.Text style={[styles.buttonText, { color: signUpTextColor }]}>
              Sign Up
            </Animated.Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </ScrollView>
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
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#ffffff',
  },
  passwordInput: {
    flex: 1,
  },
  passwordRequirements: {
    fontSize: 12,
    color: '#ffffff',
    marginBottom: 15,
  },
  button: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
  },
});

export default Login;
