'use client'

import { useEffect, useState, use } from 'react'
import { tmdbClient } from '@/services/tmdb/client'
import { LoadingSpinner } from '@/components/LoadingSpinner/LoadingSpinner'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { RatingCircle } from '@/components/RatingCircle/RatingCircle'
import { VideoSection } from '@/components/VideoSection/VideoSection'
import { StreamingInfo } from '@/components/StreamingInfo/StreamingInfo'
import { SeasonList } from '@/components/SeasonList/SeasonList'
import { TVShow } from '@/types/tmdb'
import clsx from 'clsx'

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
        setError('Une erreur est survenue lors du chargement des détails')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTVShowDetails()
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
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-2xl">{error || 'Série non trouvée'}</div>
      </div>
    )
  }

  const providers = tvShow['watch/providers']

  const navigationItems: { id: Section; label: string; show: boolean }[] = [
    { id: 'description', label: 'Description', show: true },
    { id: 'videos', label: 'Bande-annonce', show: tvShow.videos?.results.some(v => v.type === 'Trailer') ?? false },
    { id: 'cast', label: 'Acteurs', show: (tvShow.credits?.cast?.length ?? 0) > 0 },
    { id: 'seasons', label: 'Saisons', show: (tvShow.seasons?.length ?? 0) > 0 },
    { id: 'similar', label: 'Vous pourriez aimer', show: similarShows.length > 0 }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Hero Section avec backdrop */}
      <div className="relative h-screen md:h-[80vh] min-h-[500px]">
        {tvShow.backdrop_path && (
          <>
            <Image
              src={`https://image.tmdb.org/t/p/original${tvShow.backdrop_path}`}
              alt={tvShow.name}
              fill
              className="object-cover"
              priority
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
                <Image
                  src={tvShow.poster_path ? `https://image.tmdb.org/t/p/w500${tvShow.poster_path}` : '/placeholder-tv.png'}
                  alt={tvShow.name}
                  fill
                  className="object-cover"
                  priority
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

                {providers && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Où regarder ?</h3>
                    <StreamingInfo
                      providers={providers}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="sticky top-0 bg-black/80 backdrop-blur-sm z-10 border-b border-white/10">
        <div className="container mx-auto px-4">
          <nav className="flex flex-wrap gap-4 md:gap-8">
            {navigationItems.filter(item => item.show).map((item) => (
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

          {activeSection === 'videos' && tvShow.videos?.results && (
            <motion.div
              key="videos"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <VideoSection videos={tvShow.videos.results} />
            </motion.div>
          )}

          {activeSection === 'cast' && tvShow.credits?.cast && (
            <motion.div
              key="cast"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
            >
              {tvShow.credits.cast.slice(0, 12).map((actor) => (
                <Link href={`/person/${actor.id}`} key={actor.id}>
                  <motion.div
                    className="group"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2">
                      <Image
                        src={actor.profile_path ? `https://image.tmdb.org/t/p/w500${actor.profile_path}` : '/placeholder-actor.png'}
                        alt={actor.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-110"
                      />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium text-white truncate">{actor.name}</h3>
                      <p className="text-sm text-gray-400 truncate">{actor.character}</p>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </motion.div>
          )}

          {activeSection === 'seasons' && tvShow.seasons && (
            <motion.div
              key="seasons"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <SeasonList seasons={tvShow.seasons} tvShowId={tvShow.id} />
            </motion.div>
          )}

          {activeSection === 'similar' && similarShows.length > 0 && (
            <motion.div
              key="similar"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
            >
              {similarShows.slice(0, 12).map((show) => (
                <Link href={`/tv/${show.id}`} key={show.id}>
                  <motion.div
                    className="group"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2">
                      <Image
                        src={show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : '/placeholder-tv.png'}
                        alt={show.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-110"
                      />
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <RatingCircle rating={show.vote_average} size="sm" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium text-white truncate">{show.name}</h3>
                      {show.first_air_date && (
                        <p className="text-sm text-gray-400">
                          {new Date(show.first_air_date).getFullYear()}
                        </p>
                      )}
                    </div>
                  </motion.div>
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
} 