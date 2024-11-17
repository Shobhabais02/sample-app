import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiClient } from '../../services/api'; 

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
}

interface MovieState {
  movies: Movie[];
  filteredMovies: Movie[];
  searchQuery: string;
  watchlist: Movie[];
  selectedMovieId: number ; 
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: MovieState = {
  movies: [],
  filteredMovies: [],
  searchQuery: '',
  watchlist: [],
  selectedMovieId: -1, 
  status: 'idle',
};

//To fetch Trending movies from the API
export const fetchMovies = createAsyncThunk(
    'movies/fetchTrendingMovies',
    async ({ timeWindow = 'day', language = 'en-US' }: { timeWindow?: string; language?: string }) => {
      const params = new URLSearchParams({
        language, 
      });
  
      const endpoint = `/trending/movie/${timeWindow}?${params.toString()}`;
      const response = await apiClient(endpoint, 'GET');
      return response.results;
    }
  );

const movieSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
      state.filteredMovies = state.movies.filter((movie) =>
        movie.title.toLowerCase().includes(action.payload.toLowerCase())
      );
    },
    addToWatchlist(state, action: PayloadAction<Movie>) {
      if (!state.watchlist.some((movie) => movie.id === action.payload.id)) {
        state.watchlist.push(action.payload);
      }
    },
    removeFromWatchlist(state, action: PayloadAction<number>) {
      state.watchlist = state.watchlist.filter(
        (movie) => movie.id !== action.payload
      );
    },
    setSelectedMovieId(state, action: PayloadAction<number | null>) {
      state.selectedMovieId = action.payload?action.payload:-1; 
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.movies = action.payload;
        state.filteredMovies = action.payload;
      })
      .addCase(fetchMovies.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const {
  setSearchQuery,
  addToWatchlist,
  removeFromWatchlist,
  setSelectedMovieId, // Export the new action
} = movieSlice.actions;

export default movieSlice.reducer;
