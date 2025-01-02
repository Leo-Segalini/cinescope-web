'use client'

import { Movie } from '@/types'
import { MediaGrid } from '@/components/MediaGrid/MediaGrid'
import { motion } from 'framer-motion'

// Props du composant MovieGrid
export interface MovieGridProps {
  title: string    // Titre de la section
  items: Movie[]   // Liste des films à afficher
}

export function MovieGrid({ title, items = [] }: MovieGridProps) {
  return (
    <section className="py-8">
      {/* Titre animé avec dégradé de couleurs */}
      <motion.h2
        className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {title}
      </motion.h2>
      {/* Grille de films */}
      <MediaGrid items={items} />
    </section>
  )
} 