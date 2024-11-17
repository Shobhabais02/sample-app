import { Stack } from 'expo-router';
import React from 'react';
import { AuthProvider } from '../context/AuthContext';
import store from '../redux/store';
import { Provider } from 'react-redux';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Provider store={store}>
      <Stack screenOptions={{ headerShown: false }} />
      </Provider>
    </AuthProvider>
  );
}
