'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { MediaCard } from '@/components/MediaCard/MediaCard'
import type { Movie, TVShow } from '@/types'

interface MediaGridProps {
  items: (Movie | TVShow)[]
}

export const MediaGrid = ({ items = [] }: MediaGridProps) => {
  const gridRef = useRef(null)
  const isInView = useInView(gridRef, { once: true, amount: 0.2 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  }

  if (!items || items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center py-12"
      >
        <p className="text-gray-400">Aucun contenu disponible</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      ref={gridRef}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6"
    >
      {items.map((item) => (
        <motion.div key={item.id} variants={itemVariants}>
          <MediaCard
            id={item.id}
            title={'title' in item ? item.title : item.name}
            posterPath={item.poster_path}
            releaseDate={'release_date' in item ? item.release_date : item.first_air_date}
            voteAverage={item.vote_average}
            type={'title' in item ? 'movie' : 'tv'}
          />
        </motion.div>
      ))}
    </motion.div>
  )
} 