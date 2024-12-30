'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

interface MediaCardProps {
  id: number
  title: string
  posterPath: string | null
  releaseDate?: string
  voteAverage?: number
  type: 'movie' | 'tv'
}

export const MediaCard = ({
  id,
  title,
  posterPath,
  releaseDate,
  voteAverage,
  type,
}: MediaCardProps) => {
  const year = releaseDate ? new Date(releaseDate).getFullYear() : null
  const rating = voteAverage ? Math.round(voteAverage * 10) / 10 : null

  return (
    <motion.div
      className="group relative aspect-[2/3] overflow-hidden rounded-lg bg-gray-900 shadow-xl"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}
    >
      <Link href={`/${type}/${id}`}>
        {posterPath ? (
          <Image
            src={`https://image.tmdb.org/t/p/w500${posterPath}`}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
            <span className="text-gray-400">No image available</span>
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Content */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-8 transition-transform duration-300 group-hover:translate-y-0">
          <motion.h3
            className="text-lg font-semibold text-white line-clamp-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {title}
          </motion.h3>

          <motion.div
            className="mt-2 flex items-center gap-2 text-sm text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {year && <span>{year}</span>}
            {rating && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>{rating}</span>
              </div>
            )}
          </motion.div>
        </div>
      </Link>
    </motion.div>
  )
} 