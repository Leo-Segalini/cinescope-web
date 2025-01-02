'use client'

import { motion } from 'framer-motion'
import { Play, Info } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { WatchProvidersResponse } from '@/types/tmdb'

// Props du composant Hero
interface HeroProps {
  title: string                    // Titre du film/série
  overview: string                 // Description du film/série
  backdropPath: string | null      // Chemin de l'image de fond
  type: 'movie' | 'tv'            // Type de contenu (film ou série)
  id: number                      // Identifiant unique
  watchProviders?: WatchProvidersResponse  // Informations sur les plateformes de streaming
}

// Couleurs personnalisées pour chaque fournisseur de streaming
const PROVIDER_COLORS = {
  'Netflix': 'bg-[#E50914] hover:bg-[#B2070F]',
  'Disney Plus': 'bg-[#113CCF] hover:bg-[#0D2E9E]',
  'Amazon Prime Video': 'bg-[#00A8E1] hover:bg-[#0086B3]',
  'Canal+': 'bg-black hover:bg-gray-900',
  'Apple TV': 'bg-black hover:bg-gray-900',
  'OCS': 'bg-[#F48220] hover:bg-[#D66A0F]',
  'Crunchyroll': 'bg-[#F47521] hover:bg-[#D65511]',
  'Paramount+': 'bg-[#0064FF] hover:bg-[#0052CC]',
  'ADN': 'bg-[#1A1A1A] hover:bg-[#000000]',
  'default': 'bg-blue-600 hover:bg-blue-700'
} as const

// URLs des plateformes de streaming
const PROVIDER_URLS = {
  'Netflix': 'https://www.netflix.com/browse',
  'Disney Plus': 'https://www.disneyplus.com',
  'Amazon Prime Video': 'https://www.primevideo.com',
  'Canal+': 'https://www.canalplus.com',
  'Apple TV': 'https://tv.apple.com',
  'OCS': 'https://www.ocs.fr',
  'Crunchyroll': 'https://www.crunchyroll.com',
  'Paramount+': 'https://www.paramountplus.com',
  'ADN': 'https://animedigitalnetwork.fr'
} as const

export function Hero({ title, overview, backdropPath, type, id, watchProviders }: HeroProps) {
  // Récupération du premier fournisseur de streaming disponible en France
  const mainProvider = watchProviders?.results?.FR?.flatrate?.[0]

  return (
    <div className="relative h-screen">
      {/* Section de l'image de fond avec overlay */}
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
        {/* Overlay gradient pour améliorer la lisibilité du texte */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
      </div>

      {/* Contenu principal avec animations */}
      <div className="relative flex h-full items-center">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl space-y-4"
          >
            {/* Titre et description */}
            <h1 className="text-4xl font-bold text-white md:text-6xl">{title}</h1>
            <p className="text-lg text-gray-300">{overview}</p>

            {/* Boutons d'action */}
            <div className="flex gap-4 flex-wrap">
              {/* Bouton de streaming si disponible */}
              {mainProvider && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <a
                    href={PROVIDER_URLS[mainProvider.provider_name as keyof typeof PROVIDER_URLS] || watchProviders?.results?.FR?.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 rounded-lg ${PROVIDER_COLORS[mainProvider.provider_name as keyof typeof PROVIDER_COLORS] || PROVIDER_COLORS.default} px-6 py-3 font-semibold text-white transition-colors`}
                  >
                    <Play size={20} />
                    Regarder sur {mainProvider.provider_name}
                  </a>
                </motion.div>
              )}

              {/* Bouton "Plus d'infos" */}
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