'use client'

import { MediaGrid } from '@/components/MediaGrid/MediaGrid'
import { motion } from 'framer-motion'
import { Movie } from '@/types'

interface MovieGridProps {
  title: string
  items: Movie[]
}

export const MovieGrid = ({ title, items = [] }: MovieGridProps) => {
  return (
    <section className="py-8">
      <motion.h2
        className="text-2xl font-bold mb-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {title}
      </motion.h2>
      <MediaGrid items={items} />
    </section>
  )
} 