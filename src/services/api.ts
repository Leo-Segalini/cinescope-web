import { Movie, TVShow, WatchProvider } from '@/types'
import { TMDB_CONFIG } from '@/config/tmdb'

interface FetchOptions {
  with_genres?: string
  page?: number
  query?: string
  [key: string]: string | number | undefined
}

interface TMDBResponse<T> {
  results: T[]
  page: number
  total_pages: number
  total_results: number
}

interface TMDBSearchResult extends Movie, TVShow {
  media_type: 'movie' | 'tv'
}

interface WatchProvidersResponse {
  results: {
    FR?: {
      flatrate?: WatchProvider[]
      free?: WatchProvider[]
      ads?: WatchProvider[]
      rent?: WatchProvider[]
      buy?: WatchProvider[]
    }
  }
}

async function fetchFromTMDB<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const params = {
    api_key: TMDB_CONFIG.apiKey,
    language: TMDB_CONFIG.defaultLanguage,
    ...options,
  }

  const queryParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      queryParams.append(key, String(value))
    }
  })

  try {
    const url = `${TMDB_CONFIG.baseUrl}${endpoint}?${queryParams}`
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error('Error fetching from TMDB:', error)
    throw error
  }
}

export async function fetchMovies(category: string, options: FetchOptions = {}): Promise<Movie[]> {
  if (category === 'trending') {
    const data = await fetchFromTMDB<TMDBResponse<Movie>>('/trending/movie/week', options)
    return data.results
  }
  const data = await fetchFromTMDB<TMDBResponse<Movie>>(`/movie/${category}`, options)
  return data.results
}

export async function fetchTVShows(category: string, options: FetchOptions = {}): Promise<TVShow[]> {
  if (category === 'trending') {
    const data = await fetchFromTMDB<TMDBResponse<TVShow>>('/trending/tv/week', options)
    return data.results
  }
  const data = await fetchFromTMDB<TMDBResponse<TVShow>>(`/tv/${category}`, options)
  return data.results
}

export async function fetchAnimatedMovies(): Promise<Movie[]> {
  const data = await fetchFromTMDB<TMDBResponse<Movie>>('/discover/movie', {
    with_genres: '16',
    sort_by: 'popularity.desc',
    language: 'fr-FR',
  })
  return data.results
}

export async function fetchAnime(): Promise<TVShow[]> {
  const data = await fetchFromTMDB<TMDBResponse<TVShow>>('/discover/tv', {
    with_genres: '16',
    with_keywords: '210024|222243',
    sort_by: 'popularity.desc',
    language: 'fr-FR',
  })
  return data.results
}

export async function searchMedia(query: string): Promise<(Movie | TVShow)[]> {
  const [movies, tvShows] = await Promise.all([
    fetchFromTMDB<TMDBResponse<Movie>>('/search/movie', { query }),
    fetchFromTMDB<TMDBResponse<TVShow>>('/search/tv', { query }),
  ])

  return [...movies.results, ...tvShows.results].filter(
    (item) => item.poster_path || item.backdrop_path
  )
}

export async function fetchMovieDetails(id: number): Promise<Movie> {
  const params = {
    api_key: TMDB_CONFIG.apiKey,
    language: TMDB_CONFIG.defaultLanguage,
    append_to_response: 'videos,credits,similar,watch/providers',
  }

  const queryParams = new URLSearchParams(params as Record<string, string>)
  const url = `${TMDB_CONFIG.baseUrl}/movie/${id}?${queryParams}`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Impossible de récupérer les détails du film')
  }

  const data = await response.json()
  return data
}

export async function fetchTVShowDetails(id: number): Promise<TVShow> {
  const params = {
    api_key: TMDB_CONFIG.apiKey,
    language: TMDB_CONFIG.defaultLanguage,
    append_to_response: 'videos,credits,similar,watch/providers',
  }

  const queryParams = new URLSearchParams(params as Record<string, string>)
  const url = `${TMDB_CONFIG.baseUrl}/tv/${id}?${queryParams}`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Impossible de récupérer les détails de la série')
  }

  const data = await response.json()
  return data
}

export async function fetchMovieWatchProviders(movieId: number): Promise<WatchProvidersResponse> {
  const params = {
    api_key: TMDB_CONFIG.apiKey,
  }

  const queryParams = new URLSearchParams(params as Record<string, string>)
  const url = `${TMDB_CONFIG.baseUrl}/movie/${movieId}/watch/providers?${queryParams}`

  const response = await fetch(url)
  const data = await response.json()

  if (!response.ok) {
    throw new Error('Impossible de récupérer les plateformes de streaming')
  }

  return data
}

export async function fetchSimilarMovies(movieId: number): Promise<Movie[]> {
  try {
    console.log(`Fetching similar movies for movie ID: ${movieId}`)
    const data = await fetchFromTMDB<TMDBResponse<Movie>>(`/movie/${movieId}/similar`)
    return data.results.slice(0, 4)
  } catch (error) {
    console.error('Error fetching similar movies:', error)
    return []
  }
}

export async function fetchTVShowWatchProviders(tvShowId: number): Promise<WatchProvidersResponse> {
  const params = {
    api_key: TMDB_CONFIG.apiKey,
  }

  const queryParams = new URLSearchParams(params as Record<string, string>)
  const url = `${TMDB_CONFIG.baseUrl}/tv/${tvShowId}/watch/providers?${queryParams}`

  const response = await fetch(url)
  const data = await response.json()

  if (!response.ok) {
    throw new Error('Impossible de récupérer les plateformes de streaming')
  }

  return data
}

export async function fetchSimilarTVShows(tvShowId: number): Promise<TVShow[]> {
  try {
    console.log(`Fetching similar TV shows for TV show ID: ${tvShowId}`)
    const data = await fetchFromTMDB<TMDBResponse<TVShow>>(`/tv/${tvShowId}/similar`)
    return data.results.slice(0, 4)
  } catch (error) {
    console.error('Error fetching similar TV shows:', error)
    return []
  }
}

export async function searchMulti(query: string): Promise<TMDBSearchResult[]> {
  const data = await fetchFromTMDB<TMDBResponse<TMDBSearchResult>>('/search/multi', {
    query,
    language: 'fr-FR',
    page: 1,
    include_adult: 'false',
  })
  
  return data.results.filter((item) => 
    (item.media_type === 'movie' || item.media_type === 'tv') && 
    (item.poster_path || item.backdrop_path)
  )
} 