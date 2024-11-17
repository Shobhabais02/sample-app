import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { removeFromWatchlist } from '../../redux/slices/movieSlice';
import { useRouter } from 'expo-router';
import { commonBackgroundColor } from '../../constants/Colors';

const WatchList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { watchlist } = useSelector((state: RootState) => state.movies);

  const handleRemoveFromWatchlist = (movieId: number) => {
    dispatch(removeFromWatchlist(movieId));
  };

  const renderWatchlistItem = ({ item }: { item: any }) => (
    <View style={styles.watchlistItem}>
      {/* Movie Poster */}
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
        style={styles.movieImage}
      />
      {/* Movie Info */}
      <View style={styles.movieInfo}>
        <Text style={styles.movieTitle}>{item.title}</Text>
        <Text style={styles.movieReleaseDate}>
          Release Date: {item.release_date || 'N/A'}
        </Text>
      </View>
      {/* Delete Icon */}
      <TouchableOpacity
        onPress={() => handleRemoveFromWatchlist(item.id)}
        style={styles.deleteButton}
      >
        <Text style={styles.deleteButtonText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
       
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Watchlist</Text>
      </View>
      <View style={styles.contentContainer}>
      {watchlist.length === 0 ? (
        <Text style={styles.emptyText}>No movies in your watchlist</Text>
      ) : (
        <FlatList
          data={watchlist}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderWatchlistItem}
        />
      )}
      </View>
    </View>
  );
};

//Stylesheet for WatchList screen
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: commonBackgroundColor,
      padding: 0,
    },
    contentContainer: {
      flex: 1,
      backgroundColor: commonBackgroundColor,
      padding: 10,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
      backgroundColor: '#1F1B24',
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#444',
    },
    backButton: {
      marginRight: 15,
    },
    backButtonText: {
      fontSize:25, 
      color: '#FFFFFF', 
      fontWeight: 'bold',
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    emptyText: {
      textAlign: 'center',
      marginTop: 20,
      fontSize: 16,
      color: '#666',
    },
    watchlistItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#444',
      backgroundColor: '#2D2B36',
      borderRadius: 8,
      marginBottom: 10,
    },
    movieImage: {
      width: 50,
      height: 75,
      borderRadius: 4,
      marginRight: 10,
    },
    movieInfo: {
      flex: 1,
    },
    movieTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    movieReleaseDate: {
      fontSize: 14,
      color: '#AAAAAA',
    },
    deleteButton: {
      backgroundColor: '#FF6F61',
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    deleteButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
  
  export default WatchList;
  
