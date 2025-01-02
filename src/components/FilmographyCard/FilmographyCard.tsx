'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { RatingCircle } from '../RatingCircle/RatingCircle'

interface FilmographyCardProps {
  id: number
  title: string
  character: string
  posterPath: string | null
  voteAverage: number
  type: 'movie' | 'tv'
}

export function FilmographyCard({ id, title, character, posterPath, voteAverage, type }: FilmographyCardProps) {
  return (
    <Link href={`/${type}/${id}`}>
      <motion.div
        className="group relative"
        whileHover={{ scale: 1.05 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Poster */}
        <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2">
          <Image
            src={posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : `/placeholder-${type}.png`}
            alt={title}
            fill
            className="object-cover transition-transform group-hover:scale-110"
          />
          
          {/* Rating Circle */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <RatingCircle rating={voteAverage} size="sm" />
          </div>
        </div>

        {/* Title and Character */}
        <div className="space-y-1">
          <h3 className="font-medium text-white truncate">{title}</h3>
          <p className="text-sm text-gray-400 truncate">{character}</p>
        </div>
      </motion.div>
    </Link>
  )
} 