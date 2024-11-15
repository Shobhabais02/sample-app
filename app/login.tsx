import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';

const AnimatedLoginScreen = ({ onLogin }: { onLogin: () => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [boxAnimation] = useState(new Animated.Value(0));
  const [buttonAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    // Animate the login box
    Animated.timing(boxAnimation, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Animate the login button after a delay
    Animated.timing(buttonAnimation, {
      toValue: 1,
      duration: 600,
      delay: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.appName}>CineConnect</Text>
      <Animated.View
        style={[
          styles.overlay,
          { transform: [{ scale: boxAnimation }] }, // Scale animation
        ]}
      >
        <Text style={styles.loginHeader}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#888"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Animated.View
          style={[
            styles.buttonWrapper,
            { opacity: buttonAnimation, transform: [{ scale: buttonAnimation }] },
          ]}
        >
          <TouchableOpacity style={styles.button} onPress={onLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F1B24', // Dark cinematic theme
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FF6F61', // Highlighted theme color
    textAlign: 'center',
    marginBottom: 30,
  },
  overlay: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#2D2B36',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8, // For Android shadow
  },
  loginHeader: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#3E3C47',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    color: '#FFFFFF',
    fontSize: 16,
  },
  buttonWrapper: {
    marginTop: 15,
  },
  button: {
    backgroundColor: '#FF6F61',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AnimatedLoginScreen;
