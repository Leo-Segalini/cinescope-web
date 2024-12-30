'use client'

import { useEffect, useState } from 'react'
import { TVShow, WatchProvider } from '@/types'
import { fetchTVShowDetails, fetchSimilarTVShows, fetchTVShowWatchProviders } from '@/services/api'
import { Hero } from '@/components/Hero/Hero'
import { TVShowGrid } from '@/components/TVShowGrid/TVShowGrid'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface TVShowPageProps {
  params: {
    id: string
  }
}

interface WatchProviders {
  flatrate?: WatchProvider[]
  free?: WatchProvider[]
  ads?: WatchProvider[]
  rent?: WatchProvider[]
  buy?: WatchProvider[]
}

export default function TVShowPage({ params }: TVShowPageProps) {
  const [show, setShow] = useState<TVShow | null>(null)
  const [similarShows, setSimilarShows] = useState<TVShow[]>([])
  const [watchProviders, setWatchProviders] = useState<WatchProviders | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
        setError(null)
        const showId = parseInt(params.id)

        const [showData, similarShowsData, watchProvidersData] = await Promise.all([
          fetchTVShowDetails(showId),
          fetchSimilarTVShows(showId),
          fetchTVShowWatchProviders(showId),
        ])

        setShow(showData)
        setSimilarShows(similarShowsData)
        setWatchProviders(watchProvidersData.results.FR || null)
      } catch (err) {
        console.error('Error fetching TV show details:', err)
        setError('Une erreur est survenue lors du chargement des données')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-2xl">Chargement...</div>
      </div>
    )
  }

  if (error || !show) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-2xl">{error || 'Série non trouvée'}</div>
      </div>
    )
  }

  // Trouver la première plateforme de streaming disponible
  const streamingProvider = watchProviders?.flatrate?.[0]

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <Hero
        title={show.name}
        overview={show.overview}
        backdropPath={show.backdrop_path}
        type="tv"
        id={show.id}
        watchUrl={streamingProvider?.provider_name}
      />

      <div className="container mx-auto px-4 pb-16">
        {/* Détails de la série */}
        <motion.div
          className="mt-8 grid gap-8 md:grid-cols-[300px,1fr]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Poster */}
          <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
            <img
              src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
              alt={show.name}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>

          {/* Informations */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white">{show.name}</h2>
              <p className="mt-2 text-gray-300">{show.overview}</p>
            </div>
            
            {/* Informations supplémentaires */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h3 className="text-lg font-semibold text-white">Première diffusion</h3>
                <p className="text-gray-300">
                  {new Date(show.first_air_date).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Note</h3>
                <p className="text-gray-300">{show.vote_average.toFixed(1)} / 10</p>
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
                          href={`https://www.google.com/search?q=regarder+${encodeURIComponent(show.name)}+${encodeURIComponent(provider.provider_name)}`}
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
                          href={`https://www.google.com/search?q=louer+${encodeURIComponent(show.name)}+${encodeURIComponent(provider.provider_name)}`}
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
                          href={`https://www.google.com/search?q=acheter+${encodeURIComponent(show.name)}+${encodeURIComponent(provider.provider_name)}`}
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

        {/* Séries similaires */}
        {similarShows.length > 0 && (
          <div className="mt-16">
            <TVShowGrid title="Séries similaires" items={similarShows} />
          </div>
        )}
      </div>
    </main>
  )
} 