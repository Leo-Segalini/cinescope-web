'use client'

import { useEffect, useState, use } from 'react'
import { tmdbClient } from '@/services/tmdb/client'
import { LoadingSpinner } from '@/components/LoadingSpinner/LoadingSpinner'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { RatingCircle } from '@/components/RatingCircle/RatingCircle'
import { VideoSection } from '@/components/VideoSection/VideoSection'
import { StreamingInfo } from '@/components/StreamingInfo/StreamingInfo'
import { Movie } from '@/types/tmdb'
import Link from 'next/link'
import clsx from 'clsx'

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

  const navigationItems: { id: Section; label: string; show: boolean }[] = [
    { id: 'description', label: 'Description', show: true },
    { id: 'videos', label: 'Bande-annonce', show: movie.videos?.results.some(v => v.type === 'Trailer') ?? false },
    { id: 'cast', label: 'Acteurs', show: (movie.credits?.cast?.length ?? 0) > 0 },
    { id: 'similar', label: 'Vous pourriez aimer', show: similarMovies.length > 0 }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Hero Section avec backdrop */}
      <div className="relative h-screen md:h-[80vh] min-h-[500px] bottom-0">
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
                <p className="text-gray-300">{movie.overview}</p>
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

          {activeSection === 'videos' && movie.videos?.results && (
            <motion.div
              key="videos"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <VideoSection videos={movie.videos.results} />
            </motion.div>
          )}

          {activeSection === 'cast' && movie.credits?.cast && (
            <motion.div
              key="cast"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
            >
              {movie.credits.cast.slice(0, 12).map((actor) => (
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

          {activeSection === 'similar' && similarMovies.length > 0 && (
            <motion.div
              key="similar"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
            >
              {similarMovies.slice(0, 12).map((movie) => (
                <Link href={`/movie/${movie.id}`} key={movie.id}>
                  <motion.div
                    className="group"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2">
                      <Image
                        src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/placeholder-movie.png'}
                        alt={movie.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-110"
                      />
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <RatingCircle rating={movie.vote_average} size="sm" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium text-white truncate">{movie.title}</h3>
                      {movie.release_date && (
                        <p className="text-sm text-gray-400">
                          {new Date(movie.release_date).getFullYear()}
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