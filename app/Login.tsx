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

  const buttonColor = transition.interpolate({
    inputRange: [0, 1],
    outputRange: ['#ffffff', '#3b873e'],
  });

  const buttonTextColor = transition.interpolate({
    inputRange: [0, 1],
    outputRange: ['#3b873e', '#ffffff'],
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
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Text style={styles.togglePassword}>{showPassword ? 'Hide' : 'Show'}</Text>
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
            { backgroundColor: buttonColor },
          ]}
        >
          <TouchableOpacity onPress={isSignUp ? handleSignUp : handleSignIn}>
            <Animated.Text style={[styles.buttonText, { color: buttonTextColor }]}> 
              {isSignUp ? 'Sign Up' : 'Login'}
            </Animated.Text>
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity style={styles.switchButton} onPress={toggleMode}>
          <Text style={styles.switchText}>
            {isSignUp ? 'Already have an account? Login' : 'Need to create an account? Sign Up'}
          </Text>
        </TouchableOpacity>
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
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  togglePassword: {
    marginLeft: 10,
    color: '#ffffff',
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
    marginBottom: 10,
  },
  buttonText: {
    fontWeight: 'bold',
  },
  switchButton: {
    marginTop: 20,
  },
  switchText: {
    textAlign: 'center',
    color: '#ffffff',
  },
});

export default Login;
