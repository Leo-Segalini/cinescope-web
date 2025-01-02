'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Movie, TVShow } from '@/types'

interface SearchResultsProps {
  results: (Movie | TVShow)[]
}

export const SearchResults = ({ results }: SearchResultsProps) => {
  const getMediaType = (item: Movie | TVShow) => {
    if ('title' in item) return 'movie'
    if ('name' in item) return 'tv'
    return 'unknown'
  }

  const getTitle = (item: Movie | TVShow) => {
    if ('title' in item) return item.title
    if ('name' in item) return item.name
    return 'Titre inconnu'
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {results.map((item) => {
        const mediaType = getMediaType(item)
        const title = getTitle(item)

        return (
          <motion.div
            key={item.id}
            className="relative group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href={`/${mediaType}/${item.id}`}>
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
                <Image
                  src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '/images/no-poster.png'}
                  alt={title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-lg font-semibold line-clamp-2">{title}</h3>
                  <p className="text-sm text-gray-300 mt-1">
                    {mediaType === 'movie' ? 'Film' : 'Série'}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        )
      })}
    </div>
  )
} 