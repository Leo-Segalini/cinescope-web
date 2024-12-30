if (!process.env.NEXT_PUBLIC_TMDB_API_KEY) {
  throw new Error(
    'La clé API TMDB est manquante. Assurez-vous d\'avoir défini NEXT_PUBLIC_TMDB_API_KEY dans votre fichier .env.local'
  )
}

export const TMDB_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_TMDB_API_KEY,
  baseUrl: 'https://api.themoviedb.org/3',
  imageBaseUrl: 'https://image.tmdb.org/t/p',
  defaultLanguage: 'fr-FR',
  genres: {
    anime: '16', // ID pour l'animation
  },
} as const 