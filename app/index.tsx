import React ,{useEffect}from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Dashboard() {
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const sessionId = await AsyncStorage.getItem('session_id');
        if (!sessionId) {
       
          router.replace('/login'); 
        }
        else{
          router.replace('/screens/dashboard'); 
        }
      } catch (error) {
        console.error('Error checking session ID:', error);
      }
    };

    checkSession();
  }, [router]);

  return (
  <></>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
