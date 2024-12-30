import { Movie, TVShow } from '@/types'
import { TMDB_CONFIG } from '@/config/tmdb'

interface TMDBResponse<T> {
  results: T[]
  page: number
  total_pages: number
  total_results: number
}

export async function fetchFromTMDB<T>(endpoint: string, options: Record<string, string> = {}): Promise<TMDBResponse<T>> {
  const params = new URLSearchParams({
    api_key: TMDB_CONFIG.apiKey,
    language: TMDB_CONFIG.defaultLanguage,
    ...options,
  })

  const url = `${TMDB_CONFIG.baseUrl}${endpoint}?${params}`
  const response = await fetch(url)
  const data = await response.json()

  if (!response.ok) {
    throw new Error('Failed to fetch from TMDB')
  }

  return data
}

export async function getTrendingMovies(page = 1) {
  const params = {
    page: page.toString(),
  }

  return fetchFromTMDB<Movie>('/trending/movie/week', params)
}

export async function getTrendingTVShows(page = 1) {
  const params = {
    page: page.toString(),
  }

  return fetchFromTMDB<TVShow>('/trending/tv/week', params)
}

export async function getMovieDetails(id: number) {
  return fetchFromTMDB<Movie>(`/movie/${id}`)
}

export async function getTVShowDetails(id: number) {
  return fetchFromTMDB<TVShow>(`/tv/${id}`)
}

export async function searchMovies(query: string, page = 1) {
  const params = {
    query,
    page: page.toString(),
  }

  return fetchFromTMDB<Movie>('/search/movie', params)
}

export async function searchTVShows(query: string, page = 1) {
  const params = {
    query,
    page: page.toString(),
  }

  return fetchFromTMDB<TVShow>('/search/tv', params)
} 