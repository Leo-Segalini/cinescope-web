'use client'

import { useState, useEffect } from 'react'
import { tmdbClient } from '@/services/tmdb/client'
import { Movie, TVShow } from '@/types'

interface UseStreamingProvidersResult {
  selectedProviders: number[]
  toggleProvider: (providerId: number) => void
  clearProviders: () => void
  isLoading: boolean
  error: Error | null
  results: (Movie | TVShow)[]
}

export function useStreamingProviders(mediaType: 'movie' | 'tv'): UseStreamingProvidersResult {
  const [selectedProviders, setSelectedProviders] = useState<number[]>([])
  const [results, setResults] = useState<(Movie | TVShow)[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const toggleProvider = (providerId: number) => {
    setSelectedProviders((current) =>
      current.includes(providerId)
        ? current.filter((id) => id !== providerId)
        : [...current, providerId]
    )
  }

  const clearProviders = () => {
    setSelectedProviders([])
  }

  useEffect(() => {
    async function fetchData() {
      if (selectedProviders.length === 0) {
        setResults([])
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const promises = selectedProviders.map((providerId) =>
          mediaType === 'movie'
            ? tmdbClient.getMoviesByWatchProvider(providerId)
            : tmdbClient.getTVShowsByWatchProvider(providerId)
        )

        const responses = await Promise.all(promises)
        
        // Fusionner et dédupliquer les résultats
        const allResults = responses.flatMap((response) => response.results as (Movie | TVShow)[])
        const uniqueResults = Array.from(
          new Map(allResults.map((item) => [item.id, item])).values()
        )

        setResults(uniqueResults)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch streaming data'))
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [selectedProviders, mediaType])

  return {
    selectedProviders,
    toggleProvider,
    clearProviders,
    isLoading,
    error,
    results
  }
} 