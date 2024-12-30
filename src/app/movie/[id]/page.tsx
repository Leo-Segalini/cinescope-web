'use client'

import { useEffect, useState } from 'react'
import { Movie, WatchProvider } from '@/types'
import { fetchMovieDetails, fetchSimilarMovies, fetchMovieWatchProviders } from '@/services/api'
import { Hero } from '@/components/Hero/Hero'
import { MovieGrid } from '@/components/MovieGrid/MovieGrid'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface MoviePageProps {
  params: Promise<{
    id: string
  }>
}

interface WatchProviders {
  flatrate?: WatchProvider[]
  free?: WatchProvider[]
  ads?: WatchProvider[]
  rent?: WatchProvider[]
  buy?: WatchProvider[]
}

export default function MoviePage({ params }: MoviePageProps) {
  const [movie, setMovie] = useState<Movie | null>(null)
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([])
  const [watchProviders, setWatchProviders] = useState<WatchProviders | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
        setError(null)
        const resolvedParams = await params
        const movieId = parseInt(resolvedParams.id)

        const [movieData, similarMoviesData, watchProvidersData] = await Promise.all([
          fetchMovieDetails(movieId),
          fetchSimilarMovies(movieId),
          fetchMovieWatchProviders(movieId),
        ])

        setMovie(movieData)
        setSimilarMovies(similarMoviesData)
        setWatchProviders(watchProvidersData.results.FR || null)
      } catch (err) {
        console.error('Error fetching movie details:', err)
        setError('Une erreur est survenue lors du chargement des données')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-2xl">Chargement...</div>
      </div>
    )
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-2xl">{error || 'Film non trouvé'}</div>
      </div>
    )
  }

  // Trouver la première plateforme de streaming disponible
  const streamingProvider = watchProviders?.flatrate?.[0]

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <Hero
        title={movie.title}
        overview={movie.overview}
        backdropPath={movie.backdrop_path}
        type="movie"
        id={movie.id}
        watchUrl={streamingProvider?.provider_name}
      />

      <div className="container mx-auto px-4 pb-16">
        {/* Détails du film */}
        <motion.div
          className="mt-8 grid gap-8 md:grid-cols-[300px,1fr]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Poster */}
          <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Informations */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white">{movie.title}</h2>
              <p className="mt-2 text-gray-300">{movie.overview}</p>
            </div>
            
            {/* Informations supplémentaires */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h3 className="text-lg font-semibold text-white">Date de sortie</h3>
                <p className="text-gray-300">
                  {new Date(movie.release_date).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Note</h3>
                <p className="text-gray-300">{movie.vote_average.toFixed(1)} / 10</p>
              </div>
            </div>

            {/* Plateformes de streaming */}
            {watchProviders && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Disponible sur</h3>
                
                {/* Streaming */}
                {watchProviders.flatrate && watchProviders.flatrate.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Streaming</h4>
                    <div className="flex flex-wrap gap-2">
                      {watchProviders.flatrate.map((provider) => (
                        <a
                          key={provider.provider_id}
                          href={`https://www.google.com/search?q=regarder+${encodeURIComponent(movie.title)}+${encodeURIComponent(provider.provider_name)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative w-12 h-12 rounded-lg overflow-hidden tooltip transition-transform hover:scale-110"
                          title={provider.provider_name}
                        >
                          <Image
                            src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                            alt={provider.provider_name}
                            width={48}
                            height={48}
                            className="object-cover"
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Location */}
                {watchProviders.rent && watchProviders.rent.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Location</h4>
                    <div className="flex flex-wrap gap-2">
                      {watchProviders.rent.map((provider) => (
                        <a
                          key={provider.provider_id}
                          href={`https://www.google.com/search?q=louer+${encodeURIComponent(movie.title)}+${encodeURIComponent(provider.provider_name)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative w-12 h-12 rounded-lg overflow-hidden tooltip transition-transform hover:scale-110"
                          title={provider.provider_name}
                        >
                          <Image
                            src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                            alt={provider.provider_name}
                            width={48}
                            height={48}
                            className="object-cover"
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Achat */}
                {watchProviders.buy && watchProviders.buy.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Achat</h4>
                    <div className="flex flex-wrap gap-2">
                      {watchProviders.buy.map((provider) => (
                        <a
                          key={provider.provider_id}
                          href={`https://www.google.com/search?q=acheter+${encodeURIComponent(movie.title)}+${encodeURIComponent(provider.provider_name)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative w-12 h-12 rounded-lg overflow-hidden tooltip transition-transform hover:scale-110"
                          title={provider.provider_name}
                        >
                          <Image
                            src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                            alt={provider.provider_name}
                            width={48}
                            height={48}
                            className="object-cover"
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Films similaires */}
        {similarMovies.length > 0 && (
          <div className="mt-16">
            <MovieGrid title="Films similaires" items={similarMovies} />
          </div>
        )}
      </div>
    </main>
  )
} 