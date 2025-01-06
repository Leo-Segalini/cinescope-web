'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { TMDBImage } from '@/components/common/TMDBImage'
import { RatingCircle } from '@/components/RatingCircle/RatingCircle'
import { Movie, TVShow } from '@/types/tmdb'

interface SimilarMediaProps {
  media: (Movie | TVShow)[]
  type: 'movie' | 'tv'
}

export function SimilarMedia({ media, type }: SimilarMediaProps) {
  if (!media || media.length === 0) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
    >
      {media.slice(0, 12).map((item) => (
        <Link href={`/${type}/${item.id}`} key={item.id}>
          <motion.div className="group" whileHover={{ scale: 1.05 }}>
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2">
              <TMDBImage
                path={item.poster_path}
                alt={type === 'movie' ? (item as Movie).title : (item as TVShow).name}
                fill
                type="poster"
                className="object-cover transition-transform group-hover:scale-110"
              />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <RatingCircle rating={item.vote_average} size="sm" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-white truncate">
                {type === 'movie' ? (item as Movie).title : (item as TVShow).name}
              </h3>
              {type === 'movie' ? (
                (item as Movie).release_date && (
                  <p className="text-sm text-gray-400">
                    {new Date((item as Movie).release_date).getFullYear()}
                  </p>
                )
              ) : (
                (item as TVShow).first_air_date && (
                  <p className="text-sm text-gray-400">
                    {new Date((item as TVShow).first_air_date).getFullYear()}
                  </p>
                )
              )}
            </div>
          </motion.div>
        </Link>
      ))}
    </motion.div>
  )
} 