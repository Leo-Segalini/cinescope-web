interface Genre {
  id: number
  name: string
}

interface Video {
  id: string
  key: string
  name: string
  site: string
  type: string
  official: boolean
}

export interface Cast {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
}

interface CastCredit extends Movie {
  character: string
}

interface TVCastCredit extends TVShow {
  character: string
}

export interface PersonCredits {
  cast: Array<CastCredit | TVCastCredit>
  crew: Array<Movie | TVShow>
}

interface Crew {
  id: number
  name: string
  job: string
  department: string
  profile_path: string | null
}

interface WatchProvider {
  provider_id: number
  provider_name: string
  logo_path: string
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
      free?: Array<{
        provider_id: number
        provider_name: string
        logo_path: string
      }>
      ads?: Array<{
        provider_id: number
        provider_name: string
        logo_path: string
      }>
    }
  }
  id: number
}

interface Credits {
  cast: Cast[]
  crew: Crew[]
}

interface BaseMedia {
  id: number
  overview: string | null
  poster_path: string | null
  backdrop_path: string | null
  vote_average: number
  vote_count: number
  popularity: number
  genres: Genre[]
  videos?: {
    results: Video[]
  }
  credits?: Credits
  similar?: {
    results: Movie[] | TVShow[]
  }
  'watch/providers'?: WatchProviders
}

export interface Movie extends BaseMedia {
  title: string
  original_title: string
  release_date: string
  runtime: number | null
  budget: number
  revenue: number
  status: string
  tagline: string | null
  media_type?: 'movie'
}

export interface TVShow extends BaseMedia {
  name: string
  original_name: string
  first_air_date: string
  last_air_date: string
  number_of_episodes: number
  number_of_seasons: number
  status: string
  tagline: string | null
  seasons: {
    id: number
    name: string
    overview: string
    poster_path: string | null
    season_number: number
    episode_count: number
    air_date: string | null
    vote_average?: number
  }[]
  media_type?: 'tv'
}

export interface WatchProvidersResponse {
  id: number
  results: {
    [country: string]: {
      link: string
      flatrate?: WatchProvider[]
      free?: WatchProvider[]
      ads?: WatchProvider[]
      rent?: WatchProvider[]
      buy?: WatchProvider[]
    }
  }
}

export interface Provider {
  provider_id: number
  provider_name: string
  logo_path: string
} 