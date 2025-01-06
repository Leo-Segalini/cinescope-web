export interface Movie {
  id: number
  title: string
  poster_path: string | null
  backdrop_path: string | null
  overview: string | null
  release_date: string | null
  vote_average: number
  genre_ids?: number[]
}

export interface TVShow {
  id: number
  name: string
  poster_path: string | null
  backdrop_path: string | null
  overview: string | null
  first_air_date: string | null
  vote_average: number
  genre_ids?: number[]
}

export interface WatchProvider {
  display_priority: number
  logo_path: string
  provider_id: number
  provider_name: string
} 