'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

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
            priority={false}
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkMjU1LC0yMi4xODY6Nzg2OjEwRUhGSU1OTjY+PkVHSkhGTj42Pj7/2wBDAR"
          />
        ) : (
          <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
            <span className="text-gray-500 text-sm">No image</span>
          </div>
        )}

        {/* Overlay avec informations */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white font-semibold truncate mb-1 min-h-[1.5rem]">{title}</h3>
            {releaseDate && (
              <p className="text-gray-300 text-sm min-h-[1.25rem]">
                {new Date(releaseDate).getFullYear()}
              </p>
            )}
            {typeof voteAverage === 'number' && voteAverage > 0 && (
              <div className="flex items-center gap-1 text-yellow-500 min-h-[1.25rem]">
                <span>★</span>
                <span>{voteAverage.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
} 