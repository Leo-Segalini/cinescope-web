export interface Movie {
  id: number
  title: string
  poster_path: string | null
  backdrop_path: string | null
  overview: string
  release_date: string
  vote_average: number
  genre_ids: number[]
}

export interface TVShow {
  id: number
  name: string
  poster_path: string | null
  backdrop_path: string | null
  overview: string
  first_air_date: string
  vote_average: number
  genre_ids: number[]
}

export interface WatchProvider {
  display_priority: number
  logo_path: string
  provider_id: number
  provider_name: string
} 