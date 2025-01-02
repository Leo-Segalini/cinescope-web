'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { RatingCircle } from '@/components/RatingCircle/RatingCircle'

// Props du composant MediaCard
interface MediaCardProps {
  id: number              // Identifiant unique du média
  title: string          // Titre du média
  posterPath: string | null  // Chemin de l'affiche
  releaseDate?: string   // Date de sortie (optionnelle)
  voteAverage?: number   // Note moyenne (optionnelle)
  type: 'movie' | 'tv'   // Type de média (film ou série)
}

export const MediaCard = ({
  id,
  title,
  posterPath,
  releaseDate,
  voteAverage,
  type,
}: MediaCardProps) => {
  // Extraction de l'année de sortie
  const year = releaseDate ? new Date(releaseDate).getFullYear() : null

  return (
    // Conteneur avec animations et effets de survol
    <motion.div
      className="group relative aspect-[2/3] overflow-hidden rounded-lg bg-gray-900 shadow-xl"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}
    >
      <Link href={`/${type}/${id}`}>
        {/* Affichage de l'image ou placeholder */}
        {posterPath ? (
          <Image
            src={`https://image.tmdb.org/t/p/w500${posterPath}`}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
            <span className="text-gray-400">No image available</span>
          </div>
        )}

        {/* Overlay avec dégradé pour améliorer la lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Affichage de la note si disponible */}
        {voteAverage && (
          <div className="absolute top-2 right-2 z-10">
            <div className="bg-black/50 pt-1 pr-1 rounded-full backdrop-blur-sm flex items-center justify-center">
              <div className="flex items-center justify-center">
                <RatingCircle rating={voteAverage} size="sm"/>
              </div>
            </div>
          </div>
        )}

        {/* Zone de contenu avec titre et année */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-8 transition-transform duration-300 group-hover:translate-y-0">
          {/* Titre avec animation */}
          <motion.h3
            className="text-lg font-semibold text-white line-clamp-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {title}
          </motion.h3>

          {/* Année avec animation */}
          <motion.div
            className="mt-2 flex items-center gap-2 text-sm text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {year && <span>{year}</span>}
          </motion.div>
        </div>
      </Link>
    </motion.div>
  )
} 