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
  // Récupération des paramètres de recherche depuis l'URL
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''

  // États pour gérer le chargement, les résultats et les filtres
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<(Movie | TVShow)[]>([])
  const [selectedProviders, setSelectedProviders] = useState<number[]>([])
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null)

  // Effet pour déclencher la recherche lors des changements de filtres ou de requête
  useEffect(() => {
    async function search() {
      // Si aucun critère de recherche n'est défini, réinitialiser les résultats
      if (!query && selectedProviders.length === 0 && !selectedGenre) {
        setResults([])
        return
      }

      setIsLoading(true)
      try {
        // Recherche avec les critères sélectionnés
        const response = await tmdbClient.searchByProvider(query, selectedProviders[0] || null, selectedGenre)
        setResults(response.results as (Movie | TVShow)[])
      } catch (error) {
        console.error('Error searching:', error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }

    search()
  }, [query, selectedProviders, selectedGenre])

  // Gestion de la sélection/désélection des fournisseurs de streaming
  const handleProviderToggle = (providerId: number) => {
    setSelectedProviders(prev => {
      if (prev.includes(providerId)) {
        return prev.filter(id => id !== providerId)
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
        
        {/* Filtres de recherche */}
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

      {/* Affichage des résultats ou des états de chargement/vide */}
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
                : 'Commencez à taper pour rechercher des films et des séries'}
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
