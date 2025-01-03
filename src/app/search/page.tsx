'use client'

import { Suspense } from 'react'
import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Movie, TVShow } from '@/types'
import { tmdbClient } from '@/services/tmdb/client'
import { LoadingSpinner } from '@/components/LoadingSpinner/LoadingSpinner'
import { SearchGrid } from '@/components/SearchResults/SearchGrid'
import { StreamingFilter } from '@/components/StreamingProviders/StreamingFilter'
import { GenreFilter } from '@/components/GenreFilter/GenreFilter'
import { MediaTypeFilter } from '@/components/MediaTypeFilter/MediaTypeFilter'
import { SearchBar } from '@/components/SearchBar/SearchBar'

function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get('q') || ''

  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<(Movie | TVShow)[]>([])
  const [selectedProviders, setSelectedProviders] = useState<number[]>([])
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<(Movie | TVShow)[]>([])
  const [currentPage] = useState(1)

  // Fonction pour charger le contenu avec filtres
  const loadContent = useCallback(async () => {
    setIsLoading(true)
    try {
      if (query) {
        // Si on a une recherche, utiliser searchWithFilters
        const response = await tmdbClient.searchWithFilters(
          query,
          selectedProviders[0] || null,
          selectedGenre,
          selectedType
        )
        setResults(response.results)
      } else {
        // Sinon, charger le contenu découverte
        let allResults: (Movie | TVShow)[] = []

        if (!selectedType || selectedType === 'movie') {
          const movieResponse = await tmdbClient.discoverContent(
            currentPage,
            'movie',
            selectedGenre,
            selectedProviders[0] || null
          )
          allResults = [...allResults, ...movieResponse.results]
        }

        if (!selectedType || selectedType === 'tv') {
          const tvResponse = await tmdbClient.discoverContent(
            currentPage,
            'tv',
            selectedGenre,
            selectedProviders[0] || null
          )
          allResults = [...allResults, ...tvResponse.results]
        }

        setResults(allResults)
      }
    } catch (error) {
      console.error('Error loading content:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [query, selectedProviders, selectedGenre, selectedType, currentPage])

  // Fonction pour la recherche avec autocomplétion
  const handleSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setSuggestions([])
      return
    }

    try {
      const response = await tmdbClient.searchWithFilters(
        searchQuery,
        null,
        null,
        selectedType
      )
      setSuggestions(response.results.slice(0, 5))
    } catch (error) {
      console.error('Error fetching suggestions:', error)
      setSuggestions([])
    }
  }, [selectedType])

  // Charger le contenu initial et lors des changements de filtres
  useEffect(() => {
    loadContent()
  }, [loadContent])

  const handleProviderToggle = (providerId: number) => {
    setSelectedProviders(prev => {
      if (prev.includes(providerId)) {
        return []
      }
      return [providerId]
    })
  }

  const handleSearchSubmit = useCallback((searchQuery: string) => {
    if (searchQuery.trim()) {
      if (searchQuery.includes('/')) {
        // Si c'est une navigation directe vers un film/série
        router.push(`/${searchQuery}`)
      } else {
        // Si c'est une recherche normale
        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      }
    }
  }, [router])

  return (
    <div className="container mx-auto px-4 pt-24">
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-white">
            {query ? `Résultats pour "${query}"` : 'Explorer'}
          </h1>
          <SearchBar 
            onSearch={handleSearch}
            onSubmit={handleSearchSubmit}
            suggestions={suggestions}
            setSuggestions={setSuggestions}
          />
        </div>
        
        <div className="space-y-4">
          <MediaTypeFilter
            selectedType={selectedType}
            onTypeChange={setSelectedType}
          />

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
              {query || selectedProviders.length > 0 || selectedGenre || selectedType
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
