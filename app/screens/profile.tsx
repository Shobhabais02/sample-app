import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { fetchAccountDetails } from '../../services/api'; 
import { commonBackgroundColor } from '../../constants/Colors';

const ProfileScreen = () => {
  const [profileDetails, setProfileDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  //Fetch User details on load
  useEffect(() => {
    const fetchProfileDetails = async () => {
      try {
        setLoading(true);

        // Fetch the session ID from AsyncStorage
        const sessionId = await AsyncStorage.getItem('session_id');
        if (!sessionId) {
          throw new Error('Session ID not found. Please log in again.');
        }

        // Fetch account details using the session ID
        const accountDetails = await fetchAccountDetails(sessionId);
        console.log('Account Details:', accountDetails);
        setProfileDetails(accountDetails);
      } catch (error: any) {
        console.error('Error fetching profile details:', error);
        alert(error.message || 'Failed to fetch profile details');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileDetails();
  }, []);

  //Loader
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  //Load appropriate message when user data cannot be fetched
  if (!profileDetails) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load profile details.</Text>
      </View>
    );
  }

  const { id, name, username, avatar } = profileDetails;

  // Function to mask User ID
  const maskId = (id: number) => {
    const idStr = id.toString();
    if (idStr.length <= 4) return idStr; 
    return `${idStr.slice(0, 2)}***${idStr.slice(-2)}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {avatar?.tmdb?.avatar_path ? (
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${avatar.tmdb.avatar_path}`,
            }}
            style={styles.avatar}
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarPlaceholderText}>{name?.charAt(0)}</Text>
          </View>
        )}

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{name || '---'}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Username:</Text>
          <Text style={styles.value}>{username || 'N/A'}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>ID:</Text>
          <Text style={styles.value}>{maskId(id) || 'N/A'}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

//Stylesheet for Profile screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: commonBackgroundColor,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#1F1B24',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    fontSize: 24,
    color: '#FF6F61',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FF0000',
    fontSize: 16,
  },
  contentContainer: {
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarPlaceholderText: {
    fontSize: 40,
    color: '#fff',
    fontWeight: 'bold',
  },
  infoContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
  },
  value: {
    fontSize: 18,
    color: '#000',
  },
});

export default ProfileScreen;
