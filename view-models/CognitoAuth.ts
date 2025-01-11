import {
  signIn as amplifySignIn, signUp, confirmSignUp, resendSignUpCode,
  resetPassword, confirmResetPassword, updatePassword,
  deleteUser, signOut, getCurrentUser, fetchUserAttributes,
  fetchAuthSession, AuthError
} from 'aws-amplify/auth';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Amplify } from 'aws-amplify';

//Cognito Configuration
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.EXPO_PUBLIC_USER_POOL_ID!,
      userPoolClientId: process.env.EXPO_PUBLIC_USER_POOL_CLIENT_ID!,
      signUpVerificationMethod: 'link',
      loginWith: {
        email: true,
        username: false
      }
    }
  }
});

interface Credentials {
  accessToken: string;
  idToken: string;
  refreshToken: string;
  sub: string | undefined;
}

const AUTO_LOGOUT_TIME = 30 * 60 * 1000; // 30 minutes in milliseconds
let autoLogoutTimer: NodeJS.Timeout | null = null;

const CognitoAuth = {
  error: null as Error | null,
  success: false,
  resetCodeSent: false,
  confirmUser: false,
  loggedIn: false,

  initialize() {
    this.fetchCurrentAuthSession();
  },

  async startAutoLogoutTimer() {
    if (autoLogoutTimer) {
      clearTimeout(autoLogoutTimer);
    }

    autoLogoutTimer = setTimeout(async () => {
      try {
        await this.signOutLocally();
        console.log('Auto logout executed');
      } catch (err) {
        console.error('Auto logout error:', err);
      }
    }, AUTO_LOGOUT_TIME);
  },

  async resetAutoLogoutTimer() {
    await this.startAutoLogoutTimer();
  },

  clearAutoLogoutTimer() {
    if (autoLogoutTimer) {
      clearTimeout(autoLogoutTimer);
      autoLogoutTimer = null;
    }
  },

  async fetchCurrentAuthSession(): Promise<void> {
    try {
      const { tokens } = await fetchAuthSession();
      if (tokens?.accessToken && tokens?.idToken) {
        await this.setCredentials({
          accessToken: tokens.accessToken.toString(),
          idToken: tokens.idToken.toString(),
          refreshToken: '',
          sub: tokens.idToken.payload.sub
        });
        this.loggedIn = true;
        await this.startAutoLogoutTimer();
      } else {
        this.loggedIn = false;
      }
      this.confirmUser = false;
    } catch (err) {
      console.error('Error fetching session:', err);
      this.error = err as Error;
      this.loggedIn = false;
    }
  },

  async getCurrentUser() {
    try {
      const currentUser = await getCurrentUser();
      return currentUser;
    } catch (err) {
      console.log('No current user found');
      return null;
    }
  },

  async signUp(
    username: string,
    password: string,
    email: string,
    firstName: string,
    lastName: string,
    handicap: string
  ): Promise<void> {
    try {
      const result = await signUp({
        username,
        password,
        options: {
          userAttributes: {
            email,
            'custom:first': firstName,
            'custom:last': lastName,
            'custom:handicap': handicap,
          }
        }
      });

      if (!result.isSignUpComplete) {
        this.confirmUser = true;
      }
    } catch (err) {
      console.error('Sign up error:', err);
      this.error = err as Error;
      throw this.error;
    }
  },

  async confirmSignUp(username: string, confirmationCode: string): Promise<void> {
    try {
      await confirmSignUp({
        username,
        confirmationCode
      });
      this.confirmUser = false;
    } catch (err) {
      console.error('Confirm sign up error:', err);
      this.error = err as Error;
      throw this.error;
    }
  },

  async signIn(username: string, password: string): Promise<void> {
    try {
      if (!username || !password) {
        throw new Error('Username and password are required');
      }

      console.log('Starting sign in process...', { username });

      // Check for existing session and sign out if necessary
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          console.log('Current user found:', currentUser);
          await this.signOutLocally();
        }
      } catch (e) {
        console.log('No current user');
      }

      const signInResult = await amplifySignIn({
        username,
        password,
        options: {
          authFlowType: 'USER_PASSWORD_AUTH'
        }
      });

      console.log('Sign in result:', JSON.stringify(signInResult, null, 2));

      if (signInResult.isSignedIn) {
        const session = await fetchAuthSession();
        console.log('Session obtained:', {
          hasTokens: !!session.tokens,
          isValid: session.tokens?.accessToken ? true : false
        });

        this.loggedIn = true;
        await this.fetchCurrentAuthSession();
        await this.startAutoLogoutTimer();
      } else if (signInResult.nextStep) {
        console.log('Additional step required:', signInResult.nextStep.signInStep);
        
        switch (signInResult.nextStep.signInStep) {
          case 'CONFIRM_SIGN_UP':
            this.confirmUser = true;
            break;
          case 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED':
            throw new Error('Password change required');
          default:
            throw new Error(`Unexpected auth step: ${signInResult.nextStep.signInStep}`);
        }
      }

    } catch (err: any) {
      console.error('Detailed sign in error:', {
        name: err.name,
        message: err.message,
        code: err.code,
        stack: err.stack
      });

      if (err instanceof AuthError) {
        switch (err.name) {
          case 'UserNotConfirmedException':
            this.confirmUser = true;
            this.error = new Error('Please confirm your account');
            break;
          case 'NotAuthorizedException':
            this.error = new Error('Incorrect username or password');
            break;
          case 'UserNotFoundException':
            this.error = new Error('User does not exist');
            break;
          case 'InvalidParameterException':
            this.error = new Error('Invalid username or password format');
            break;
          case 'TooManyRequestsException':
            this.error = new Error('Too many attempts. Please try again later');
            break;
          default:
            this.error = new Error(`Authentication error: ${err.message}`);
        }
      } else {
        this.error = new Error(`Sign in failed: ${err.message}`);
      }

      this.loggedIn = false;
      throw this.error;
    }
  },

  async resendCode(username: string): Promise<void> {
    try {
      await resendSignUpCode({ username });
      this.resetCodeSent = true;
    } catch (err) {
      console.error('Resend code error:', err);
      this.error = err as Error;
      throw this.error;
    }
  },

  async resetPassword(username: string): Promise<void> {
    try {
      await resetPassword({ username });
      this.resetCodeSent = true;
    } catch (err) {
      console.error('Reset password error:', err);
      this.error = err as Error;
      throw this.error;
    }
  },

  async confirmResetPassword(
    username: string,
    newPassword: string,
    confirmationCode: string
  ): Promise<void> {
    try {
      await confirmResetPassword({
        username,
        newPassword,
        confirmationCode
      });
      this.success = true;
    } catch (err) {
      console.error('Confirm reset password error:', err);
      this.error = err as Error;
      throw this.error;
    }
  },

  async updatePassword(oldPassword: string, newPassword: string): Promise<void> {
    try {
      await updatePassword({
        oldPassword,
        newPassword
      });
      this.success = true;
    } catch (err) {
      console.error('Change password error:', err);
      this.error = err as Error;
      throw this.error;
    }
  },

  async deleteUser(): Promise<void> {
    try {
      await deleteUser();
      await this.signOutLocally();
    } catch (err) {
      console.error('Delete user error:', err);
      this.error = err as Error;
      throw this.error;
    }
  },

  async signOutLocally(): Promise<void> {
    try {
      this.clearAutoLogoutTimer();
      await signOut();
      this.loggedIn = false;
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('idToken');
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('sub');
    } catch (err) {
      console.error('Sign out error:', err);
      this.error = err as Error;
      throw this.error;
    }
  },

  async setCredentials({ accessToken, idToken, refreshToken, sub }: Credentials): Promise<void> {
    try {
      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('idToken', idToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      await AsyncStorage.setItem('sub', `${sub || "undefined"}`);
    } catch (error) {
      console.error('Error saving credentials:', error);
      throw error;
    }
  },

  async getCredentials(): Promise<Credentials | null> {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const idToken = await AsyncStorage.getItem('idToken');
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      const sub = await AsyncStorage.getItem('sub');

      if (accessToken && idToken && refreshToken && sub) {
        return { accessToken, idToken, refreshToken, sub };
      }
      return null;
    } catch (error) {
      console.error('Error getting credentials:', error);
      return null;
    }
  },
};

export default CognitoAuth;
