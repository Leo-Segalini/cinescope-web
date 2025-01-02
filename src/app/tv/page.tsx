'use client'

import { Hero } from '@/components/Hero/Hero'
import { TVShowGrid } from '@/components/TVShowGrid/TVShowGrid'
import { fetchTVShows } from '@/services/api'
import { useEffect, useState } from 'react'
import { TVShow } from '@/types'
import { LoadingScreen } from '@/components/LoadingScreen/LoadingScreen'

interface TVShowsData {
  popularTVShows: TVShow[]
  topRatedTVShows: TVShow[]
  onTheAirTVShows: TVShow[]
}

export default function TVShowsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<TVShowsData | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const [popularTVShows, topRatedTVShows, onTheAirTVShows] = await Promise.all([
          fetchTVShows('popular'),
          fetchTVShows('top_rated'),
          fetchTVShows('on_the_air')
        ])

        setData({
          popularTVShows,
          topRatedTVShows,
          onTheAirTVShows
        })
      } catch (err) {
        setError('Une erreur est survenue lors du chargement des données')
        console.error('Error fetching data:', err)
      } finally {
        setTimeout(() => {
          setIsLoading(false)
        }, 1500)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return <LoadingScreen />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-lg">Aucun contenu disponible</div>
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

      <div className="container mx-auto px-4 -mt-32 relative z-10 pb-16">
        <TVShowGrid title="Séries Populaires" items={data.popularTVShows} />
        <TVShowGrid title="Séries les Mieux Notées" items={data.topRatedTVShows} />
        <TVShowGrid title="Séries en Cours de Diffusion" items={data.onTheAirTVShows} />
      </div>
    </main>
  )
} 