// Client pour l'API TMDB (The Movie Database)
// Gère toutes les requêtes vers l'API TMDB avec gestion des paramètres et des types

import { Movie, TVShow } from '@/types/tmdb'

interface PersonDetails {
  id: number
  name: string
  biography: string
  profile_path: string | null
  birthday: string | null
  deathday: string | null
  place_of_birth: string | null
  combined_credits: {
    cast: Array<Movie | TVShow>
    crew: Array<Movie | TVShow>
  }
}

interface SeasonDetails {
  id: number
  name: string
  overview: string
  season_number: number
  air_date: string | null
  episode_count: number
  poster_path: string | null
  episodes: Array<{
    id: number
    name: string
    overview: string
    air_date: string | null
    episode_number: number
    still_path: string | null
    vote_average: number
    guest_stars?: Array<{
      id: number
      name: string
      character: string
      profile_path: string | null
    }>
  }>
}

interface WatchProviders {
  results: {
    FR?: {
      link: string
      flatrate?: Array<{
        provider_id: number
        provider_name: string
        logo_path: string
      }>
      rent?: Array<{
        provider_id: number
        provider_name: string
        logo_path: string
      }>
      buy?: Array<{
        provider_id: number
        provider_name: string
        logo_path: string
      }>
    }
  }
}

interface PersonCredits {
  cast: Array<Movie | TVShow>
  crew: Array<Movie | TVShow>
}

interface Review {
  id: string
  author: string
  content: string
  created_at: string
  author_details?: {
    rating?: number
    avatar_path?: string
  }
}

class TMDBClient {
  private baseUrl = 'https://api.themoviedb.org/3'
  private apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY
  private accessToken = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN

  private async fetchWithAuth(endpoint: string) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
      })
    
    if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Contenu non trouvé (${response.status})`)
        }
        throw new Error(`TMDB API error: ${response.status} ${response.statusText}`)
      }

      return response.json()
    } catch (error) {
      console.error(`Error fetching from TMDB API (${endpoint}):`, error)
      throw error
    }
  }

  async getMovieDetails(id: number): Promise<Movie> {
    return this.fetchWithAuth(
      `/movie/${id}?append_to_response=videos,credits,similar,watch/providers&language=fr-FR`
    )
  }

  async getTVShowDetails(id: number): Promise<TVShow> {
    return this.fetchWithAuth(
      `/tv/${id}?append_to_response=videos,credits,similar,watch/providers&language=fr-FR`
    )
  }

  async getPersonDetails(id: number): Promise<PersonDetails> {
    return this.fetchWithAuth(
      `/person/${id}?append_to_response=combined_credits&language=fr-FR`
    )
  }

  async getTVShowSeasonDetails(tvShowId: number, seasonNumber: number): Promise<SeasonDetails> {
    return this.fetchWithAuth(
      `/tv/${tvShowId}/season/${seasonNumber}?language=fr-FR`
    )
  }

  async getMovieWatchProviders(id: number): Promise<WatchProviders> {
    return this.fetchWithAuth(`/movie/${id}/watch/providers`)
  }

  async getTVShowWatchProviders(id: number): Promise<WatchProviders> {
    return this.fetchWithAuth(`/tv/${id}/watch/providers`)
  }

  async getMoviesByWatchProvider(providerId: number): Promise<{ results: Movie[] }> {
    return this.fetchWithAuth(
      `/discover/movie?with_watch_providers=${providerId}&watch_region=FR&language=fr-FR`
    )
  }

  async getTVShowsByWatchProvider(providerId: number): Promise<{ results: TVShow[] }> {
    return this.fetchWithAuth(
      `/discover/tv?with_watch_providers=${providerId}&watch_region=FR&language=fr-FR`
    )
  }

  async getPopularMovies(): Promise<{ results: Movie[] }> {
    return this.fetchWithAuth('/movie/popular?language=fr-FR')
  }

  async getPopularTVShows(): Promise<{ results: TVShow[] }> {
    return this.fetchWithAuth('/tv/popular?language=fr-FR')
  }

  async getTopRatedMovies(): Promise<{ results: Movie[] }> {
    return this.fetchWithAuth('/movie/top_rated?language=fr-FR')
  }

  async getTopRatedTVShows(): Promise<{ results: TVShow[] }> {
    return this.fetchWithAuth('/tv/top_rated?language=fr-FR')
  }

  async getUpcomingMovies(): Promise<{ results: Movie[] }> {
    return this.fetchWithAuth('/movie/upcoming?language=fr-FR')
  }

  async getAiringTodayTVShows(): Promise<{ results: TVShow[] }> {
    return this.fetchWithAuth('/tv/airing_today?language=fr-FR')
  }

  async searchMulti(query: string): Promise<{
    results: (Movie | TVShow)[]
  }> {
    return this.fetchWithAuth(
      `/search/multi?query=${encodeURIComponent(query)}&language=fr-FR`
    )
  }

  async getSimilarMovies(id: number): Promise<{ results: Movie[] }> {
    return this.fetchWithAuth(`/movie/${id}/similar?language=fr-FR`)
  }

  async getSimilarTVShows(id: number): Promise<{ results: TVShow[] }> {
    return this.fetchWithAuth(`/tv/${id}/similar?language=fr-FR`)
  }

  async discoverContent(
    page: number,
    type: 'movie' | 'tv',
    genreId: number | null = null,
    providerId: number | null = null
  ): Promise<{ results: Movie[] | TVShow[] }> {
    const params = new URLSearchParams({
      page: page.toString(),
      language: 'fr-FR',
    })

    if (genreId) {
      params.append('with_genres', genreId.toString())
    }

    if (providerId) {
      params.append('with_watch_providers', providerId.toString())
      params.append('watch_region', 'FR')
    }

    return this.fetchWithAuth(
      `/${type === 'movie' ? 'discover/movie' : 'discover/tv'}?${params.toString()}`
    )
  }

  async searchWithFilters(
    query: string,
    providerId: number | null = null,
    genreId: number | null = null,
    type: string | null = null
  ): Promise<{ results: (Movie | TVShow)[] }> {
    const params = new URLSearchParams({
      query: query,
      language: 'fr-FR',
    })

    if (genreId) {
      params.append('with_genres', genreId.toString())
    }

    if (providerId) {
      params.append('with_watch_providers', providerId.toString())
      params.append('watch_region', 'FR')
    }

    let endpoint = '/search/multi'
    if (type === 'movie') {
      endpoint = '/search/movie'
    } else if (type === 'tv') {
      endpoint = '/search/tv'
    }

    return this.fetchWithAuth(`${endpoint}?${params.toString()}`)
  }

  async getPersonMovieCredits(id: number): Promise<PersonCredits> {
    return this.fetchWithAuth(
      `/person/${id}/movie_credits?language=fr-FR`
    )
  }

  async getPersonTVCredits(id: number): Promise<PersonCredits> {
    return this.fetchWithAuth(
      `/person/${id}/tv_credits?language=fr-FR`
    )
  }

  async getPopularAnime(): Promise<{ results: TVShow[] }> {
    const params = new URLSearchParams({
      language: 'fr-FR',
      with_genres: '16', // ID du genre Animation
      with_keywords: '210024|222243', // Keywords pour Anime
      sort_by: 'popularity.desc'
    })

    return this.fetchWithAuth(`/discover/tv?${params.toString()}`)
  }

  async getTrendingAnime(): Promise<{ results: TVShow[] }> {
    const params = new URLSearchParams({
      language: 'fr-FR',
      with_genres: '16',
      with_keywords: '210024|222243',
      sort_by: 'trending.desc'
    })

    return this.fetchWithAuth(`/discover/tv?${params.toString()}`)
  }

  async getTopRatedAnime(): Promise<{ results: TVShow[] }> {
    const params = new URLSearchParams({
      language: 'fr-FR',
      with_genres: '16',
      with_keywords: '210024|222243',
      sort_by: 'vote_average.desc',
      'vote_count.gte': '100'
    })

    return this.fetchWithAuth(`/discover/tv?${params.toString()}`)
  }

  async getNewAnime(): Promise<{ results: TVShow[] }> {
    const params = new URLSearchParams({
      language: 'fr-FR',
      with_genres: '16',
      with_keywords: '210024|222243',
      sort_by: 'first_air_date.desc'
    })

    return this.fetchWithAuth(`/discover/tv?${params.toString()}`)
  }

  async getReviews(mediaType: 'movie' | 'tv', mediaId: number): Promise<{ results: Review[] }> {
    return this.fetchWithAuth(`/${mediaType}/${mediaId}/reviews?language=fr-FR`)
  }
}

export const tmdbClient = new TMDBClient() 