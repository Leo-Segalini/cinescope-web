import { Movie, TVShow } from '@/types'

interface TMDBResponse<T> {
  results: T[]
  page: number
  total_pages: number
  total_results: number
}

const TMDB_BASE_URL = process.env.NEXT_PUBLIC_TMDB_API_BASE_URL;
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

if (!TMDB_BASE_URL || !TMDB_API_KEY) {
  throw new Error('TMDB environment variables are not properly configured');
}

const ANIMATION_GENRE_ID = 16;

class TMDBClient {
  private async fetchFromTMDB<T>(endpoint: string, additionalParams: Record<string, string> = {}): Promise<TMDBResponse<T>> {
    const params = new URLSearchParams({
      api_key: TMDB_API_KEY,
      language: 'fr-FR',
      ...additionalParams
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