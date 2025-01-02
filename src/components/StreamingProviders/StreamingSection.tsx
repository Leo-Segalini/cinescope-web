'use client'

import { useEffect, useState } from 'react'
import { tmdbClient } from '@/services/tmdb/client'
import { Provider } from '@/types/tmdb'
import { StreamingProviders } from './StreamingProviders'

interface StreamingSectionProps {
  mediaType: 'movie' | 'tv'
  mediaId: number
  className?: string
}

export function StreamingSection({ mediaType, mediaId, className = '' }: StreamingSectionProps) {
  const [streamingProviders, setStreamingProviders] = useState<Provider[]>([])
  const [rentProviders, setRentProviders] = useState<Provider[]>([])
  const [buyProviders, setBuyProviders] = useState<Provider[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchProviders() {
      try {
        const response = mediaType === 'movie'
          ? await tmdbClient.getMovieWatchProviders(mediaId)
          : await tmdbClient.getTVShowWatchProviders(mediaId)

        const frResults = response.results.FR

        if (frResults) {
          setStreamingProviders(frResults.flatrate || [])
          setRentProviders(frResults.rent || [])
          setBuyProviders(frResults.buy || [])
        }
      } catch (error) {
        console.error('Error fetching watch providers:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProviders()
  }, [mediaId, mediaType])

  if (isLoading) return null

  if (!streamingProviders.length && !rentProviders.length && !buyProviders.length) {
    return null
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <h2 className="text-2xl font-bold text-white">Où regarder</h2>
      
      {streamingProviders.length > 0 && (
        <StreamingProviders
          providers={streamingProviders}
          title="Disponible en streaming sur"
        />
      )}

      {rentProviders.length > 0 && (
        <StreamingProviders
          providers={rentProviders}
          title="Disponible en location sur"
        />
      )}

      {buyProviders.length > 0 && (
        <StreamingProviders
          providers={buyProviders}
          title="Disponible à l'achat sur"
        />
      )}
    </div>
  )
} 