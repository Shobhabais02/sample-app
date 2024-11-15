import React, { createContext, useContext, useEffect, useState } from 'react';
 import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

type AuthContextType = {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const status = await AsyncStorage.getItem('isLoggedIn');
      if (status === 'true') {
        setIsLoggedIn(true);
        router.push('/'); // Redirect to Dashboard
      } else {
        router.push('/login'); // Redirect to Login
      }
    };

    checkLoginStatus();
  }, []);

  const login = async () => {
    await AsyncStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
    router.push('/'); // Navigate to Dashboard
  };

  const logout = async () => {
   await AsyncStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    router.push('/login'); // Navigate to Login
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
