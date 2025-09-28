'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  UserCredential
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

interface AuthContextType {
  currentUser: User | null;
  signup: (email: string, password: string) => Promise<UserCredential>;
  login: (email: string, password: string) => Promise<UserCredential>;
  signInWithGoogle: () => Promise<UserCredential>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  function signup(email: string, password: string) {
    if (typeof window === 'undefined') {
      throw new Error('Auth functions can only be called in browser environment');
    }
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email: string, password: string) {
    if (typeof window === 'undefined') {
      throw new Error('Auth functions can only be called in browser environment');
    }
    return signInWithEmailAndPassword(auth, email, password);
  }

  function signInWithGoogle() {
    if (typeof window === 'undefined') {
      throw new Error('Auth functions can only be called in browser environment');
    }
    
    // Use signInWithRedirect for better COOP compliance
    return signInWithPopup(auth, googleProvider).catch((error) => {
      // If popup fails due to COOP, fall back to redirect
      if (error.code === 'auth/popup-blocked' || error.message.includes('Cross-Origin-Opener-Policy')) {
        return signInWithRedirect(auth, googleProvider);
      }
      throw error;
    });
  }

  function logout() {
    if (typeof window === 'undefined') {
      throw new Error('Auth functions can only be called in browser environment');
    }
    return signOut(auth);
  }

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    // Handle redirect result for Google sign-in
    getRedirectResult(auth).then((result) => {
      if (result) {
      }
    }).catch((error) => {
    });

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    signInWithGoogle,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 