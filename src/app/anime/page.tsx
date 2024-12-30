'use client'

import { useEffect, useState } from 'react'
import { Hero } from '@/components/Hero/Hero'
import { MovieGrid } from '@/components/MovieGrid/MovieGrid'
import { TVShowGrid } from '@/components/TVShowGrid/TVShowGrid'
import { fetchAnimatedMovies, fetchAnime, fetchTVShowWatchProviders } from '@/services/api'
import { Movie, TVShow, WatchProvider } from '@/types'
import { motion } from 'framer-motion'

interface WatchProviderResponse {
  results: {
    FR?: {
      flatrate?: WatchProvider[]
    }
  }
}

interface WatchProviderResult {
  id: number
  providers: WatchProvider[]
}

export default function AnimePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<{
    animatedMovies: Movie[]
    animeShows: TVShow[]
    watchProviders: { [key: number]: WatchProvider[] }
  } | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
        setError(null)

        const [animatedMovies, animeShows] = await Promise.all([
          fetchAnimatedMovies(),
          fetchAnime(),
        ])

        // Récupérer les plateformes de streaming pour chaque anime
        const watchProvidersPromises = animeShows.map((show: TVShow) => 
          fetchTVShowWatchProviders(show.id)
            .then((data: WatchProviderResponse) => ({ 
              id: show.id, 
              providers: data.results.FR?.flatrate || [] 
            }))
        )
        const watchProvidersResults = await Promise.all(watchProvidersPromises)
        
        // Créer un objet avec les plateformes de streaming pour chaque anime
        const watchProviders = watchProvidersResults.reduce((acc: { [key: number]: WatchProvider[] }, { id, providers }: WatchProviderResult) => {
          acc[id] = providers
          return acc
        }, {})

        // Trier les animes pour mettre en avant ceux disponibles sur Crunchyroll
        const sortedAnimeShows = animeShows.sort((a: TVShow, b: TVShow) => {
          const aHasCrunchyroll = watchProviders[a.id]?.some((p: WatchProvider) => 
            p.provider_name.toLowerCase().includes('crunchyroll')
          ) || false
          const bHasCrunchyroll = watchProviders[b.id]?.some((p: WatchProvider) => 
            p.provider_name.toLowerCase().includes('crunchyroll')
          ) || false
          
          if (aHasCrunchyroll && !bHasCrunchyroll) return -1
          if (!aHasCrunchyroll && bHasCrunchyroll) return 1
          return 0
        })

        setData({
          animatedMovies,
          animeShows: sortedAnimeShows,
          watchProviders
        })
      } catch (err) {
        console.error('Error fetching anime data:', err)
        setError('Une erreur est survenue lors du chargement des données')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-2xl">Chargement...</div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-2xl">{error || 'Aucun contenu disponible'}</div>
      </div>
    )
  }

  // Sélectionner un anime disponible sur Crunchyroll pour le Hero si possible
  const heroContent = data.animeShows.find(show => 
    data.watchProviders[show.id]?.some(p => p.provider_name.toLowerCase().includes('crunchyroll'))
  ) || data.animeShows[0]

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <Hero
        title={heroContent.name}
        overview={heroContent.overview}
        backdropPath={heroContent.backdrop_path}
        type="tv"
        id={heroContent.id}
        watchUrl={data.watchProviders[heroContent.id]?.[0]?.provider_name}
      />

      <div className="container mx-auto px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-12"
        >
          {data.animeShows.length > 0 && (
            <TVShowGrid title="Séries Anime" items={data.animeShows} />
          )}

          {data.animatedMovies.length > 0 && (
            <MovieGrid title="Films d&apos;Animation" items={data.animatedMovies} />
          )}
        </motion.div>
      </div>
    </main>
  )
} 