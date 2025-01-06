'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { MediaCard } from '@/components/MediaCard/MediaCard'
import type { Movie, TVShow } from '@/types'

// Props du composant MediaGrid
interface MediaGridProps {
  items: (Movie | TVShow)[]  // Liste des médias à afficher (films ou séries)
}

export const MediaGrid = ({ items = [] }: MediaGridProps) => {
  // Référence pour la détection de visibilité
  const gridRef = useRef(null)
  // Détecte si la grille est visible dans le viewport
  const isInView = useInView(gridRef, { once: true, amount: 0.2 })

  // Animation du conteneur avec effet d'apparition progressive des enfants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Délai entre l'animation de chaque enfant
      },
    },
  }

  // Animation pour chaque élément de la grille
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  }

  // Affichage d'un message si aucun contenu n'est disponible
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
      {/* Mapping des items avec animation individuelle */}
      {items.map((item) => (
        <motion.div key={item.id} variants={itemVariants}>
          <MediaCard
            key={item.id}
            id={item.id}
            title={'title' in item ? item.title : item.name}
            posterPath={item.poster_path}
            releaseDate={'release_date' in item ? item.release_date ?? undefined : item.first_air_date ?? undefined}
            voteAverage={item.vote_average}
            type={'title' in item ? 'movie' : 'tv'}
          />
        </motion.div>
      ))}
    </motion.div>
  )
} 