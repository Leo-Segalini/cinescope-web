// Client pour l'API TMDB (The Movie Database)
// Gère toutes les requêtes vers l'API TMDB avec gestion des paramètres et des types

import { Movie, TVShow, WatchProvidersResponse } from '@/types/tmdb'

// Interface pour la réponse standard de l'API TMDB
interface TMDBResponse<T> {
  results: T[]              // Résultats de la requête
  page: number             // Page courante
  total_pages: number      // Nombre total de pages
  total_results: number    // Nombre total de résultats
}

interface Video {
  id: string
  key: string
  name: string
  site: string
  type: string
  official: boolean
}

interface WatchProvider {
  provider_id: number
  provider_name: string
  logo_path: string
}

interface WatchProviderResults {
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

interface Credits {
  cast: {
    id: number
    name: string
    character: string
    profile_path: string | null
    order: number
  }[]
  crew: {
    id: number
    name: string
    job: string
    department: string
    profile_path: string | null
  }[]
}

interface TVShowSeason {
  id: number
  name: string
  overview: string
  poster_path: string | null
  air_date: string
  episode_count: number
  season_number: number
  vote_average: number
  episodes: {
    id: number
    name: string
    overview: string
    still_path: string | null
    air_date: string
    episode_number: number
    vote_average: number
    vote_count: number
    guest_stars?: {
      id: number
      name: string
      character: string
      profile_path: string | null
    }[]
  }[]
}

// Vérification des variables d'environnement requises
const envApiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const envBaseUrl = process.env.NEXT_PUBLIC_TMDB_API_BASE_URL;

if (!envApiKey || !envBaseUrl) {
  throw new Error('TMDB environment variables are not properly configured');
}

// Configuration de base de l'API
const TMDB_BASE_URL: string = envBaseUrl;
const TMDB_API_KEY: string = envApiKey;
const ANIMATION_GENRE_ID = 16;

export class TMDBClient {
  /**
   * Méthode privée pour effectuer les requêtes vers l'API TMDB
   * @param endpoint - Point d'entrée de l'API
   * @param additionalParams - Paramètres additionnels pour la requête
   * @returns Promesse avec les données typées
   */
  private async fetchFromTMDB<T>(endpoint: string, additionalParams: Record<string, string> = {}): Promise<T> {
    const params = new URLSearchParams();
    
    // Paramètres de base pour toutes les requêtes
    params.append('api_key', TMDB_API_KEY);
    params.append('language', 'fr-FR');
    
    // Ajout des paramètres spécifiques
    Object.entries(additionalParams).forEach(([key, value]) => {
      params.append(key, value);
    });

    const url = `${TMDB_BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}${params.toString()}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch data from TMDB');
    }
    return response.json();
  }

  /**
   * Récupère les animes populaires
   */
  async getPopularAnime(): Promise<TVShow[]> {
    const params = {
      with_genres: ANIMATION_GENRE_ID.toString(),
      sort_by: 'popularity.desc'
    };
    const data = await this.fetchFromTMDB<TMDBResponse<TVShow>>('/discover/tv', params);
    return data.results;
  }

  /**
   * Récupère les animes tendance de la semaine
   */
  async getTrendingAnime(): Promise<TVShow[]> {
    const params = {
      with_genres: ANIMATION_GENRE_ID.toString()
    };
    const data = await this.fetchFromTMDB<TMDBResponse<TVShow>>('/trending/tv/week', params);
    return data.results;
  }

  /**
   * Récupère les animes les mieux notés
   */
  async getTopRatedAnime(): Promise<TVShow[]> {
    const params = {
      with_genres: ANIMATION_GENRE_ID.toString(),
      sort_by: 'vote_average.desc',
      'vote_count.gte': '200'  // Minimum de 200 votes pour être pertinent
    };
    const data = await this.fetchFromTMDB<TMDBResponse<TVShow>>('/discover/tv', params);
    return data.results;
  }

  /**
   * Récupère les nouveaux animes
   */
  async getNewAnime(): Promise<TVShow[]> {
    const params = {
      with_genres: ANIMATION_GENRE_ID.toString(),
      sort_by: 'first_air_date.desc'
    };
    const data = await this.fetchFromTMDB<TMDBResponse<TVShow>>('/discover/tv', params);
    return data.results;
  }

  /**
   * Récupère les films tendance de la semaine
   * @param page - Numéro de la page à récupérer
   */
  async getTrendingMovies(page = 1): Promise<TMDBResponse<Movie>> {
    const params = {
      page: page.toString()
    };
    return this.fetchFromTMDB<TMDBResponse<Movie>>('/trending/movie/week', params);
  }

  /**
   * Récupère les séries TV tendance de la semaine
   * @param page - Numéro de la page à récupérer
   */
  async getTrendingTVShows(page = 1): Promise<TMDBResponse<TVShow>> {
    const params = {
      page: page.toString()
    };
    return this.fetchFromTMDB<TMDBResponse<TVShow>>('/trending/tv/week', params);
  }

  /**
   * Récupère les détails d'un film avec ses vidéos, crédits et fournisseurs
   * @param id - Identifiant du film
   */
  async getMovieDetails(id: number): Promise<Movie> {
    const response = await this.fetchFromTMDB<Movie & {
      videos: { results: Video[] }
      credits: Credits
      'watch/providers': WatchProviderResults
    }>(`/movie/${id}`, {
      append_to_response: 'videos,credits,watch/providers'
    })

    return {
      ...response,
      vote_average: response.vote_average,
      videos: response.videos || { results: [] },
      credits: response.credits || { cast: [], crew: [] },
      'watch/providers': response['watch/providers'] || { results: {} },
    }
  }

  /**
   * Récupère les détails d'une série TV avec ses vidéos, crédits et fournisseurs
   * @param id - Identifiant de la série
   */
  async getTVShowDetails(id: number): Promise<TVShow> {
    const response = await this.fetchFromTMDB<TVShow & {
      videos: { results: Video[] }
      credits: Credits
      'watch/providers': WatchProviderResults
    }>(`/tv/${id}`, {
      append_to_response: 'videos,credits,watch/providers'
    })

    return {
      ...response,
      vote_average: response.vote_average,
      videos: response.videos || { results: [] },
      credits: response.credits || { cast: [], crew: [] },
      'watch/providers': response['watch/providers'] || { results: {} },
    }
  }

  /**
   * Recherche des films par mot-clé
   * @param query - Terme de recherche
   * @param page - Numéro de la page
   */
  async searchMovies(query: string, page = 1): Promise<TMDBResponse<Movie>> {
    const params = {
      query,
      page: page.toString()
    };
    return this.fetchFromTMDB<TMDBResponse<Movie>>('/search/movie', params);
  }

  /**
   * Recherche des séries TV par mot-clé
   * @param query - Terme de recherche
   * @param page - Numéro de la page
   */
  async searchTVShows(query: string, page = 1): Promise<TMDBResponse<TVShow>> {
    const params = {
      query,
      page: page.toString()
    };
    return this.fetchFromTMDB<TMDBResponse<TVShow>>('/search/tv', params);
  }

  /**
   * Récupère les fournisseurs de streaming pour un film
   * @param id - Identifiant du film
   */
  async getMovieWatchProviders(id: number): Promise<WatchProvidersResponse> {
    const response = await this.fetchFromTMDB<WatchProvidersResponse>(`/movie/${id}/watch/providers`)
    return response
  }

  /**
   * Récupère les fournisseurs de streaming pour une série TV
   * @param id - Identifiant de la série
   */
  async getTVShowWatchProviders(id: number): Promise<WatchProvidersResponse> {
    return this.fetchFromTMDB<WatchProvidersResponse>(`/tv/${id}/watch/providers`);
  }

  /**
   * Récupère les films disponibles sur un fournisseur de streaming
   * @param providerId - Identifiant du fournisseur
   * @param page - Numéro de la page
   */
  async getMoviesByWatchProvider(providerId: number, page = 1): Promise<TMDBResponse<Movie>> {
    const params = {
      with_watch_providers: providerId.toString(),
      watch_region: 'FR',
      page: page.toString()
    };
    return this.fetchFromTMDB<TMDBResponse<Movie>>('/discover/movie', params);
  }

  /**
   * Récupère les séries TV disponibles sur un fournisseur de streaming
   * @param providerId - Identifiant du fournisseur
   * @param page - Numéro de la page
   */
  async getTVShowsByWatchProvider(providerId: number, page = 1): Promise<TMDBResponse<TVShow>> {
    const params = {
      with_watch_providers: providerId.toString(),
      watch_region: 'FR',
      page: page.toString()
    };
    return this.fetchFromTMDB<TMDBResponse<TVShow>>('/discover/tv', params);
  }

  /**
   * Récupère les films similaires à un film donné
   * @param id - Identifiant du film
   */
  async getSimilarMovies(id: number): Promise<TMDBResponse<Movie>> {
    const response = await this.fetchFromTMDB<TMDBResponse<Movie>>(`/movie/${id}/similar`)
    return response
  }

  /**
   * Récupère les séries TV similaires à une série donnée
   * @param id - Identifiant de la série
   */
  async getSimilarTVShows(id: number): Promise<TMDBResponse<TVShow>> {
    const response = await this.fetchFromTMDB<TMDBResponse<TVShow>>(`/tv/${id}/similar`)
    return response
  }

  /**
   * Récupère les crédits d'un film (casting)
   * @param id - Identifiant du film
   */
  async getMovieCredits(id: number): Promise<{
    cast: {
      id: number
      name: string
      character: string
      profile_path: string | null
      order: number
    }[]
  }> {
    return this.fetchFromTMDB(`/movie/${id}/credits`)
  }

  /**
   * Récupère les crédits d'une série TV (casting)
   * @param id - Identifiant de la série
   */
  async getTVShowCredits(id: number): Promise<{
    cast: {
      id: number
      name: string
      character: string
      profile_path: string | null
      order: number
    }[]
  }> {
    return this.fetchFromTMDB(`/tv/${id}/credits`)
  }

  /**
   * Récupère les détails d'une personne (acteur, réalisateur, etc.)
   * @param id - Identifiant de la personne
   */
  async getPersonDetails(id: number): Promise<{
    id: number
    name: string
    biography: string
    profile_path: string | null
    birthday: string | null
    place_of_birth: string | null
  }> {
    return this.fetchFromTMDB(`/person/${id}`)
  }

  /**
   * Récupère la filmographie d'une personne (films)
   * @param id - Identifiant de la personne
   */
  async getPersonMovieCredits(id: number): Promise<{
    cast: {
      id: number
      title: string
      character: string
      poster_path: string | null
      release_date: string
      vote_average: number
    }[]
  }> {
    return this.fetchFromTMDB(`/person/${id}/movie_credits`)
  }

  /**
   * Récupère la filmographie d'une personne (séries TV)
   * @param id - Identifiant de la personne
   */
  async getPersonTVCredits(id: number): Promise<{
    cast: {
      id: number
      name: string
      character: string
      poster_path: string | null
      first_air_date: string
      vote_average: number
    }[]
  }> {
    return this.fetchFromTMDB(`/person/${id}/tv_credits`)
  }

  /**
   * Récupère les vidéos associées à un film
   * @param id - Identifiant du film
   */
  async getMovieVideos(id: number): Promise<{
    results: {
      id: string
      key: string
      name: string
      site: string
      type: string
      official: boolean
    }[]
  }> {
    return this.fetchFromTMDB(`/movie/${id}/videos`)
  }

  /**
   * Récupère les vidéos associées à une série TV
   * @param id - Identifiant de la série
   */
  async getTVShowVideos(id: number): Promise<{
    results: {
      id: string
      key: string
      name: string
      site: string
      type: string
      official: boolean
    }[]
  }> {
    return this.fetchFromTMDB(`/tv/${id}/videos`)
  }

  /**
   * Récupère les détails d'une saison d'une série TV
   * @param id - Identifiant de la série
   * @param seasonNumber - Numéro de la saison
   */
  async getTVShowSeasonDetails(id: number, seasonNumber: number): Promise<TVShowSeason> {
    const response = await this.fetchFromTMDB<TVShowSeason>(`/tv/${id}/season/${seasonNumber}`)
    return {
      ...response,
      id: response.id || 0,
      episode_count: response.episodes?.length || 0,
      vote_average: response.vote_average || 0
    }
  }

  // Constantes pour les IDs des fournisseurs de streaming
  static readonly PROVIDERS = {
    NETFLIX: 8,
    AMAZON_PRIME: 9,
    DISNEY_PLUS: 337,
    CANAL_PLUS: 381,
    PARAMOUNT_PLUS: 531,
    ADN: 415,
    OCS: 56,
    APPLE_TV: 350,
    CRUNCHYROLL: 283
  } as const

  // Constantes pour les IDs des genres
  static readonly GENRES = {
    ACTION: 28,
    ADVENTURE: 12,
    ANIMATION: 16,
    COMEDY: 35,
    CRIME: 80,
    DOCUMENTARY: 99,
    DRAMA: 18,
    FAMILY: 10751,
    FANTASY: 14,
    HISTORY: 36,
    HORROR: 27,
    MUSIC: 10402,
    MYSTERY: 9648,
    ROMANCE: 10749,
    SCIENCE_FICTION: 878,
    TV_MOVIE: 10770,
    THRILLER: 53,
    WAR: 10752,
    WESTERN: 37
  } as const

  /**
   * Recherche combinée par fournisseur et genre
   * @param query - Terme de recherche
   * @param provider - Identifiant du fournisseur (optionnel)
   * @param genre - Identifiant du genre (optionnel)
   * @param page - Numéro de la page
   */
  async searchByProvider(
    query: string,
    provider: number | null = null,
    genre: number | null = null,
    page = 1
  ): Promise<TMDBResponse<Movie | TVShow>> {
    const params: Record<string, string> = {
      page: page.toString(),
    }

    if (query) {
      params.query = query
    }

    if (provider) {
      params.with_watch_providers = provider.toString()
      params.watch_region = 'FR'
    }

    if (genre) {
      params.with_genres = genre.toString()
    }

    const movieResults = await this.fetchFromTMDB<TMDBResponse<Movie>>('/search/movie', params)
    const tvResults = await this.fetchFromTMDB<TMDBResponse<TVShow>>('/search/tv', params)

    return {
      results: [...movieResults.results, ...tvResults.results],
      page: page,
      total_pages: Math.max(movieResults.total_pages, tvResults.total_pages),
      total_results: movieResults.total_results + tvResults.total_results
    }
  }

  /**
   * Récupère la liste des genres disponibles
   */
  async getGenres(): Promise<{
    genres: {
      id: number
      name: string
    }[]
  }> {
    return this.fetchFromTMDB('/genre/movie/list')
  }

  /**
   * Recherche globale (films et séries TV)
   * @param query - Terme de recherche
   * @param page - Numéro de la page
   */
  async search(query: string, page = 1): Promise<TMDBResponse<Movie | TVShow>> {
    const movieResults = await this.searchMovies(query, page)
    const tvResults = await this.searchTVShows(query, page)

    return {
      results: [...movieResults.results, ...tvResults.results],
      page: page,
      total_pages: Math.max(movieResults.total_pages, tvResults.total_pages),
      total_results: movieResults.total_results + tvResults.total_results
    }
  }
}

export const tmdbClient = new TMDBClient(); 