import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { onAuthStateChange, signOut } from '../services/auth';
import { getUser } from '../services/database';
import type { User } from '../types/database';
import { db, isFirebaseInitialized } from '../lib/firebase';
import { enableNetwork, disableNetwork, waitForPendingWrites } from 'firebase/firestore';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: User | null;
  loading: boolean;
  sessionExpired: boolean;
  refreshSession: () => Promise<void>;
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;
  connectionError: string | null;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userProfile: null,
  loading: true,
  sessionExpired: false,
  refreshSession: async () => {},
  isOnline: navigator.onLine,
  setIsOnline: () => {},
  connectionError: null
});

const SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hour
const MAX_RETRIES = 5;
const RETRY_DELAY = 1000;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [lastActivity, setLastActivity] = useState(Date.now());

  const handleConnectionError = useCallback(async () => {
    if (retryCount >= MAX_RETRIES) {
      setConnectionError('Unable to connect. Please check your internet connection and try again.');
      return;
    }

    setRetryCount(prev => prev + 1);
    setConnectionError('Attempting to reconnect...');
    
    try {
      await enableNetwork(db);
      setConnectionError(null);
      setRetryCount(0);
    } catch (error) {
      setConnectionError('Connection failed. Retrying...');
      setTimeout(handleConnectionError, Math.min(RETRY_DELAY * Math.pow(2, retryCount), 10000));
    }
  }, [retryCount]);

  // Handle online/offline status
  useEffect(() => {
    if (!isFirebaseInitialized()) {
      setConnectionError('Firebase initialization failed. Please refresh the page.');
      return;
    }

    const handleOnline = async () => {
      setIsOnline(true);
      try {
        await enableNetwork(db);
        setConnectionError(null);
        setRetryCount(0);
      } catch (error) {
        handleConnectionError();
      }
    };

    const handleOffline = async () => {
      setIsOnline(false);
      setConnectionError('You are offline. Some features may be unavailable.');
      try {
        await waitForPendingWrites(db);
        await disableNetwork(db);
      } catch (error) {
        console.error('Error handling offline state:', error);
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (navigator.onLine) {
      handleOnline();
    } else {
      handleOffline();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [handleConnectionError]);

  // Activity monitoring
  useEffect(() => {
    const events = ['mousemove', 'keydown', 'click', 'touchstart', 'scroll'];
    const updateActivity = () => setLastActivity(Date.now());

    events.forEach(event => {
      window.addEventListener(event, updateActivity);
    });

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, updateActivity);
      });
    };
  }, []);

  // Session expiration check
  useEffect(() => {
    if (!currentUser) return;

    const interval = setInterval(() => {
      if (Date.now() - lastActivity >= SESSION_TIMEOUT) {
        setSessionExpired(true);
        signOut();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentUser, lastActivity]);

  // Auth state management
  useEffect(() => {
    let mounted = true;

    const unsubscribe = onAuthStateChange(async (user) => {
      if (!mounted) return;

      setCurrentUser(user);
      setSessionExpired(false);
      
      if (user) {
        try {
          const profile = await getUser(user.uid);
          if (mounted) {
            setUserProfile(profile);
            setLastActivity(Date.now());
          }
        } catch (error) {
          console.error('Error loading user profile:', error);
          signOut();
        }
      } else {
        setUserProfile(null);
      }
      
      if (mounted) {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const refreshSession = useCallback(async () => {
    if (!currentUser) return;
    
    try {
      const token = await currentUser.getIdToken(true);
      if (token) {
        setSessionExpired(false);
        setLastActivity(Date.now());
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
      setSessionExpired(true);
      signOut();
    }
  }, [currentUser]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider 
      value={{
        currentUser,
        userProfile,
        loading,
        sessionExpired,
        refreshSession,
        isOnline,
        setIsOnline,
        connectionError
      }}
    >
      {children}
      {connectionError && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg">
          {connectionError}
        </div>
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}