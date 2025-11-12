import { storageService } from './storage';

// Lazy load GoogleSignin - it's a native module and won't work in Expo Go
let GoogleSignin: any = null;
let statusCodes: any = null;

try {
  const googleSigninModule = require('@react-native-google-signin/google-signin');
  GoogleSignin = googleSigninModule.GoogleSignin;
  statusCodes = googleSigninModule.statusCodes;
} catch (e) {
  console.warn('⚠️ GoogleSignin module not available (requires native build):', (e as Error).message);
}

// Lazy configuration - only configure when needed
let isConfigured = false;

const configureGoogleSignIn = () => {
  if (!GoogleSignin) {
    console.warn('GoogleSignin not available');
    return;
  }
  if (isConfigured) return;
  
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
  
  if (!webClientId) {
    console.warn('Google Sign-In: EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID is not set. Google Sign-In will not work.');
    return;
  }

  try {
    GoogleSignin.configure({
      webClientId: webClientId,
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });
    isConfigured = true;
  } catch (error) {
    console.error('Failed to configure Google Sign-In:', error);
  }
};

class AuthService {
  async signInWithGoogle(): Promise<{ user: any; token: string }> {
    try {
      if (!GoogleSignin) {
        throw new Error('Google Sign-In is not available. This feature requires a native build.');
      }
      configureGoogleSignIn();
      
      const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
      if (!webClientId) {
        throw new Error('Google Sign-In is not configured. Please set EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID in your environment variables.');
      }

      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      
      if (!userInfo.idToken) {
        throw new Error('No ID token received from Google');
      }

      // Get access token
      const tokens = await GoogleSignin.getTokens();
      
      // Save token to storage
      await storageService.saveUserToken(tokens.accessToken);

      return {
        user: userInfo.user,
        token: tokens.accessToken,
      };
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        throw new Error('Sign in was cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        throw new Error('Sign in is in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        throw new Error('Google Play Services not available');
      } else {
        throw error;
      }
    }
  }

  async signOut(): Promise<void> {
    try {
      if (!GoogleSignin) {
        await storageService.removeUserToken();
        await storageService.removeUserDetails();
        return;
      }
      const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
      if (webClientId) {
        configureGoogleSignIn();
        await GoogleSignin.signOut();
      }
      await storageService.removeUserToken();
      await storageService.removeUserDetails();
    } catch (error) {
      console.error('Sign out error:', error);
      // Don't throw error if Google Sign-In is not configured
      if (process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID) {
        throw error;
      }
    }
  }

  async getCurrentUser(): Promise<any | null> {
    try {
      if (!GoogleSignin) {
        return null;
      }
      const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
      if (!webClientId) {
        return null;
      }

      configureGoogleSignIn();
      const isSignedIn = await GoogleSignin.isSignedIn();
      if (isSignedIn) {
        return await GoogleSignin.getCurrentUser();
      }
      return null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await storageService.getUserToken();
    return !!token;
  }

  async refreshToken(): Promise<string | null> {
    try {
      if (!GoogleSignin) {
        return null;
      }
      const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
      if (!webClientId) {
        return null;
      }

      configureGoogleSignIn();
      const tokens = await GoogleSignin.getTokens();
      await storageService.saveUserToken(tokens.accessToken);
      return tokens.accessToken;
    } catch (error) {
      console.error('Token refresh error:', error);
      return null;
    }
  }
}

export const authService = new AuthService();

