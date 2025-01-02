'use client'

import { Suspense } from 'react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Movie, TVShow } from '@/types'
import { tmdbClient } from '@/services/tmdb/client'
import { LoadingSpinner } from '@/components/LoadingSpinner/LoadingSpinner'
import { SearchGrid } from '@/components/SearchResults/SearchGrid'
import { StreamingFilter } from '@/components/StreamingProviders/StreamingFilter'
import { GenreFilter } from '@/components/GenreFilter/GenreFilter'

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''

  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<(Movie | TVShow)[]>([])
  const [selectedProviders, setSelectedProviders] = useState<number[]>([])
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null)

  useEffect(() => {
    async function search() {
      setIsLoading(true)
      try {
        const response = await tmdbClient.searchWithFilters(
          query,
          selectedProviders[0] || null,
          selectedGenre
        )
        setResults(response.results)
      } catch (error) {
        console.error('Error searching:', error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }

    // Délai de 300ms pour éviter trop de requêtes
    const timeoutId = setTimeout(search, 300)
    return () => clearTimeout(timeoutId)
  }, [query, selectedProviders, selectedGenre])

  const handleProviderToggle = (providerId: number) => {
    setSelectedProviders(prev => {
      if (prev.includes(providerId)) {
        return []
      }
      return [providerId]
    })
  }

  return (
    <div className="container mx-auto px-4 pt-24">
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-white">
          {query ? `Résultats pour "${query}"` : 'Rechercher'}
        </h1>
        
        <div className="space-y-4">
          <StreamingFilter
            selectedProviders={selectedProviders}
            onProviderToggle={handleProviderToggle}
          />

          <GenreFilter
            selectedGenre={selectedGenre}
            onGenreChange={setSelectedGenre}
          />
        </div>
      </div>

      <div className="mt-8">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : results.length > 0 ? (
          <SearchGrid items={results} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">
              {query || selectedProviders.length > 0 || selectedGenre
                ? 'Aucun résultat trouvé'
                : 'Utilisez les filtres ou commencez à taper pour rechercher'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-16">
      <Suspense fallback={
        <div className="container mx-auto px-4 pt-24">
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      }>
        <SearchContent />
      </Suspense>
    </main>
  )
}
