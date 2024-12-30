'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { MediaGrid } from '@/components/MediaGrid/MediaGrid'
import { searchMedia } from '@/services/api'
import { Movie, TVShow } from '@/types'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q')
  const [results, setResults] = useState<(Movie | TVShow)[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function performSearch() {
      if (!query) {
        setResults([])
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        const searchResults = await searchMedia(query)
        setResults(searchResults)
      } catch (err) {
        console.error('Error searching media:', err)
        setError('Une erreur est survenue lors de la recherche')
      } finally {
        setIsLoading(false)
      }
    }

    performSearch()
  }, [query])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-2xl">Recherche en cours...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-2xl">{error}</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">
          {query ? (
            <>Résultats pour &quot;{query}&quot;</>
          ) : (
            'Veuillez saisir un terme de recherche'
          )}
        </h1>

        {results.length > 0 ? (
          <MediaGrid items={results} />
        ) : query ? (
          <div className="text-white text-xl">Aucun résultat trouvé</div>
        ) : null}
      </div>
    </main>
  )
} 