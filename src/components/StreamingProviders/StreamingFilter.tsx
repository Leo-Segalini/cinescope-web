'use client'

import { TMDBClient } from '@/services/tmdb/client'
import Image from 'next/image'
import { motion } from 'framer-motion'

// Props du composant StreamingFilter
interface StreamingFilterProps {
  selectedProviders: number[]          // IDs des plateformes sélectionnées
  onProviderToggle: (providerId: number) => void  // Fonction de gestion des sélections
  className?: string                   // Classes CSS additionnelles
}

// Liste des plateformes de streaming disponibles
const PROVIDERS = [
  { id: TMDBClient.PROVIDERS.NETFLIX, name: 'Netflix', logo: '/providers/netflix.png' },
  { id: TMDBClient.PROVIDERS.DISNEY_PLUS, name: 'Disney+', logo: '/providers/disney-plus.png' },
  { id: TMDBClient.PROVIDERS.AMAZON_PRIME, name: 'Prime Video', logo: '/providers/amazon-prime-video.png' },
  { id: TMDBClient.PROVIDERS.CANAL_PLUS, name: 'Canal+', logo: '/providers/canal-plus.png' },
  { id: TMDBClient.PROVIDERS.CRUNCHYROLL, name: 'Crunchyroll', logo: '/providers/crunchyroll.png' },
  { id: TMDBClient.PROVIDERS.PARAMOUNT_PLUS, name: 'Paramount+', logo: '/providers/paramount-plus.png' },
  { id: TMDBClient.PROVIDERS.ADN, name: 'ADN', logo: '/providers/adn.png' },
  { id: TMDBClient.PROVIDERS.OCS, name: 'OCS', logo: '/providers/ocs.png' },
  { id: TMDBClient.PROVIDERS.APPLE_TV, name: 'Apple TV+', logo: '/providers/apple-tv.png' }
]

export function StreamingFilter({ selectedProviders, onProviderToggle, className = '' }: StreamingFilterProps) {
  return (
    <div className={`${className} p-4 bg-gray-900/50 rounded-lg`}>
      {/* Titre de la section */}
      <h3 className="text-lg font-semibold text-white mb-4">Plateformes de streaming</h3>

      {/* Grille de boutons des plateformes */}
      <div className="flex flex-wrap gap-3">
        {PROVIDERS.map((provider) => {
          const isSelected = selectedProviders.includes(provider.id)
          return (
            // Bouton animé pour chaque plateforme
            <motion.button
              key={provider.id}
              onClick={() => onProviderToggle(provider.id)}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                isSelected
                  ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg shadow-purple-500/25' // Style sélectionné
                  : 'bg-gray-800 hover:bg-gray-700' // Style non sélectionné
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Logo de la plateforme */}
              <div className="relative w-6 h-6">
                <Image
                  src={provider.logo}
                  alt={provider.name}
                  fill
                  className="object-contain"
                />
              </div>
              {/* Nom de la plateforme */}
              <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                {provider.name}
              </span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
} 