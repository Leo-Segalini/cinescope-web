'use client'

import { motion } from 'framer-motion'
import { Accordion } from '@/components/Accordion/Accordion'

const mediaTypeOptions = [
  { id: 'movie', name: 'Films' },
  { id: 'tv', name: 'Séries' },
]

interface MediaTypeFilterProps {
  selectedType: string | null
  onTypeChange: (type: string | null) => void
  className?: string
}

export const MediaTypeFilter = ({
  selectedType,
  onTypeChange,
  className = '',
}: MediaTypeFilterProps) => {
  const MediaTypeButtons = () => (
    <div className="flex flex-wrap gap-3">
      {mediaTypeOptions.map((type) => (
        <motion.button
          key={type.id}
          onClick={() => onTypeChange(selectedType === type.id ? null : type.id)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            selectedType === type.id
              ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {type.name}
        </motion.button>
      ))}
    </div>
  )

  return (
    <>
      {/* Version mobile/tablette avec accordéon */}
      <div className={`md:hidden ${className}`}>
        <Accordion title="Type de contenu" defaultOpen={false}>
          <MediaTypeButtons />
        </Accordion>
      </div>

      {/* Version desktop sans accordéon */}
      <div className={`hidden md:block p-4 bg-gray-900/50 rounded-lg ${className}`}>
        <h3 className="text-lg font-semibold text-white mb-4">Type de contenu</h3>
        <MediaTypeButtons />
      </div>
    </>
  )
} 