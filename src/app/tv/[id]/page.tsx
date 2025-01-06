'use client'

import { useEffect, useState, use } from 'react'
import { tmdbClient } from '@/services/tmdb/client'
import { LoadingSpinner } from '@/components/LoadingSpinner/LoadingSpinner'
import { motion, AnimatePresence } from 'framer-motion'
import { TMDBImage } from '@/components/common/TMDBImage'
import Link from 'next/link'
import { RatingCircle } from '@/components/RatingCircle/RatingCircle'
import { StreamingInfo } from '@/components/StreamingInfo/StreamingInfo'
import { SeasonList } from '@/components/SeasonList/SeasonList'
import { TVShow } from '@/types/tmdb'
import clsx from 'clsx'
import { MediaActions } from '@/components/MediaActions/MediaActions'
import { Reviews } from '@/components/Reviews/Reviews'
import { Cast } from '@/components/Cast/Cast'
import { SimilarMedia } from '@/components/SimilarMedia/SimilarMedia'
import { VideoGallery } from '@/components/VideoGallery/VideoGallery'

type Section = 'description' | 'videos' | 'cast' | 'similar' | 'seasons'

export default function TVShowPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tvShow, setTVShow] = useState<TVShow | null>(null)
  const [similarShows, setSimilarShows] = useState<TVShow[]>([])
  const [activeSection, setActiveSection] = useState<Section>('description')

  useEffect(() => {
    async function fetchTVShowDetails() {
      try {
        setIsLoading(true)
        setError(null)
        const [details, similar] = await Promise.all([
          tmdbClient.getTVShowDetails(Number(resolvedParams.id)),
          tmdbClient.getSimilarTVShows(Number(resolvedParams.id))
        ])
        setTVShow(details)
        // Trier les séries similaires par date de sortie (du plus récent au plus ancien)
        const sortedShows = similar.results.sort((a, b) => {
          const dateA = new Date(a.first_air_date || '').getTime()
          const dateB = new Date(b.first_air_date || '').getTime()
          return dateB - dateA
        })
        setSimilarShows(sortedShows)
      } catch (err) {
        console.error('Error fetching TV show details:', err)
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('Une erreur est survenue lors du chargement des détails')
        }
      } finally {
        setIsLoading(false)
      }
    }

    if (!isNaN(Number(resolvedParams.id))) {
      fetchTVShowDetails()
    } else {
      setError('ID de série invalide')
      setIsLoading(false)
    }
  }, [resolvedParams.id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !tvShow) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex flex-col items-center justify-center gap-4">
        <div className="text-white text-2xl text-center">{error || 'Série non trouvée'}</div>
        <Link 
          href="/tv"
          className="px-6 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          Retour aux séries
        </Link>
      </div>
    )
  }

  const providers = tvShow['watch/providers']

  const sections = [
    { id: 'description' as const, label: 'Description', show: true },
    { id: 'videos' as const, label: 'Vidéos', show: tvShow.videos?.results && tvShow.videos.results.length > 0 },
    { id: 'cast' as const, label: 'Distribution', show: tvShow.credits?.cast && tvShow.credits.cast.length > 0 },
    { id: 'seasons' as const, label: 'Saisons', show: tvShow.seasons && tvShow.seasons.length > 0 },
    { id: 'similar' as const, label: 'Séries similaires', show: tvShow.similar?.results && tvShow.similar.results.length > 0 }
  ] as const

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Hero Section avec backdrop */}
      <div className="relative min-h-screen md:h-[80vh] md:min-h-[500px] bottom-0">
        {tvShow.backdrop_path && (
          <>
            <TMDBImage
              path={tvShow.backdrop_path}
              alt={tvShow.name}
              fill
              type="backdrop"
              size="original"
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          </>
        )}

        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-12 md:pb-16">
            <motion.div
              className="grid gap-8 md:grid-cols-[300px,1fr]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Poster */}
              <div className="relative aspect-[2/3] w-48 md:w-full mx-auto md:mx-0 rounded-lg overflow-hidden shadow-2xl">
                <TMDBImage
                  path={tvShow.poster_path}
                  alt={tvShow.name}
                  fill
                  type="poster"
                  priority
                  className="object-cover"
                />
              </div>

              {/* Informations */}
              <div className="space-y-6 flex flex-col justify-end text-center md:text-left">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{tvShow.name}</h1>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                    <div className="flex items-center gap-2">
                      <RatingCircle rating={tvShow.vote_average} size="lg" />
                      <span className="text-white font-medium">Note des utilisateurs</span>
                    </div>
                    {tvShow.first_air_date && (
                      <span className="text-gray-300">
                        {new Date(tvShow.first_air_date).toLocaleDateString('fr-FR')}
                      </span>
                    )}
                    <div className="flex flex-wrap justify-center md:justify-start gap-2">
                      {tvShow.genres?.map((genre) => (
                        <span
                          key={genre.id}
                          className="px-3 py-1 rounded-full bg-gray-800 text-white text-sm"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <MediaActions mediaId={tvShow.id} mediaType="tv" />

                  {providers && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Où regarder ?</h3>
                      <StreamingInfo
                        providers={providers}
                      />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="sticky top-0 bg-black/80 backdrop-blur-sm z-10 border-b border-white/10">
        <div className="container mx-auto px-4">
          <nav className="flex flex-wrap gap-4 md:gap-8">
            {sections.filter(item => item.show).map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={clsx(
                  'py-4 text-base md:text-lg font-medium relative whitespace-nowrap',
                  activeSection === item.id ? 'text-white' : 'text-gray-400 hover:text-white transition-colors'
                )}
              >
                {item.label}
                {activeSection === item.id && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                    layoutId="activeSection"
                  />
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Contenu dynamique */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <AnimatePresence mode="wait">
          {activeSection === 'description' && (
            <motion.div
              key="description"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6 md:space-y-8"
            >
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">Synopsis</h2>
                <p className="text-gray-300">{tvShow.overview}</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-white mb-2">Première diffusion</h3>
                  <p className="text-gray-300">
                    {tvShow.first_air_date
                      ? new Date(tvShow.first_air_date).toLocaleDateString('fr-FR')
                      : 'Non disponible'}
                  </p>
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-white mb-2">Nombre de saisons</h3>
                  <p className="text-gray-300">
                    {tvShow.number_of_seasons || 'Non disponible'}
                  </p>
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-white mb-2">Nombre d&apos;épisodes</h3>
                  <p className="text-gray-300">
                    {tvShow.number_of_episodes || 'Non disponible'}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'videos' && <VideoGallery videos={tvShow?.videos?.results || []} />}

          {activeSection === 'cast' && <Cast cast={tvShow?.credits?.cast || []} />}

          {activeSection === 'seasons' && tvShow.seasons && (
            <motion.div
              key="seasons"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <SeasonList
                seasons={tvShow.seasons.map(season => ({
                  ...season,
                  vote_average: 0
                }))}
                tvShowId={tvShow.id}
              />
            </motion.div>
          )}

          {activeSection === 'similar' && <SimilarMedia media={similarShows} type="tv" />}
          <Reviews mediaId={tvShow?.id || 0} mediaType="tv" />
        </AnimatePresence>
      </div>
    </main>
  )
} 