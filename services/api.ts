import { TMDB_API_KEY, TMDB_BEARER_TOKEN } from '../constants/constants';

const BASE_URL = 'https://api.themoviedb.org/3';

// Define the API Client function
export const apiClient = async (
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body: Record<string, any> | null = null
) => {
  const headers = {
    Authorization: `Bearer ${TMDB_BEARER_TOKEN}`,
    'Content-Type': 'application/json',
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.status_message || 'Something went wrong');
  }

  return response.json();
};

// Fetch a new request token
export const fetchRequestToken = async (): Promise<{ request_token: string }> => {
  return apiClient('/authentication/token/new');
};

// Validate the request token with login credentials
export const validateWithLogin = async (
  username: string,
  password: string,
  requestToken: string
): Promise<{ success: boolean; request_token: string }> => {
  return apiClient('/authentication/token/validate_with_login', 'POST', {
    username,
    password,
    request_token: requestToken,
  });
};

// Create a new session
export const createSession = async (
  requestToken: string
): Promise<{ success: boolean; session_id: string }> => {
  return apiClient('/authentication/session/new', 'POST', {
    request_token: requestToken,
  });
};

//Fetch Account details like user name and account id
export const fetchAccountDetails = async (
    sessionId: string
  ): Promise<{ id: number; name: string; username: string }> => {
    return apiClient(`/account?session_id=${sessionId}`, 'GET');
  };

  //By passing session id get user details 
  export const fetchPersonDetails = async (
    sessionId: Number
  ): Promise<{ id: number; name: string; username: string }> => {
    return apiClient(`/person?person_id=${sessionId}`, 'GET');
  };

  //Pass Movie ID param - to get movie details
  export const fetchMovieDetails = async (movieId: number) => {
    const response = await apiClient(`/movie/${movieId}`, 'GET');
    return response;
  };
  
  //Pass Movie ID param - to get movie reviews
  export const fetchMovieReviews = async (movieId: number) => {
    const response = await apiClient(`/movie/${movieId}/reviews`, 'GET');
    return response;
  };
  
  //Pass Movie ID param - to get movie rating
  export const postMovieRating = async (movieId: number, rating: number) => {
    const response = await apiClient(`/movie/${movieId}/rating`, 'POST', {
      value: rating,
    });
    return response;
  };
  
  //Pass Movie ID param - to delete your movie rating 
  export const deleteMovieRating = async (movieId: number) => {
    const response = await apiClient(`/movie/${movieId}/rating`, 'DELETE');
    return response;
  };
  
  //Petch Popular Movies
  export const fetchPopularMovies = async (
    page: number = 1,
    language: string = 'en-US'
  ) => {
    const params = new URLSearchParams({
      include_adult: 'false',
      include_video: 'false',
      language,
      page: page.toString(),
      sort_by: 'popularity.desc',
    });
  
    return await apiClient(`/discover/movie?${params.toString()}`, 'GET');
  };

