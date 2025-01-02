export interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  runtime?: number
  budget?: number
  genres?: { id: number; name: string }[]
  'watch/providers'?: WatchProvidersResponse
  videos?: {
    results: Video[]
  }
  credits?: {
    cast: CastMember[]
  }
}

export interface TVShow {
  id: number
  name: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  first_air_date: string
  last_air_date: string
  number_of_seasons: number
  number_of_episodes: number
  status: string
  vote_average: number
  vote_count: number
  genre_ids?: number[]
  genres?: { id: number; name: string }[]
  videos?: {
    results: Video[]
  }
  seasons?: Season[]
  credits?: {
    cast: CastMember[]
  }
  'watch/providers'?: WatchProvidersResponse
}

export interface Video {
  id: string
  key: string
  name: string
  site: string
  type: string
  official: boolean
}

export interface Season {
  id: number
  name: string
  overview: string
  poster_path: string | null
  air_date: string
  episode_count: number
  season_number: number
  vote_average: number
}

export interface CastMember {
  id: number
  name: string
  character: string
  profile_path: string | null
}

export interface WatchProvidersResponse {
  results: {
    FR?: {
      link?: string
      flatrate?: Provider[]
      rent?: Provider[]
      buy?: Provider[]
    }
  }
}

export interface Provider {
  provider_id: number
  provider_name: string
  logo_path: string
}

export interface TMDBResponse<T> {
  results: T[]
  page: number
  total_pages: number
  total_results: number
}

export interface Episode {
  id: number
  name: string
  overview: string
  still_path: string | null
  air_date: string
  episode_number: number
  vote_average: number
  guest_stars?: {
    id: number
    name: string
    character: string
    profile_path: string | null
  }[]
} 