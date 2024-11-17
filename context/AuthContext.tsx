import React, { createContext, useState, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchRequestToken, validateWithLogin, createSession } from '../services/api';
import { useRouter } from 'expo-router';

// Define the AuthContext type
type AuthContextType = {
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
};

// Create the AuthContext with a default value of `null`
const AuthContext = createContext<AuthContextType | null>(null);

// Props type for the AuthProvider component
type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const login = async (username: string, password: string) => {
    try {
      setLoading(true);

      // Step 1: Fetch request token
      const { request_token } = await fetchRequestToken();

      // Step 2: Validate request token with username and password
      await validateWithLogin(username, password, request_token);

      // Step 3: Create a session
      const { session_id } = await createSession(request_token);

      // Store session ID securely
      await AsyncStorage.setItem('session_id', session_id);
      setIsLoggedIn(true);

      // Navigate to Dashboard
      router.push('/screens/dashboard');
    } catch (error: any) {
      console.error('Login Error:', error.message);
      alert(error.message || 'Invalid login credentials');
    } finally {
      setLoading(false);
    }
  };

  //Logout the user and remove Session id from Storage
  const logout = async () => {
    await AsyncStorage.removeItem('session_id');
    setIsLoggedIn(false);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
