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

async function fetchFromTMDB<T>(endpoint: string, options: FetchOptions = {}): Promise<T[]> {
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
    console.log(`Fetching from TMDB: ${endpoint}`)
    const url = `${TMDB_CONFIG.baseUrl}${endpoint}?${queryParams}`
    console.log('URL:', url.replace(TMDB_CONFIG.apiKey, 'API_KEY_HIDDEN'))

    const response = await fetch(url)
    const data: TMDBResponse<T> = await response.json()

    if (!response.ok) {
      console.error('TMDB API Error:', data)
      throw new Error(data.results ? 'Une erreur est survenue' : 'Impossible de récupérer les données')
    }

    console.log(`Received ${data.results?.length || 0} results for ${endpoint}`)
    return data.results || []
  } catch (error) {
    console.error('Error fetching from TMDB:', error)
    return []
  }
}

export async function fetchMovies(category: string, options: FetchOptions = {}): Promise<Movie[]> {
  return fetchFromTMDB<Movie>(`/movie/${category}`, options)
}

export async function fetchTVShows(category: string, options: FetchOptions = {}): Promise<TVShow[]> {
  return fetchFromTMDB<TVShow>(`/tv/${category}`, options)
}

export async function fetchAnimatedMovies(): Promise<Movie[]> {
  // 16 est l'ID du genre Animation
  return fetchFromTMDB<Movie>('/discover/movie', {
    with_genres: '16',
    sort_by: 'popularity.desc',
  })
}

export async function fetchAnime(): Promise<TVShow[]> {
  // 16 est l'ID du genre Animation
  // Nous ajoutons des paramètres supplémentaires pour cibler les animes japonais
  return fetchFromTMDB<TVShow>('/discover/tv', {
    with_genres: '16',
    with_original_language: 'ja', // Langue originale japonaise
    sort_by: 'popularity.desc',
  })
}

export async function searchMedia(query: string): Promise<(Movie | TVShow)[]> {
  try {
    console.log('Searching for:', query)
    const searchResults = await fetchFromTMDB<TMDBSearchResult>('/search/multi', { query })
    
    return searchResults.map(result => {
      if (result.media_type === 'movie') {
        return {
          id: result.id,
          title: result.title,
          poster_path: result.poster_path,
          backdrop_path: result.backdrop_path,
          overview: result.overview,
          release_date: result.release_date,
          vote_average: result.vote_average,
          genre_ids: result.genre_ids,
        } as Movie
      } else {
        return {
          id: result.id,
          name: result.name,
          poster_path: result.poster_path,
          backdrop_path: result.backdrop_path,
          overview: result.overview,
          first_air_date: result.first_air_date,
          vote_average: result.vote_average,
          genre_ids: result.genre_ids,
        } as TVShow
      }
    }).filter(result => result.poster_path || result.backdrop_path)
  } catch (error) {
    console.error('Error searching media:', error)
    return []
  }
}

export async function fetchMovieDetails(id: number): Promise<Movie> {
  const params = {
    api_key: TMDB_CONFIG.apiKey,
    language: TMDB_CONFIG.defaultLanguage,
  }

  const queryParams = new URLSearchParams(params as Record<string, string>)
  const url = `${TMDB_CONFIG.baseUrl}/movie/${id}?${queryParams}`

  const response = await fetch(url)
  const data = await response.json()

  if (!response.ok) {
    throw new Error('Impossible de récupérer les détails du film')
  }

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
    const results = await fetchFromTMDB<Movie>(`/movie/${movieId}/similar`)
    return results.slice(0, 4)
  } catch (error) {
    console.error('Error fetching similar movies:', error)
    return []
  }
}

export async function fetchTVShowDetails(id: number): Promise<TVShow> {
  const params = {
    api_key: TMDB_CONFIG.apiKey,
    language: TMDB_CONFIG.defaultLanguage,
  }

  const queryParams = new URLSearchParams(params as Record<string, string>)
  const url = `${TMDB_CONFIG.baseUrl}/tv/${id}?${queryParams}`

  const response = await fetch(url)
  const data = await response.json()

  if (!response.ok) {
    throw new Error('Impossible de récupérer les détails de la série')
  }

  return data
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
    const results = await fetchFromTMDB<TVShow>(`/tv/${tvShowId}/similar`)
    return results.slice(0, 4)
  } catch (error) {
    console.error('Error fetching similar TV shows:', error)
    return []
  }
} 