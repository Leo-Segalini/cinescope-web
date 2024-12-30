'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { searchMedia } from '@/services/api'
import { Movie, TVShow } from '@/types'
import { MediaGrid } from '@/components/MediaGrid/MediaGrid'
import { motion } from 'framer-motion'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<(Movie | TVShow)[]>([])

  useEffect(() => {
    async function performSearch() {
      if (!query) {
        setResults([])
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        console.log('Searching for:', query)
        const searchResults = await searchMedia(query)
        console.log('Search results:', searchResults?.length)
        setResults(searchResults)
      } catch (err) {
        console.error('Error searching:', err)
        setError('Une erreur est survenue lors de la recherche')
      } finally {
        setIsLoading(false)
      }
    }

    performSearch()
  }, [query])

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-32">
      <div className="container mx-auto px-4">
        <motion.h1
          className="text-3xl font-bold mb-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {query
            ? `Résultats pour "${query}"`
            : 'Rechercher un film, une série ou un anime'}
        </motion.h1>

        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="text-white text-xl">Recherche en cours...</div>
          </div>
        )}

        {error && (
          <div className="flex justify-center py-12">
            <div className="text-red-500 text-xl">{error}</div>
          </div>
        )}

        {!isLoading && !error && query && results.length === 0 && (
          <div className="flex justify-center py-12">
            <div className="text-gray-400 text-xl">
              Aucun résultat trouvé pour "{query}"
            </div>
          </div>
        )}

        {!isLoading && !error && results.length > 0 && (
          <MediaGrid items={results} />
        )}

        {!query && (
          <div className="flex justify-center py-12">
            <div className="text-gray-400 text-xl">
              Utilisez la barre de recherche pour trouver du contenu
            </div>
          </div>
        )}
      </div>
    </main>
  )
} 