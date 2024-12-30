import { Movie, TVShow } from '@/types'

interface TMDBResponse<T> {
  results: T[]
  page: number
  total_pages: number
  total_results: number
}

// Vérification des variables d'environnement
const envApiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const envBaseUrl = process.env.NEXT_PUBLIC_TMDB_API_BASE_URL;

if (!envApiKey || !envBaseUrl) {
  throw new Error('TMDB environment variables are not properly configured');
}

// Définition des constantes après vérification
const TMDB_BASE_URL: string = envBaseUrl;
const TMDB_API_KEY: string = envApiKey;
const ANIMATION_GENRE_ID = 16;

class TMDBClient {
  private async fetchFromTMDB<T>(endpoint: string, additionalParams: Record<string, string> = {}): Promise<TMDBResponse<T>> {
    const params = new URLSearchParams();
    
    // Ajout des paramètres de base
    params.append('api_key', TMDB_API_KEY);
    params.append('language', 'fr-FR');
    
    // Ajout des paramètres additionnels
    Object.entries(additionalParams).forEach(([key, value]) => {
      params.append(key, value);
    });

    const url = `${TMDB_BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}${params.toString()}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch data from TMDB');
    }
    return response.json();
  }

  async getPopularAnime(): Promise<TVShow[]> {
    const params = {
      with_genres: ANIMATION_GENRE_ID.toString(),
      sort_by: 'popularity.desc'
    };
    const data = await this.fetchFromTMDB<TVShow>('/discover/tv', params);
    return data.results;
  }

  async getTrendingAnime(): Promise<TVShow[]> {
    const params = {
      with_genres: ANIMATION_GENRE_ID.toString()
    };
    const data = await this.fetchFromTMDB<TVShow>('/trending/tv/week', params);
    return data.results;
  }

  async getTopRatedAnime(): Promise<TVShow[]> {
    const params = {
      with_genres: ANIMATION_GENRE_ID.toString(),
      sort_by: 'vote_average.desc',
      'vote_count.gte': '200'
    };
    const data = await this.fetchFromTMDB<TVShow>('/discover/tv', params);
    return data.results;
  }

  async getNewAnime(): Promise<TVShow[]> {
    const params = {
      with_genres: ANIMATION_GENRE_ID.toString(),
      sort_by: 'first_air_date.desc'
    };
    const data = await this.fetchFromTMDB<TVShow>('/discover/tv', params);
    return data.results;
  }

  async getTrendingMovies(page = 1): Promise<TMDBResponse<Movie>> {
    const params = {
      page: page.toString()
    };
    return this.fetchFromTMDB<Movie>('/trending/movie/week', params);
  }

  async getTrendingTVShows(page = 1): Promise<TMDBResponse<TVShow>> {
    const params = {
      page: page.toString()
    };
    return this.fetchFromTMDB<TVShow>('/trending/tv/week', params);
  }

  async getMovieDetails(id: number): Promise<Movie> {
    const data = await this.fetchFromTMDB<Movie>(`/movie/${id}`);
    return data.results[0];
  }

  async getTVShowDetails(id: number): Promise<TVShow> {
    const data = await this.fetchFromTMDB<TVShow>(`/tv/${id}`);
    return data.results[0];
  }

  async searchMovies(query: string, page = 1): Promise<TMDBResponse<Movie>> {
    const params = {
      query,
      page: page.toString()
    };
    return this.fetchFromTMDB<Movie>('/search/movie', params);
  }

  async searchTVShows(query: string, page = 1): Promise<TMDBResponse<TVShow>> {
    const params = {
      query,
      page: page.toString()
    };
    return this.fetchFromTMDB<TVShow>('/search/tv', params);
  }
}

export const tmdbClient = new TMDBClient(); 