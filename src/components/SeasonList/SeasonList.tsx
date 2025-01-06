'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { RatingCircle } from '../RatingCircle/RatingCircle'

interface Season {
  id: number
  name: string
  overview: string
  poster_path: string | null
  air_date: string | null
  episode_count: number
  season_number: number
  vote_average: number
}

interface SeasonListProps {
  seasons: Season[]
  tvShowId: number
}

export function SeasonList({ seasons, tvShowId }: SeasonListProps) {
  return (
    <div className="space-y-6">
      {seasons.map((season) => (
        <motion.div
          key={season.id}
          className="bg-gray-900/50 rounded-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link href={`/tv/${tvShowId}/season/${season.season_number}`}>
            <div className="grid md:grid-cols-[200px,1fr] gap-6 p-4">
              {/* Poster */}
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
                <Image
                  src={season.poster_path ? `https://image.tmdb.org/t/p/w500${season.poster_path}` : '/placeholder-tv.png'}
                  alt={season.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2">
                  <RatingCircle rating={season.vote_average} size="sm" />
                </div>
              </div>

              {/* Informations */}
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{season.name}</h3>
                    <p className="text-gray-400">
                      {season.episode_count} épisode{season.episode_count > 1 ? 's' : ''}
                      {season.air_date && ` • ${new Date(season.air_date).toLocaleDateString('fr-FR')}`}
                    </p>
                  </div>
                </div>

                {season.overview && (
                  <p className="text-gray-300 line-clamp-3">{season.overview}</p>
                )}
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
} 