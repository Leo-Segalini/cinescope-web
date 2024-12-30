import { Movie, TVShow } from '@/types'
import { TMDB_CONFIG } from '@/config/tmdb'

interface TMDBResponse<T> {
  results: T[]
  page: number
  total_pages: number
  total_results: number
}

const TMDB_BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const ANIMATION_GENRE_ID = 16;

class TMDBClient {
  private async fetchFromTMDB(endpoint: string) {
    const response = await fetch(
      `${TMDB_BASE_URL}${endpoint}?api_key=${TMDB_API_KEY}&language=fr-FR`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch data from TMDB');
    }
    return response.json();
  }

  async getPopularAnime() {
    const data = await this.fetchFromTMDB(
      `/discover/tv?with_genres=${ANIMATION_GENRE_ID}&sort_by=popularity.desc`
    );
    return data.results;
  }

  async getTrendingAnime() {
    const data = await this.fetchFromTMDB(
      `/trending/tv/week?with_genres=${ANIMATION_GENRE_ID}`
    );
    return data.results;
  }

  async getTopRatedAnime() {
    const data = await this.fetchFromTMDB(
      `/discover/tv?with_genres=${ANIMATION_GENRE_ID}&sort_by=vote_average.desc&vote_count.gte=200`
    );
    return data.results;
  }

  async getNewAnime() {
    const data = await this.fetchFromTMDB(
      `/discover/tv?with_genres=${ANIMATION_GENRE_ID}&sort_by=first_air_date.desc`
    );
    return data.results;
  }

  async getTrendingMovies(page = 1) {
    const params = {
      page: page.toString(),
    }

    return this.fetchFromTMDB<Movie>('/trending/movie/week', params)
  }

  async getTrendingTVShows(page = 1) {
    const params = {
      page: page.toString(),
    }

    return this.fetchFromTMDB<TVShow>('/trending/tv/week', params)
  }

  async getMovieDetails(id: number) {
    return this.fetchFromTMDB<Movie>(`/movie/${id}`)
  }

  async getTVShowDetails(id: number) {
    return this.fetchFromTMDB<TVShow>(`/tv/${id}`)
  }

  async searchMovies(query: string, page = 1) {
    const params = {
      query,
      page: page.toString(),
    }

    return this.fetchFromTMDB<Movie>('/search/movie', params)
  }

  async searchTVShows(query: string, page = 1) {
    const params = {
      query,
      page: page.toString(),
    }

    return this.fetchFromTMDB<TVShow>('/search/tv', params)
  }
}

export const tmdbClient = new TMDBClient(); 