import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {
  fetchMovieDetails,
  fetchMovieReviews,
  postMovieRating,
  deleteMovieRating,
} from '../../services/api';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useRouter } from 'expo-router';
import { commonBackgroundColor } from '../../constants/Colors';

const MovieDetailsScreen = () => {
  const movieId: number = useSelector(
    (state: RootState) => state.movies.selectedMovieId
  );
  const [movieDetails, setMovieDetails] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [newRating, setNewRating] = useState<string>('');
  const router = useRouter();

  //Fetch Movie details on useEffect
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const details = await fetchMovieDetails(movieId);
        const fetchedReviews = await fetchMovieReviews(movieId);
        setMovieDetails(details);
        setReviews(fetchedReviews.results || []);
        setUserRating(details.user_rating || null);
      } catch (error) {
        console.error('Error fetching movie data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [movieId]);

  //Submit user rating for the movie
  const handleAddRating = async () => {
    if (!newRating || isNaN(Number(newRating)) || Number(newRating) < 1 || Number(newRating) > 10) {
      alert('Please enter a valid rating between 1 and 10.');
      return;
    }
    try {
      await postMovieRating(movieId, Number(newRating));
      alert('Rating added successfully!');
      setUserRating(Number(newRating));
      setNewRating('');
    } catch (error) {
      console.error('Error adding rating:', error);
      alert('Failed to add rating.');
    }
  };


  //Delete the submitted rating
  const handleDeleteRating = async () => {
    try {
      await deleteMovieRating(movieId);
      alert('Rating deleted successfully!');
      setUserRating(null);
    } catch (error) {
      console.error('Error deleting rating:', error);
      alert('Failed to delete rating.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (!movieDetails) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load movie details.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{movieDetails.title}</Text>
      </View>

      <ScrollView>
        {/* Movie Poster */}
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}` }}
          style={styles.poster}
        />

        {/* Movie Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.overview}>{movieDetails.overview}</Text>
          <Text style={styles.info}>Release Date: {movieDetails.release_date}</Text>
          <Text style={styles.info}>Average Rating: {movieDetails.vote_average} / 10</Text>
        </View>

        {/* User Rating Section */}
        <View style={styles.ratingContainer}>
          {userRating !== null ? (
            <View style={styles.userRating}>
              <Text style={styles.userRatingText}>Your Rating: {userRating} / 10</Text>
              <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteRating}>
                <Ionicons name="trash" size={20} color="#fff" />
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.addRatingContainer}>
              <TextInput
                style={styles.ratingInput}
                placeholder="Rate (1-10)"
                keyboardType="numeric"
                value={newRating}
                onChangeText={setNewRating}
              />
              <TouchableOpacity style={styles.addButton} onPress={handleAddRating}>
                <Ionicons name="checkmark" size={20} color="#fff" />
                <Text style={styles.addButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Reviews Section */}
        <Text style={styles.sectionTitle}>Reviews</Text>
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <View key={index} style={styles.review}>
              <View style={styles.reviewHeader}>
                <Ionicons name="person-circle" size={24} color="#007BFF" />
                <Text style={styles.reviewerName}>{review.author}</Text>
              </View>
              <Text style={styles.reviewContent}>{review.content}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noReviews}>No reviews available.</Text>
        )}
      </ScrollView>
    </View>
  );
};

//Style sheet for Movie DetailsScreen
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: commonBackgroundColor },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F1B24',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  backButton: {
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    textAlign:'left',
  },
  poster: {
    width: '100%',
    height: 400,
    resizeMode: 'contain', 
    marginBottom: 15,
    marginTop: 10,
  },
  detailsContainer: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
  },
  overview: { fontSize: 14, color: '#666', marginBottom: 10 },
  info: { fontSize: 12, color: '#888', marginBottom: 5 },
  ratingContainer: {
    marginVertical: 5,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  userRating: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  userRatingText: { fontSize: 16, color: '#007BFF' },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6F61',
    padding: 10,
    borderRadius: 5,
  },
  deleteButtonText: { marginLeft: 5, color: '#fff' },
  addRatingContainer: { flexDirection: 'row', alignItems: 'center' },
  ratingInput: { flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5 },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007BFF',
    padding: 10,
    marginLeft: 10,
    borderRadius: 5,
  },
  addButtonText: { marginLeft: 5, color: '#fff' },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F1B24',
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  review: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    marginHorizontal: 15,
  },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  reviewerName: { fontSize: 14, fontWeight: 'bold', marginLeft: 8, color: '#1F1B24' },
  reviewContent: { fontSize: 14, color: '#555' },
  noReviews: { fontSize: 14, color: '#888', textAlign: 'center', marginTop: 10 },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: '#FF0000', fontSize: 16 },
});

export default MovieDetailsScreen;
