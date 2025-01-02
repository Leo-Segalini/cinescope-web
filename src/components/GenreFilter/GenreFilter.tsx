'use client'

import { motion } from 'framer-motion'
import { Accordion } from '@/components/Accordion/Accordion'

// Interface pour la structure d'un genre
interface Genre {
  id: number    // Identifiant unique du genre (selon TMDB)
  name: string  // Nom du genre en français
}

// Liste des genres disponibles avec leurs IDs TMDB
const genres: Genre[] = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Aventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comédie' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentaire' },
  { id: 18, name: 'Drame' },
  { id: 10751, name: 'Famille' },
  { id: 14, name: 'Fantastique' },
  { id: 36, name: 'Histoire' },
  { id: 27, name: 'Horreur' },
  { id: 10402, name: 'Musique' },
  { id: 9648, name: 'Mystère' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science-Fiction' },
  { id: 10770, name: 'Téléfilm' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'Guerre' },
  { id: 37, name: 'Western' },
]

// Props du composant GenreFilter
interface GenreFilterProps {
  selectedGenre: number | null           // ID du genre sélectionné (null si aucun)
  onGenreChange: (genreId: number | null) => void  // Fonction de gestion de la sélection
  className?: string                     // Classes CSS additionnelles
}

export const GenreFilter = ({ selectedGenre, onGenreChange, className = '' }: GenreFilterProps) => {
  const GenreButtons = () => (
    <div className="flex flex-wrap gap-3">
      {genres.map((genre) => (
        <motion.button
          key={genre.id}
          onClick={() => onGenreChange(selectedGenre === genre.id ? null : genre.id)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            selectedGenre === genre.id
              ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {genre.name}
        </motion.button>
      ))}
    </div>
  )

  return (
    <>
      {/* Version mobile/tablette avec accordéon */}
      <div className={`md:hidden ${className}`}>
        <Accordion title="Genres" defaultOpen={false}>
          <GenreButtons />
        </Accordion>
      </div>

      {/* Version desktop sans accordéon */}
      <div className={`hidden md:block p-4 bg-gray-900/50 rounded-lg ${className}`}>
        <h3 className="text-lg font-semibold text-white mb-4">Genres</h3>
        <GenreButtons />
      </div>
    </>
  )
} 