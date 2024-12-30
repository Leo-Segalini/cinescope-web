'use client'

import { motion } from 'framer-motion'
import { Play, Info } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface HeroProps {
  title: string
  overview: string
  backdropPath: string | null
  type: 'movie' | 'tv'
  id: number
  watchUrl?: string
}

export function Hero({ title, overview, backdropPath, type, id, watchUrl }: HeroProps) {
  return (
    <div className="relative h-screen">
      {/* Image de fond */}
      <div className="absolute inset-0">
        {backdropPath ? (
          <Image
            src={`https://image.tmdb.org/t/p/original${backdropPath}`}
            alt=""
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="h-full w-full bg-gray-900" />
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
      </div>

      {/* Contenu */}
      <div className="relative flex h-full items-center">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl space-y-4"
          >
            <h1 className="text-4xl font-bold text-white md:text-6xl">{title}</h1>
            <p className="text-lg text-gray-300">{overview}</p>

            <div className="flex gap-4 flex-wrap">
              {watchUrl && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <a
                    href={`https://www.google.com/search?q=regarder+${encodeURIComponent(title)}+${encodeURIComponent(watchUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-red-700"
                  >
                    <Play size={20} />
                    Regarder maintenant sur {watchUrl}
                  </a>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Link
                  href={`/${type}/${id}`}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                >
                  <Info size={20} />
                  Plus d&apos;infos
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 