export interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
}

export interface TVShow {
  id: number
  name: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  first_air_date: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
}

export interface PaginatedResponse<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

export interface Genre {
  id: number
  name: string
}

export interface MovieDetails extends Movie {
  genres: Genre[]
  runtime: number
  tagline?: string
  budget: number
  revenue: number
  status: string
}

export interface TVShowDetails extends TVShow {
  genres: Genre[]
  number_of_seasons: number
  number_of_episodes: number
  tagline?: string
  status: string
  created_by: {
    id: number
    name: string
  }[]
  last_episode_to_air?: {
    season_number: number
    episode_number: number
    name: string
    air_date: string
  }
}

export interface GenresResponse {
  genres: Genre[]
} 