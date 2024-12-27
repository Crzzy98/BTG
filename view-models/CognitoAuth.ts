import { 
    signIn, signUp, confirmSignUp, resendSignUpCode, 
    resetPassword, confirmResetPassword, updatePassword, 
    deleteUser, signOut, getCurrentUser, fetchUserAttributes,
    fetchAuthSession
  } from 'aws-amplify/auth';
  
  interface Credentials {
    accessToken: string;
    idToken: string;
    refreshToken: string;
    sub: string | undefined;
  }
  
  const CognitoAuth = {
    error: null as Error | null,
    success: false,
    resetCodeSent: false,
    confirmUser: false,
    loggedIn: false,
  
    initialize() {
      this.fetchCurrentAuthSession();
    },
  
    async fetchCurrentAuthSession(): Promise<void> {
        try {
          const { tokens } = await fetchAuthSession();
          
          if (tokens?.accessToken && tokens?.idToken ) {
            this.setCredentials({
              accessToken: tokens.accessToken.toString(),
              idToken: tokens.idToken.toString(),
              refreshToken: '',
              sub: tokens.idToken.payload.sub
            });
            this.loggedIn = true;
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
      }
    },
  
    async confirmSignUp(username: string, confirmationCode: string): Promise<void> {
      try {
        await confirmSignUp({
          username,
          confirmationCode
        });
        // Note: In v6, you need to call signIn separately after confirmation
        this.confirmUser = false;
      } catch (err) {
        console.error('Confirm sign up error:', err);
        this.error = err as Error;
      }
    },
  
    async signIn(username: string, password: string): Promise<void> {
      try {
        const result = await signIn({
          username,
          password
        });
  
        if (result.nextStep.signInStep === 'CONFIRM_SIGN_UP') {
          this.confirmUser = true;
        } else {
          await this.fetchCurrentAuthSession();
          this.loggedIn = true;
        }
      } catch (err) {
        console.error('Sign in error:', err);
        this.error = err as Error;
      }
    },
  
    async resendCode(username: string): Promise<void> {
      try {
        await resendSignUpCode({ username });
        this.resetCodeSent = true;
      } catch (err) {
        console.error('Resend code error:', err);
        this.error = err as Error;
      }
    },
  
    async resetPassword(username: string): Promise<void> {
      try {
        await resetPassword({ username });
        this.resetCodeSent = true;
      } catch (err) {
        console.error('Reset password error:', err);
        this.error = err as Error;
      }
    },
  
    async confirmResetPassword(username: string, newPassword: string, confirmationCode: string): Promise<void> {
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
      }
    },
  
    async deleteUser(): Promise<void> {
      try {
        await deleteUser();
        await this.signOutLocally();
      } catch (err) {
        console.error('Delete user error:', err);
        this.error = err as Error;
      }
    },
  
    async signOutLocally(): Promise<void> {
      try {
        await signOut();
        this.loggedIn = false;
      } catch (err) {
        console.error('Sign out error:', err);
        this.error = err as Error;
      }
    },
  
    setCredentials({ accessToken, idToken, refreshToken, sub }: Credentials): void {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('idToken', idToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('sub', `${sub || "undefined"}`);
    },
  
    getCredentials(): Credentials | null {
      const accessToken = localStorage.getItem('accessToken');
      const idToken = localStorage.getItem('idToken');
      const refreshToken = localStorage.getItem('refreshToken');
      const sub = localStorage.getItem('sub');
  
      if (accessToken && idToken && refreshToken && sub) {
        return { accessToken, idToken, refreshToken, sub };
      }
  
      return null;
    },
  };
  
  export default CognitoAuth;
  