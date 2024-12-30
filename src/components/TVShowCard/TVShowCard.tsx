'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { TVShow } from '@/types/tmdb'
import { TMDBImage } from '@/components/common/TMDBImage'

interface TVShowCardProps {
  show: TVShow
  priority?: boolean
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export const TVShowCard = ({ show, priority = false }: TVShowCardProps) => {
  return (
    <motion.div variants={item}>
      <Link href={`/tv/${show.id}`} className="group block">
        <article className="relative overflow-hidden rounded-xl bg-gray-800 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl">
          <div className="aspect-[2/3] relative">
            <TMDBImage
              path={show.poster_path}
              alt={show.name}
              fill
              priority={priority}
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
            <h2 className="text-lg font-bold text-white">{show.name}</h2>
            <div className="mt-2 flex items-center gap-2">
              <span className="rounded bg-yellow-500 px-2 py-1 text-sm font-semibold text-black">
                ★ {show.vote_average.toFixed(1)}
              </span>
              <span className="text-sm text-gray-300">
                {new Date(show.first_air_date).getFullYear()}
              </span>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  )
} 