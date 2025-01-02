'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Movie, TVShow } from '@/types'
import { tmdbClient } from '@/services/tmdb/client'

interface UseStreamingFilterResult<T> {
  selectedProviders: number[]
  toggleProvider: (providerId: number) => void
  filteredItems: T[]
  isLoading: boolean
  error: string | null
}

export function useStreamingFilter<T extends Movie | TVShow>(items: T[]): UseStreamingFilterResult<T> {
  const [selectedProviders, setSelectedProviders] = useState<number[]>([])
  const [filteredItems, setFilteredItems] = useState<T[]>(items)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const previousItemsRef = useRef<T[]>([])

  const toggleProvider = (providerId: number) => {
    setSelectedProviders(current =>
      current.includes(providerId)
        ? current.filter(id => id !== providerId)
        : [...current, providerId]
    )
  }

  const haveItemsChanged = useCallback((newItems: T[]) => {
    if (previousItemsRef.current.length !== newItems.length) return true
    return newItems.some((item, index) => item.id !== previousItemsRef.current[index]?.id)
  }, [])

  useEffect(() => {
    if (haveItemsChanged(items)) {
      previousItemsRef.current = items
      if (selectedProviders.length === 0) {
        setFilteredItems(items)
      }
    }
  }, [items, haveItemsChanged, selectedProviders.length])

  useEffect(() => {
    async function filterByProviders() {
      if (selectedProviders.length === 0) {
        setFilteredItems(items)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        
        const filteredResults = await Promise.all(
          items.map(async (item) => {
            try {
              const providers = 'title' in item
                ? await tmdbClient.getMovieWatchProviders(item.id)
                : await tmdbClient.getTVShowWatchProviders(item.id)

              const availableProviders = providers.results.FR?.flatrate?.map(p => p.provider_id) || []
              return {
                item,
                isAvailable: selectedProviders.some(id => availableProviders.includes(id))
              }
            } catch (error) {
              console.error(`Error fetching providers for item ${item.id}:`, error)
              return { item, isAvailable: false }
            }
          })
        )

        setFilteredItems(
          filteredResults
            .filter(({ isAvailable }) => isAvailable)
            .map(({ item }) => item)
        )
      } catch (err) {
        setError('Erreur lors du filtrage par plateforme')
        console.error('Error filtering by providers:', err)
      } finally {
        setIsLoading(false)
      }
    }

    filterByProviders()
  }, [items, selectedProviders])

  return {
    selectedProviders,
    toggleProvider,
    filteredItems,
    isLoading,
    error
  }
} 