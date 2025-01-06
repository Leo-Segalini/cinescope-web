'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/Auth/AuthProvider'
import { supabase } from '@/lib/supabase'
import { LoadingSpinner } from '@/components/LoadingSpinner/LoadingSpinner'
import { Movie, TVShow } from '@/types/tmdb'
import { tmdbClient } from '@/services/tmdb/client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { TMDBImage } from '@/components/common/TMDBImage'
import { RatingCircle } from '@/components/RatingCircle/RatingCircle'

type MediaType = 'all' | 'movie' | 'tv'

export default function WatchlistPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [watchedMedia, setWatchedMedia] = useState<(Movie | TVShow)[]>([])
  const [activeFilter, setActiveFilter] = useState<MediaType>('all')

  useEffect(() => {
    if (!user) return

    const loadWatchedMedia = async () => {
      try {
        const { data: watchedData, error } = await supabase
          .from('watched')
          .select('*')
          .eq('user_id', user.id)
          .order('watched_at', { ascending: false })

        if (error) throw error

        if (watchedData) {
          const mediaItems = await Promise.all(
            watchedData.map(async (item) => {
              if (item.media_type === 'movie') {
                return tmdbClient.getMovieDetails(item.media_id)
              } else {
                return tmdbClient.getTVShowDetails(item.media_id)
              }
            })
          )
          setWatchedMedia(mediaItems)
        }
      } catch (error) {
        console.error('Error loading watched media:', error)
      } finally {
        setLoading(false)
      }
    }

    loadWatchedMedia()
  }, [user])

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-2xl">Veuillez vous connecter pour accéder à votre liste</div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const filteredMedia = watchedMedia.filter((media) => {
    if (activeFilter === 'all') return true
    return 'title' in media ? activeFilter === 'movie' : activeFilter === 'tv'
  })

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-8">
      <div className="container mx-auto px-4 pt-20">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-6">
            <motion.h1 
              className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Ma liste
            </motion.h1>
            <motion.div 
              className="inline-flex items-center gap-4 p-1.5 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-white/5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {(['all', 'movie', 'tv'] as const).map((filter) => (
                <motion.button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-6 py-2 rounded-md transition-all duration-300 ${
                    activeFilter === filter
                      ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/25'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {filter === 'all'
                    ? 'Tout'
                    : filter === 'movie'
                    ? 'Films'
                    : 'Séries'}
                </motion.button>
              ))}
            </motion.div>
          </div>

          {filteredMedia.length === 0 ? (
            <motion.div 
              className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="text-gray-400 max-w-sm">
                <p className="text-lg font-medium mb-2">Aucun média trouvé dans votre liste</p>
                <p className="text-sm">
                  Marquez des films et séries comme vus pour les retrouver ici
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {filteredMedia.map((media, index) => (
                <motion.div
                  key={media.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <Link
                    href={`/${'title' in media ? 'movie' : 'tv'}/${media.id}`}
                  >
                    <motion.div
                      className="group relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800/50"
                      whileHover={{ scale: 1.05 }}
                    >
                      <TMDBImage
                        path={media.poster_path}
                        alt={'name' in media ? media.name : media.title}
                        fill
                        type="poster"
                        className="object-cover transition-transform group-hover:scale-110"
                      />
                      <div className="absolute top-2 right-2">
                        <RatingCircle rating={media.vote_average} size="sm" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
                        <h3 className="text-white font-medium mb-1 line-clamp-2">
                          {'name' in media ? media.name : media.title}
                        </h3>
                        <p className="text-gray-300 text-sm">
                          {new Date(
                            'release_date' in media
                              ? media.release_date
                              : media.first_air_date
                          ).getFullYear()}
                        </p>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </main>
  )
} 