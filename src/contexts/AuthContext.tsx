// src/contexts/AuthContext.tsx
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
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Sign up with email/password
  const signup = (email: string, password: string) => createUserWithEmailAndPassword(auth, email, password);

  // Log in with email/password
  const login = (email: string, password: string) => signInWithEmailAndPassword(auth, email, password);

  // Google Sign-In
  const signInWithGoogle = () => {
    return signInWithPopup(auth, googleProvider).catch((error) => {
      if (error.code === 'auth/popup-blocked' || error.message.includes('Cross-Origin-Opener-Policy')) {
        return signInWithRedirect(auth, googleProvider);
      }
      throw error;
    });
  };

  // Log out
  const logout = () => signOut(auth);

  // Track auth state
  useEffect(() => {
    if (typeof window === 'undefined') return setLoading(false);

    // Optional: handle Google redirect result
    getRedirectResult(auth).catch(() => {});

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, signup, login, signInWithGoogle, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
