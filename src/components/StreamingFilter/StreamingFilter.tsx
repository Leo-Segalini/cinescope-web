'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

interface StreamingProvider {
  id: number
  name: string
  logo: string
}

const streamingProviders: StreamingProvider[] = [
  { id: 8, name: 'Netflix', logo: '/providers/netflix.png' },
  { id: 337, name: 'Disney Plus', logo: '/providers/disney-plus.png' },
  { id: 119, name: 'Amazon Prime', logo: '/providers/amazon-prime-video.png' },
  { id: 531, name: 'Paramount+', logo: '/providers/paramount-plus.png' },
  { id: 350, name: 'Apple TV+', logo: '/providers/apple-tv.png' },
  { id: 381, name: 'Canal+', logo: '/providers/canal-plus.png' },
  { id: 1870, name: 'ADN', logo: '/providers/adn.png' },
  { id: 56, name: 'OCS', logo: '/providers/ocs.png' },
]

interface StreamingFilterProps {
  selectedProvider: number | null
  onProviderChange: (providerId: number | null) => void
}

export const StreamingFilter = ({ selectedProvider, onProviderChange }: StreamingFilterProps) => {
  return (
    <div className="flex flex-wrap gap-4">
      {streamingProviders.map((provider) => (
        <motion.button
          key={provider.id}
          onClick={() => onProviderChange(selectedProvider === provider.id ? null : provider.id)}
          className={`relative h-12 w-12 rounded-lg overflow-hidden ${
            selectedProvider === provider.id
              ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-black'
              : 'hover:ring-2 hover:ring-gray-400 hover:ring-offset-2 hover:ring-offset-black'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Image
            src={provider.logo}
            alt={provider.name}
            fill
            className="object-cover"
          />
        </motion.button>
      ))}
    </div>
  )
} 