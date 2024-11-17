import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";
import { Ionicons } from '@expo/vector-icons'; // For eye icon
import { fetchRequestToken, validateWithLogin, createSession } from "../services/api";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false); // For toggling password visibility
  const [loading, setLoading] = useState(false);
  const [boxAnimation] = useState(new Animated.Value(0));
  const [buttonAnimation] = useState(new Animated.Value(0));
  const router = useRouter();
  const { login } = useAuth();

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

  //Handle Login
  const handleLogin = async () => {
    //User has to enter username and Password to proceed
    if (!username || !password) {
      alert("Please enter both username and password");
      return;
    }

    try {
      setLoading(true);
      await login(username, password);
     // alert("Login successful!");
      router.push("/screens/dashboard");
    } catch (error: any) {
      console.error("Login error:", error.message);
      alert("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.header}>CineConnect</Text>
      <Animated.View
        style={[
          styles.overlay,
          { transform: [{ scale: boxAnimation }] }, // Scale animation
        ]}
      >
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#888"
          value={username}
          onChangeText={setUsername}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, styles.passwordInput]}
            placeholder="Password"
            placeholderTextColor="#888"
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setPasswordVisible(!passwordVisible)}
          >
            <Ionicons
              name={passwordVisible ? "eye" : "eye-off"}
              size={20}
              color="#888"
            />
          </TouchableOpacity>
        </View>
        <Animated.View
          style={[
            styles.buttonWrapper,
            {
              opacity: buttonAnimation,
              transform: [{ scale: buttonAnimation }],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

//Stylesheet for Login Screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1F1B24",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FF6F61",
    textAlign: "center",
    marginBottom: 30,
  },
  overlay: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#2D2B36",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  input: {
    backgroundColor: "#3E3C47",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    color: "#FFFFFF",
    fontSize: 16,
  },
  passwordContainer: {
    position: "relative",
  },
  passwordInput: {
    paddingRight: 40, 
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: 15,
  },
  buttonWrapper: {
    marginTop: 15,
  },
  button: {
    backgroundColor: "#FF6F61",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default LoginScreen;
