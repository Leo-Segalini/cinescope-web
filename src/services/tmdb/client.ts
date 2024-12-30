import type {
  Movie,
  TVShow,
  MovieDetails,
  TVShowDetails,
  PaginatedResponse,
} from '@/types/tmdb'
import { RateLimiter } from './utils/rateLimiter'

const BASE_URL = process.env.NEXT_PUBLIC_TMDB_API_BASE_URL
const ACCESS_TOKEN = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number>
}

class TMDBClient {
  private rateLimiter = new RateLimiter(40, 10) // 40 requêtes par 10 secondes

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

  async getPopularMovies(page = 1) {
    return this.fetch<PaginatedResponse<Movie>>('/movie/popular', {
      params: { page: page.toString() },
    })
  }

  async getPopularTVShows(page = 1) {
    return this.fetch<PaginatedResponse<TVShow>>('/tv/popular', {
      params: { page: page.toString() },
    })
  }

  async getMovieDetails(id: number) {
    return this.fetch<MovieDetails>(`/movie/${id}`)
  }

  async getTVShowDetails(id: number) {
    return this.fetch<TVShowDetails>(`/tv/${id}`)
  }

  async searchMulti(query: string, page = 1) {
    return this.fetch<PaginatedResponse<Movie | TVShow>>('/search/multi', {
      params: {
        query,
        page: page.toString(),
      },
    })
  }
}

export const tmdbClient = new TMDBClient() 