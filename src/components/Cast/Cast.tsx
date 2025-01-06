'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { TMDBImage } from '@/components/common/TMDBImage'

interface CastMember {
  id: number
  name: string
  character: string
  profile_path: string | null
}

interface CastProps {
  cast: CastMember[]
}

export function Cast({ cast }: CastProps) {
  if (!cast || cast.length === 0) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
    >
      {cast.slice(0, 12).map((actor) => (
        <Link href={`/person/${actor.id}`} key={actor.id}>
          <motion.div className="group" whileHover={{ scale: 1.05 }}>
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2">
              <TMDBImage
                path={actor.profile_path}
                alt={actor.name}
                fill
                type="profile"
                className="object-cover transition-transform group-hover:scale-110"
              />
            </div>
            <div className="space-y-1">
              <h3 className="font-medium text-white truncate">{actor.name}</h3>
              <p className="text-sm text-gray-400 truncate">{actor.character}</p>
            </div>
          </motion.div>
        </Link>
      ))}
    </motion.div>
  )
} 