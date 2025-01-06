'use client'

import { useEffect, useState, use } from 'react'
import { tmdbClient } from '@/services/tmdb/client'
import { LoadingSpinner } from '@/components/LoadingSpinner/LoadingSpinner'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { RatingCircle } from '@/components/RatingCircle/RatingCircle'
import { StreamingInfo } from '@/components/StreamingInfo/StreamingInfo'
import { Movie } from '@/types/tmdb'
import clsx from 'clsx'
import { MediaActions } from '@/components/MediaActions/MediaActions'
import { Reviews } from '@/components/Reviews/Reviews'
import { Cast } from '@/components/Cast/Cast'
import { SimilarMedia } from '@/components/SimilarMedia/SimilarMedia'
import { VideoGallery } from '@/components/VideoGallery/VideoGallery'

type Section = 'description' | 'videos' | 'cast' | 'similar'

export default function MoviePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [movie, setMovie] = useState<Movie | null>(null)
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([])
  const [activeSection, setActiveSection] = useState<Section>('description')

  useEffect(() => {
    async function fetchMovieDetails() {
      try {
        const [details, similar] = await Promise.all([
          tmdbClient.getMovieDetails(Number(resolvedParams.id)),
          tmdbClient.getSimilarMovies(Number(resolvedParams.id))
        ])
        setMovie(details)
        const sortedMovies = similar.results.sort((a, b) => {
          const dateA = new Date(a.release_date || '').getTime()
          const dateB = new Date(b.release_date || '').getTime()
          return dateB - dateA
        })
        setSimilarMovies(sortedMovies)
      } catch (err) {
        console.error('Error fetching movie details:', err)
        setError('Une erreur est survenue lors du chargement des détails')
      } finally {
        setIsLoading(false)
      }
    }

    fetchMovieDetails()
  }, [resolvedParams.id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <LoadingSpinner size="lg" />
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

  const providers = movie['watch/providers']

  const sections = [
    { id: 'description' as const, label: 'Description', show: true },
    { id: 'videos' as const, label: 'Vidéos', show: movie.videos?.results && movie.videos.results.length > 0 },
    { id: 'cast' as const, label: 'Distribution', show: movie.credits?.cast && movie.credits.cast.length > 0 },
    { id: 'similar' as const, label: 'Films similaires', show: movie.similar?.results && movie.similar.results.length > 0 }
  ] as const

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Hero Section avec backdrop */}
      <div className="relative min-h-screen md:h-[80vh] md:min-h-[500px] bottom-0">
        {movie.backdrop_path && (
          <>
            <Image
              src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
              alt={movie.title}
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
                  src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder-movie.png'}
                  alt={movie.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Informations */}
              <div className="space-y-6 flex flex-col justify-end text-center md:text-left">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{movie.title}</h1>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                    <div className="flex items-center gap-2">
                      <RatingCircle rating={movie.vote_average} size="lg" />
                      <span className="text-white font-medium">Note des utilisateurs</span>
                    </div>
                    {movie.release_date && (
                      <span className="text-gray-300">
                        {new Date(movie.release_date).toLocaleDateString('fr-FR')}
                      </span>
                    )}
                    <div className="flex flex-wrap justify-center md:justify-start gap-2">
                      {movie.genres?.map((genre) => (
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
                  <MediaActions mediaId={movie.id} mediaType="movie" />

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
                onClick={() => setActiveSection(item.id as Section)}
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
                <p className="text-gray-300">{movie.overview || 'Aucun synopsis disponible'}</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-white mb-2">Date de sortie</h3>
                  <p className="text-gray-300">
                    {movie.release_date
                      ? new Date(movie.release_date).toLocaleDateString('fr-FR')
                      : 'Non disponible'}
                  </p>
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-white mb-2">Durée</h3>
                  <p className="text-gray-300">
                    {movie.runtime ? `${movie.runtime} minutes` : 'Non disponible'}
                  </p>
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-white mb-2">Budget</h3>
                  <p className="text-gray-300">
                    {movie.budget
                      ? new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: 'USD',
                          maximumFractionDigits: 0,
                        }).format(movie.budget)
                      : 'Non disponible'}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'videos' && <VideoGallery videos={movie?.videos?.results || []} />}

          {activeSection === 'cast' && <Cast cast={movie?.credits?.cast || []} />}

          {activeSection === 'similar' && <SimilarMedia media={similarMovies} type="movie" />}

          <Reviews mediaId={movie?.id || 0} mediaType="movie" />
        </AnimatePresence>
      </div>
    </main>
  )
} 