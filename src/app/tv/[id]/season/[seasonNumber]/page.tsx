'use client'

import { useEffect, useState, use } from 'react'
import { tmdbClient } from '@/services/tmdb/client'
import { LoadingSpinner } from '@/components/LoadingSpinner/LoadingSpinner'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { RatingCircle } from '@/components/RatingCircle/RatingCircle'

interface SeasonDetails {
  id: number
  name: string
  overview: string
  poster_path: string | null
  air_date: string | null
  episode_count: number
  season_number: number
  episodes: {
    id: number
    name: string
    overview: string
    still_path: string | null
    air_date: string | null
    episode_number: number
    vote_average: number
    guest_stars: {
      id: number
      name: string
      character: string
      profile_path: string | null
    }[]
  }[]
  vote_average: number
}

export default function SeasonPage({ params }: { params: Promise<{ id: string; seasonNumber: string }> }) {
  const resolvedParams = use(params)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [season, setSeason] = useState<SeasonDetails | null>(null)

  useEffect(() => {
    async function fetchSeasonDetails() {
      try {
        const details = await tmdbClient.getTVShowSeasonDetails(
          Number(resolvedParams.id),
          Number(resolvedParams.seasonNumber)
        )
        setSeason({
          ...details,
          vote_average: details.episodes.reduce((acc, episode) => acc + episode.vote_average, 0) / details.episodes.length,
          episodes: details.episodes.map(episode => ({
            ...episode,
            guest_stars: episode.guest_stars ?? []
          }))
        })
      } catch (err) {
        console.error('Error fetching season details:', err)
        setError('Une erreur est survenue lors du chargement des détails')
      } finally {
        setIsLoading(false)
      }
    }

    fetchSeasonDetails()
  }, [resolvedParams.id, resolvedParams.seasonNumber])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !season) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-2xl">{error || 'Saison non trouvée'}</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-24">
      <div className="container mx-auto px-4">
        {/* En-tête avec poster et informations */}
        <motion.div
          className="grid gap-8 md:grid-cols-[300px,1fr]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Poster */}
          <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
            <Image
              src={season.poster_path ? `https://image.tmdb.org/t/p/w500${season.poster_path}` : '/placeholder-tv.png'}
              alt={season.name}
              fill
              className="object-cover"
            />
            <div className="absolute top-2 right-2">
              <RatingCircle rating={season.vote_average} size="md" />
            </div>
          </div>

          {/* Informations */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-white">{season.name}</h1>
              <p className="mt-2 text-gray-400">
                {season.episode_count} épisode{season.episode_count > 1 ? 's' : ''}
                {season.air_date && ` • ${new Date(season.air_date).toLocaleDateString('fr-FR')}`}
              </p>
            </div>

            {season.overview && (
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">Synopsis</h2>
                <p className="text-gray-300">{season.overview}</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Liste des épisodes */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white mb-6">Épisodes</h2>
          <div className="space-y-6">
            {season.episodes.map((episode) => (
              <motion.div
                key={episode.id}
                className="bg-gray-900/50 rounded-lg overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="grid md:grid-cols-[300px,1fr] gap-6 p-4">
                  {/* Image de l'épisode */}
                  <div className="relative aspect-video rounded-lg overflow-hidden">
                    <Image
                      src={episode.still_path ? `https://image.tmdb.org/t/p/w500${episode.still_path}` : '/placeholder-episode.png'}
                      alt={episode.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <RatingCircle rating={episode.vote_average} size="sm" />
                    </div>
                  </div>

                  {/* Informations de l'épisode */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        {episode.episode_number}. {episode.name}
                      </h3>
                      <p className="text-gray-400">
                        {episode.air_date && new Date(episode.air_date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>

                    {episode.overview && (
                      <p className="text-gray-300">{episode.overview}</p>
                    )}

                    {(episode.guest_stars?.length ?? 0) > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-2">Guest Stars</h4>
                        <div className="flex flex-wrap gap-4">
                          {episode.guest_stars?.slice(0, 5).map((star) => (
                            <Link key={star.id} href={`/person/${star.id}`}>
                              <div className="flex items-center space-x-2">
                                <div className="relative w-8 h-8 rounded-full overflow-hidden">
                                  <Image
                                    src={star.profile_path ? `https://image.tmdb.org/t/p/w200${star.profile_path}` : '/placeholder-actor.png'}
                                    alt={star.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div>
                                  <p className="text-white text-sm font-medium">{star.name}</p>
                                  <p className="text-gray-400 text-xs">{star.character}</p>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
} 