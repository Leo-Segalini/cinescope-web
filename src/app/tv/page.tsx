'use client'

import { Hero } from '@/components/Hero/Hero'
import { TVShowGrid } from '@/components/TVShowGrid/TVShowGrid'
import { fetchTVShows } from '@/services/api'
import { useEffect, useState } from 'react'
import { TVShow } from '@/types'

export default function TVShowsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<{
    popularTVShows: TVShow[]
    topRatedTVShows: TVShow[]
    airingTodayTVShows: TVShow[]
    onTheAirTVShows: TVShow[]
  } | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        console.log('Fetching TV shows data...')
        const [popularTVShows, topRatedTVShows, airingTodayTVShows, onTheAirTVShows] = await Promise.all([
          fetchTVShows('popular'),
          fetchTVShows('top_rated'),
          fetchTVShows('airing_today'),
          fetchTVShows('on_the_air'),
        ])

        console.log('TV shows data fetched:', {
          popularTVShows: popularTVShows?.length,
          topRatedTVShows: topRatedTVShows?.length,
          airingTodayTVShows: airingTodayTVShows?.length,
          onTheAirTVShows: onTheAirTVShows?.length,
        })

        setData({
          popularTVShows,
          topRatedTVShows,
          airingTodayTVShows,
          onTheAirTVShows,
        })
      } catch (err) {
        console.error('Error fetching TV shows data:', err)
        setError('Une erreur est survenue lors du chargement des séries')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-2xl">Chargement...</div>
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

  if (!data || !data.popularTVShows.length) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-2xl">Aucune série disponible</div>
      </div>
    )
  }

  const heroShow = data.popularTVShows[0]

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <Hero
        title={heroShow.name}
        overview={heroShow.overview}
        backdropPath={heroShow.backdrop_path}
        type="tv"
        id={heroShow.id}
      />

      <div className="container mx-auto px-4 pb-16">
        <TVShowGrid title="Séries Populaires" items={data.popularTVShows} />
        <TVShowGrid title="Séries les Mieux Notées" items={data.topRatedTVShows} />
        <TVShowGrid title="Diffusées Aujourd'hui" items={data.airingTodayTVShows} />
        <TVShowGrid title="En Cours de Diffusion" items={data.onTheAirTVShows} />
      </div>
    </main>
  )
} 