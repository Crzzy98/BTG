import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ScrollViewProps,
    StyleSheet,
    Image,
} from 'react-native';

const Login = ({ cognitoAuth }:{cognitoAuth:any}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [handicap, setHandicap] = useState(0.0);
    const [code, setCode] = useState('');
    const [showSignUp, setShowSignUp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const buttonDisabled = firstName === '' || lastName === '';

    const handleSignIn = async () => {
        await cognitoAuth.signIn(username, password);
    };

    const handleSignUp = async () => {
        await cognitoAuth.signUp(username, password, username, firstName, lastName, handicap.toString());
    };

    const handleConfirmSignUp = async () => {
        await cognitoAuth.confirmSignUp(username, password, code);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.logoContainer}>
            <Image source={require('../assets/images/bigteamgolflogo.png')} style={styles.logo} />
          </View>
    
          {cognitoAuth.confirmUser ? (
            <View style={styles.formContainer}>
              <Text style={styles.header}>Confirm Code</Text>
              <Text style={styles.subText}>
                A confirmation code has been sent to your email {username}. Please confirm the code to continue.
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Confirmation Code"
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
              />
              <TouchableOpacity style={styles.button} onPress={handleConfirmSignUp}>
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.formContainer}>
              <Text style={styles.header}>{showSignUp ? 'SIGN UP' : 'LOGIN'}</Text>
    
              {showSignUp && (
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
                  <Text style={styles.sliderText}>Handicap: {handicap}</Text>
                  {/* Slider implementation would be here */}
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
    
              <TouchableOpacity style={styles.button} onPress={showSignUp ? handleSignUp : handleSignIn}>
                <Text style={styles.buttonText}>{showSignUp ? 'SIGN UP' : 'LOGIN'}</Text>
              </TouchableOpacity>
    
              <TouchableOpacity onPress={() => setShowSignUp(!showSignUp)}>
                <Text style={styles.switchText}>
                  {showSignUp ? 'Already have an account? LOGIN' : 'Need to create an account? SIGN UP'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      );
    };

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        padding: 20,
        backgroundColor: '#3b873e',
    },
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
        backgroundColor: '#ffffff',
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
        color: '#3b873e',
        marginBottom: 10,
    },
    subText: {
        fontSize: 14,
        color: '#333',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    togglePassword: {
        marginLeft: 10,
        color: '#007bff',
    },
    button: {
        backgroundColor: '#3b873e',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    switchText: {
        marginTop: 20,
        textAlign: 'center',
        color: '#007bff',
    },
    sliderText: {
        color: '#333',
        marginBottom: 15,
    },
});

export default Login;
