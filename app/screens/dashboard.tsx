import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Image,
    Animated,
    Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import {
    setSearchQuery,
    fetchMovies,
    addToWatchlist,
    removeFromWatchlist,
} from '../../redux/slices/movieSlice';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { setSelectedMovieId } from '../../redux/slices/movieSlice';
import { commonBackgroundColor } from '../../constants/Colors';

const Dashboard = () => {
    const { logout } = useAuth();
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { filteredMovies, searchQuery, watchlist } = useSelector(
        (state: RootState) => state.movies
    );
    const [loading, setLoading] = useState(true);
    const [searchBoxHeight] = useState(new Animated.Value(60));
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            await dispatch(fetchMovies(1));
            setLoading(false);
        };
        fetchData();
    }, []);

    useEffect(() => {
        Animated.timing(searchBoxHeight, {
            toValue: loading ? 60 : 40,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, [loading]);

    //Searches the from movie list
    const handleSearch = (query: string) => {
        dispatch(setSearchQuery(query));
    };

    //Clear the entered text on search
    const handleClearSearch = () => {
        dispatch(setSearchQuery(''));
    };

    //Function to add movie to WatchList when clicked on +watchlist
    const handleAddToWatchlist = (movie: any) => {
        dispatch(addToWatchlist(movie));
    };

    //To handle remove the movie from Watch List
    const handleRemoveFromWatchlist = (movieId: number) => {
        dispatch(removeFromWatchlist(movieId));
    };

    //Function to navigate to Watch List
    const handleNavigateToWatchlist = () => {
        router.push('/screens/watchList');
    };

    //Navigates to profile screen 
    const handleProfileOption = () => {
        setShowProfileMenu(false);
        router.push('/screens/profile');
    };

    /* handles the user click function of Movie Item 
       Navigates to movie details Screen 
       */
    const handleMovieClick = (movieId: number) => {
        dispatch(setSelectedMovieId(movieId));
        router.push('/screens/movieDetails');
    };

    const confirmLogout = () => {
        Alert.alert(
            'Confirm Logout',
            'Are you sure you want to log out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: () => {
                        logout();
                    },
                },
            ],
            { cancelable: true }
        );
    };

    const renderMovieItem = ({ item }: { item: any }) => {
        const isInWatchlist = watchlist.some((movie) => movie.id === item.id);
        return (
            <TouchableOpacity
                style={styles.movieItem}
                onPress={() => handleMovieClick(item.id)}
            >
                <Image
                    source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
                    style={styles.movieImage}
                />
                <View style={styles.movieInfo}>
                    <Text style={styles.movieTitle}>{item.title}</Text>
                    <Text style={styles.movieReleaseDate}>
                        Release Date: {item.release_date || 'N/A'}
                    </Text>
                </View>
                <TouchableOpacity
                    style={[
                        styles.watchlistButton,
                        isInWatchlist && styles.addedToWatchlistButton,
                    ]}
                    onPress={() =>
                        isInWatchlist
                            ? handleRemoveFromWatchlist(item.id)
                            : handleAddToWatchlist(item)
                    }
                >
                    <Text style={styles.watchlistButtonText}>
                        {isInWatchlist ? '✅ Watchlist' : '+ Watchlist'}
                    </Text>
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Dashboard</Text>
                <View style={styles.topRightMenu}>
                    <TouchableOpacity onPress={handleNavigateToWatchlist}>
                        <Text style={styles.menuItem}>Watchlist ({watchlist.length})</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setShowProfileMenu(!showProfileMenu)}
                        style={styles.profileIcon}
                    >
                        <Text style={styles.menuIconItem}>👤</Text>
                    </TouchableOpacity>
                    {showProfileMenu && (
                        <View style={styles.profileMenu}>
                            <TouchableOpacity onPress={handleProfileOption}>
                                <Text style={styles.menuIconItem}>Profile</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={confirmLogout}>
                                <Text style={styles.menuIconItem}>Logout</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
            <View style={styles.contentContainer}>
                <Animated.View style={{ height: searchBoxHeight }}>
                    <View style={styles.searchContainer}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search Movies"
                            value={searchQuery}
                            onChangeText={handleSearch}
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
                                <Text style={styles.clearButtonText}>X</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </Animated.View>
                <FlatList
                    data={filteredMovies}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderMovieItem}
                    ListEmptyComponent={<Text>No Movies Found</Text>}
                />
            </View>
        </View>
    );
};

//Style sheet for Dashboard Screen UI contents
const styles = StyleSheet.create({
    container:
    {
        flex: 1,
        backgroundColor: commonBackgroundColor
    },
    contentContainer: {
        flex: 1,
        backgroundColor: commonBackgroundColor,
        padding: 10,
    },
    header: {
        height: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#1F1B24',
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#444',
    },
    title: {
        fontSize: 26,
        color: 'white',
        fontWeight: 'bold',
    },
    topRightMenu:
    {
        flexDirection: 'row',
        alignItems: 'center'
    },
    profileIcon: {
        marginLeft: 15,
    },
    menuItem: {
        fontSize: 16,
        color: 'white',
        marginHorizontal: 10,
    },
    menuIconItem: {
        fontSize: 16,
        color: 'black',
        marginHorizontal: 10,
    },
    profileMenu: {
        position: 'absolute',
        top: 30,
        right: 10,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        elevation: 5,
        zIndex: 10,
    },
    searchContainer: {
        position: 'relative', 
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchInput: {
        flex: 1,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
        paddingRight: 35, 
    },
    clearButton: {
        position: 'absolute',
        right: 10, 
        justifyContent: 'center',
        alignItems: 'center',
        width: 30,
        height: '100%',
    },
    clearButtonText: {
        color: '#007BFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    movieItem:
    {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center'
    },
    movieImage:
    {
        width: 50,
        height: 75, 
        borderRadius: 4,
        marginRight: 10
    },
    movieInfo:
    {
        flex: 1
    },
    movieTitle:
    {
        fontSize: 18, fontWeight: 'bold'
    },
    movieReleaseDate:
    {
        fontSize: 14,
        color: '#666'
    },
    watchlistButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 6,
    },
    addedToWatchlistButton: {
        borderColor: 'green',
    },
    watchlistButtonText: {
        color: 'green',
        fontWeight: 'bold',
        fontSize: 10,
    },
});

export default Dashboard;
