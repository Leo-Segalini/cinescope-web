'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface CastMember {
  id: number
  name: string
  character: string
  profile_path: string | null
}

interface CastSectionProps {
  cast: CastMember[]
}

export function CastSection({ cast }: CastSectionProps) {
  // Limiter à 6 acteurs principaux
  const mainCast = cast.slice(0, 6)

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold text-white mb-6">Acteurs Principaux</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {mainCast.map((actor) => (
          <motion.div
            key={actor.id}
            className="relative group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href={`/person/${actor.id}`}>
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2">
                <Image
                  src={actor.profile_path
                    ? `https://image.tmdb.org/t/p/w300${actor.profile_path}`
                    : '/placeholder-profile.png'
                  }
                  alt={actor.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-110"
                />
              </div>
              <div className="text-center">
                <h4 className="text-white font-semibold truncate">{actor.name}</h4>
                <p className="text-gray-400 text-sm truncate">{actor.character}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
} 