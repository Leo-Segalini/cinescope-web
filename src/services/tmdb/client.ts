import type {
  Movie,
  TVShow,
  MovieDetails,
  TVShowDetails,
  PaginatedResponse,
  Genre,
  GenresResponse,
  Person,
  PersonDetails,
  MovieCredit,
  TVCredit,
} from '@/types/tmdb'
import { RateLimiter } from './utils/rateLimiter'
import { SearchCache } from './utils/searchCache'

const BASE_URL = process.env.NEXT_PUBLIC_TMDB_API_BASE_URL
const ACCESS_TOKEN = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number>
}

class TMDBClient {
  private rateLimiter = new RateLimiter(40, 10)
  private searchCache = new SearchCache<PaginatedResponse<Movie | TVShow | Person>>(100, 5)

  private async fetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    await this.rateLimiter.waitIfNeeded()
    const { params, ...init } = options
    const queryParams = params ? new URLSearchParams(params as Record<string, string>) : ''
    const url = `${BASE_URL}${endpoint}${params ? `?${queryParams}` : ''}`

    const response = await fetch(url, {
      ...init,
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        ...init.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`TMDB API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Films populaires
  async getPopularMovies(page = 1) {
    return this.fetch<PaginatedResponse<Movie>>('/movie/popular', {
      params: { page: page.toString() },
    })
  }

  // Films tendance
  async getTrendingMovies(timeWindow: 'day' | 'week' = 'week') {
    return this.fetch<PaginatedResponse<Movie>>(`/trending/movie/${timeWindow}`)
  }

  // Films les mieux notés
  async getTopRatedMovies(page = 1) {
    return this.fetch<PaginatedResponse<Movie>>('/movie/top_rated', {
      params: { page: page.toString() },
    })
  }

  // Films à venir
  async getUpcomingMovies(page = 1) {
    return this.fetch<PaginatedResponse<Movie>>('/movie/upcoming', {
      params: { page: page.toString() },
    })
  }

  // Séries populaires
  async getPopularTVShows(page = 1) {
    return this.fetch<PaginatedResponse<TVShow>>('/tv/popular', {
      params: { page: page.toString() },
    })
  }

  // Séries tendance
  async getTrendingTVShows(timeWindow: 'day' | 'week' = 'week') {
    return this.fetch<PaginatedResponse<TVShow>>(`/trending/tv/${timeWindow}`)
  }

  // Séries les mieux notées
  async getTopRatedTVShows(page = 1) {
    return this.fetch<PaginatedResponse<TVShow>>('/tv/top_rated', {
      params: { page: page.toString() },
    })
  }

  // Détails d'un film
  async getMovieDetails(id: number) {
    return this.fetch<MovieDetails>(`/movie/${id}`)
  }

  // Détails d'une série
  async getTVShowDetails(id: number) {
    return this.fetch<TVShowDetails>(`/tv/${id}`)
  }

  // Recherche multi (films, séries, personnes)
  async searchMulti(query: string, page = 1) {
    const cachedResults = this.searchCache.get(query, page)
    if (cachedResults) return cachedResults

    const results = await this.fetch<PaginatedResponse<Movie | TVShow | Person>>('/search/multi', {
      params: {
        query,
        page: page.toString(),
      },
    })

    this.searchCache.set(query, page, results)
    return results
  }

  // Recherche de personnes (acteurs, équipe)
  async searchPerson(query: string, page = 1) {
    return this.fetch<PaginatedResponse<Person>>('/search/person', {
      params: {
        query,
        page: page.toString(),
      },
    })
  }

  // Détails d'une personne
  async getPersonDetails(id: number) {
    return this.fetch<PersonDetails>(`/person/${id}`)
  }

  // Films d'un acteur
  async getPersonMovieCredits(id: number) {
    return this.fetch<MovieCredit>(`/person/${id}/movie_credits`)
  }

  // Séries d'un acteur
  async getPersonTVCredits(id: number) {
    return this.fetch<TVCredit>(`/person/${id}/tv_credits`)
  }

  // Films similaires
  async getSimilarMovies(id: number, page = 1) {
    return this.fetch<PaginatedResponse<Movie>>(`/movie/${id}/similar`, {
      params: { page: page.toString() },
    })
  }

  // Séries similaires
  async getSimilarTVShows(id: number, page = 1) {
    return this.fetch<PaginatedResponse<TVShow>>(`/tv/${id}/similar`, {
      params: { page: page.toString() },
    })
  }

  // Genres de films
  async getMovieGenres(): Promise<Genre[]> {
    const response = await this.fetch<GenresResponse>('/genre/movie/list')
    return response.genres
  }

  // Genres de séries
  async getTVGenres(): Promise<Genre[]> {
    const response = await this.fetch<GenresResponse>('/genre/tv/list')
    return response.genres
  }

  // Films par genre
  async getMoviesByGenre(genreId: number, page = 1) {
    return this.fetch<PaginatedResponse<Movie>>('/discover/movie', {
      params: {
        with_genres: genreId.toString(),
        page: page.toString(),
      },
    })
  }

  // Séries par genre
  async getTVShowsByGenre(genreId: number, page = 1) {
    return this.fetch<PaginatedResponse<TVShow>>('/discover/tv', {
      params: {
        with_genres: genreId.toString(),
        page: page.toString(),
      },
    })
  }

  // Animés populaires
  async getPopularAnime(page = 1) {
    return this.fetch<PaginatedResponse<TVShow>>('/discover/tv', {
      params: {
        with_genres: '16', // ID du genre Animation
        with_original_language: 'ja', // Langue originale japonaise
        sort_by: 'popularity.desc',
        page: page.toString(),
      },
    })
  }

  // Animés tendance
  async getTrendingAnime(timeWindow: 'day' | 'week' = 'week') {
    return this.fetch<PaginatedResponse<TVShow>>('/trending/tv/week', {
      params: {
        with_genres: '16',
        with_original_language: 'ja',
      },
    })
  }

  // Animés les mieux notés
  async getTopRatedAnime(page = 1) {
    return this.fetch<PaginatedResponse<TVShow>>('/discover/tv', {
      params: {
        with_genres: '16',
        with_original_language: 'ja',
        sort_by: 'vote_average.desc',
        'vote_count.gte': '100',
        page: page.toString(),
      },
    })
  }

  // Nouveaux animés
  async getNewAnime(page = 1) {
    const today = new Date()
    const threeMonthsAgo = new Date(today.setMonth(today.getMonth() - 3))
      .toISOString()
      .split('T')[0]

    return this.fetch<PaginatedResponse<TVShow>>('/discover/tv', {
      params: {
        with_genres: '16',
        with_original_language: 'ja',
        sort_by: 'first_air_date.desc',
        'first_air_date.gte': threeMonthsAgo,
        page: page.toString(),
      },
    })
  }

  clearSearchCache() {
    this.searchCache.clear()
  }
}

export const tmdbClient = new TMDBClient() 