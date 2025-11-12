import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/auth';
import { storageService } from '../services/storage';
import { apiService } from '../services/api';

type User = {
  id: string;
  name: string;
  email: string;
  photo?: string;
};

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    // Start auto-sync if user is authenticated
    if (isAuthenticated) {
      apiService.startAutoSync();
    } else {
      apiService.stopAutoSync();
    }

    return () => {
      // Cleanup on unmount
      apiService.stopAutoSync();
    };
  }, [isAuthenticated]);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const authenticated = await authService.isAuthenticated();
      if (authenticated) {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          setUser({
            id: currentUser.user.id,
            name: currentUser.user.name || '',
            email: currentUser.user.email || '',
            photo: currentUser.user.photo || undefined,
          });
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      console.error('Auth status check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async () => {
    try {
      setLoading(true);
      const result = await authService.signInWithGoogle();
      setUser({
        id: result.user.id,
        name: result.user.name || '',
        email: result.user.email || '',
        photo: result.user.photo || undefined,
      });
      setIsAuthenticated(true);
      
      // Start auto-sync after successful login
      apiService.startAutoSync();
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await authService.signOut();
      setUser(null);
      setIsAuthenticated(false);
      
      // Stop auto-sync on logout
      apiService.stopAutoSync();
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

