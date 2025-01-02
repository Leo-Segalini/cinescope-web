'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { WatchProvidersResponse } from '@/types/tmdb'

// Props du composant principal
interface StreamingInfoProps {
  providers: WatchProvidersResponse  // Informations sur les fournisseurs de streaming
}

// URLs des plateformes de streaming
const PROVIDER_URLS = {
  NETFLIX: 'https://www.netflix.com/browse',
  AMAZON: 'https://www.primevideo.com',
  DISNEY: 'https://www.disneyplus.com/fr-fr',
  CANAL: 'https://www.canalplus.com',
  PARAMOUNT: 'https://www.paramountplus.com/fr/',
  ADN: 'https://animedigitalnetwork.fr',
  OCS: 'https://www.ocs.fr',
  APPLE: 'https://tv.apple.com/fr'
}

// Couleurs associées à chaque plateforme
const PROVIDER_COLORS = {
  NETFLIX: 'bg-red-600',
  AMAZON: 'bg-blue-600',
  DISNEY: 'bg-blue-700',
  CANAL: 'bg-black',
  PARAMOUNT: 'bg-blue-800',
  ADN: 'bg-purple-600',
  OCS: 'bg-orange-600',
  APPLE: 'bg-gray-800'
}

// Props du composant Accordion
interface AccordionSectionProps {
  title: string           // Titre de la section
  isOpen: boolean        // État d'ouverture
  onToggle: () => void   // Fonction de basculement
  children: React.ReactNode // Contenu de la section
}

// Composant Accordion pour les sections pliables
function AccordionSection({ title, isOpen, onToggle, children }: AccordionSectionProps) {
  return (
    <div className="border-b border-white/10">
      {/* En-tête cliquable */}
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full py-3 text-left"
      >
        <h4 className="text-white font-medium">{title}</h4>
        <ChevronDown
          className={`w-5 h-5 text-white transition-transform ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>
      {/* Contenu avec animation */}
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0 }}
        className="overflow-hidden"
      >
        <div className="pb-4">
          {children}
        </div>
      </motion.div>
    </div>
  )
}

export function StreamingInfo({ providers }: StreamingInfoProps) {
  // État pour gérer la section ouverte de l'accordéon
  const [openSection, setOpenSection] = useState<string | null>('streaming')

  // Récupère l'URL de la plateforme en fonction de son ID
  const getProviderUrl = (providerId: number) => {
    switch (providerId) {
      case 8: return PROVIDER_URLS.NETFLIX
      case 9: return PROVIDER_URLS.AMAZON
      case 337: return PROVIDER_URLS.DISNEY
      case 381: return PROVIDER_URLS.CANAL
      case 531: return PROVIDER_URLS.PARAMOUNT
      case 415: return PROVIDER_URLS.ADN
      case 56: return PROVIDER_URLS.OCS
      case 350: return PROVIDER_URLS.APPLE
      default: return null
    }
  }

  // Récupère la couleur de la plateforme en fonction de son ID
  const getProviderColor = (providerId: number) => {
    switch (providerId) {
      case 8: return PROVIDER_COLORS.NETFLIX
      case 9: return PROVIDER_COLORS.AMAZON
      case 337: return PROVIDER_COLORS.DISNEY
      case 381: return PROVIDER_COLORS.CANAL
      case 531: return PROVIDER_COLORS.PARAMOUNT
      case 415: return PROVIDER_COLORS.ADN
      case 56: return PROVIDER_COLORS.OCS
      case 350: return PROVIDER_COLORS.APPLE
      default: return 'bg-gray-700'
    }
  }

  // Message si aucune option de visionnage n'est disponible
  if (!providers.results.FR?.flatrate?.length && !providers.results.FR?.rent?.length && !providers.results.FR?.buy?.length) {
    return (
      <p className="text-gray-400">Non disponible en streaming pour le moment</p>
    )
  }

  // Gestion de l'ouverture/fermeture des sections
  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section)
  }

  return (
    <div className="space-y-1">
      {/* Section Streaming */}
      {providers.results.FR?.flatrate && providers.results.FR.flatrate.length > 0 && (
        <AccordionSection
          title="Streaming"
          isOpen={openSection === 'streaming'}
          onToggle={() => toggleSection('streaming')}
        >
          <div className="flex flex-wrap gap-4">
            {providers.results.FR.flatrate.map((provider) => {
              const url = getProviderUrl(provider.provider_id)
              const color = getProviderColor(provider.provider_id)
              
              return (
                <a
                  key={provider.provider_id}
                  href={url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative"
                >
                  {/* Logo de la plateforme */}
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                    <Image
                      src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                      alt={provider.provider_name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {/* Bouton "Regarder" avec animation */}
                  <motion.div
                    className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 text-[10px] text-white rounded-full opacity-0 group-hover:opacity-100 ${color}`}
                    initial={{ y: 10, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1 }}
                  >
                    Regarder
                  </motion.div>
                </a>
              )
            })}
          </div>
        </AccordionSection>
      )}

      {/* Section Location */}
      {providers.results.FR?.rent && providers.results.FR.rent.length > 0 && (
        <AccordionSection
          title="Location"
          isOpen={openSection === 'rent'}
          onToggle={() => toggleSection('rent')}
        >
          <div className="flex flex-wrap gap-4">
            {providers.results.FR.rent.map((provider) => {
              const url = getProviderUrl(provider.provider_id)
              const color = getProviderColor(provider.provider_id)
              
              return (
                <a
                  key={provider.provider_id}
                  href={url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative"
                >
                  {/* Logo de la plateforme */}
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                    <Image
                      src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                      alt={provider.provider_name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {/* Bouton "Louer" avec animation */}
                  <motion.div
                    className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 text-[10px] text-white rounded-full opacity-0 group-hover:opacity-100 ${color}`}
                    initial={{ y: 10, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1 }}
                  >
                    Louer
                  </motion.div>
                </a>
              )
            })}
          </div>
        </AccordionSection>
      )}

      {/* Section Achat */}
      {providers.results.FR?.buy && providers.results.FR.buy.length > 0 && (
        <AccordionSection
          title="Achat"
          isOpen={openSection === 'buy'}
          onToggle={() => toggleSection('buy')}
        >
          <div className="flex flex-wrap gap-4">
            {providers.results.FR.buy.map((provider) => {
              const url = getProviderUrl(provider.provider_id)
              const color = getProviderColor(provider.provider_id)
              
              return (
                <a
                  key={provider.provider_id}
                  href={url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative"
                >
                  {/* Logo de la plateforme */}
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                    <Image
                      src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                      alt={provider.provider_name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {/* Bouton "Acheter" avec animation */}
                  <motion.div
                    className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 text-[10px] text-white rounded-full opacity-0 group-hover:opacity-100 ${color}`}
                    initial={{ y: 10, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1 }}
                  >
                    Acheter
                  </motion.div>
                </a>
              )
            })}
          </div>
        </AccordionSection>
      )}
    </div>
  )
} 