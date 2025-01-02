'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

interface ActorCardProps {
  id: number
  name: string
  character?: string
  profilePath: string | null
  size?: 'sm' | 'md' | 'lg'
}

export function ActorCard({ id, name, character, profilePath, size = 'md' }: ActorCardProps) {
  const sizeClasses = {
    sm: 'w-32',
    md: 'w-40',
    lg: 'w-48'
  }

  return (
    <Link href={`/person/${id}`}>
      <motion.div
        className={`${sizeClasses[size]} group`}
        whileHover={{ scale: 1.05 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2">
          <Image
            src={profilePath ? `https://image.tmdb.org/t/p/w500${profilePath}` : '/placeholder-actor.png'}
            alt={name}
            fill
            className="object-cover transition-transform group-hover:scale-110"
          />
        </div>
        <div className="space-y-1">
          <h3 className="font-medium text-white truncate">{name}</h3>
          {character && (
            <p className="text-sm text-gray-400 truncate">{character}</p>
          )}
        </div>
      </motion.div>
    </Link>
  )
} 