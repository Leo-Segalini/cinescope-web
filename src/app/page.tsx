'use client'

import { Hero } from '@/components/Hero/Hero'
import { MovieGrid } from '@/components/MovieGrid/MovieGrid'
import { TVShowGrid } from '@/components/TVShowGrid/TVShowGrid'
import { fetchMovies, fetchTVShows } from '@/services/api'
import { useEffect, useState } from 'react'
import { Movie, TVShow } from '@/types'

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<{
    trendingMovies: Movie[]
    popularMovies: Movie[]
    topRatedMovies: Movie[]
    popularTVShows: TVShow[]
    topRatedTVShows: TVShow[]
  } | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        console.log('Fetching data for homepage...')
        const [
          trendingMovies,
          popularMovies,
          topRatedMovies,
          popularTVShows,
          topRatedTVShows,
        ] = await Promise.all([
          fetchMovies('now_playing'),
          fetchMovies('popular'),
          fetchMovies('top_rated'),
          fetchTVShows('popular'),
          fetchTVShows('top_rated'),
        ])

        console.log('Data fetched:', {
          trendingMovies: trendingMovies?.length,
          popularMovies: popularMovies?.length,
          topRatedMovies: topRatedMovies?.length,
          popularTVShows: popularTVShows?.length,
          topRatedTVShows: topRatedTVShows?.length,
        })

        setData({
          trendingMovies,
          popularMovies,
          topRatedMovies,
          popularTVShows,
          topRatedTVShows,
        })
      } catch (err) {
        console.error('Error fetching homepage data:', err)
        setError('Une erreur est survenue lors du chargement des données')
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

  if (!data || !data.trendingMovies.length) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-2xl">Aucun contenu disponible</div>
      </div>
    )
  }

  const heroMovie = data.trendingMovies[0]

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <Hero
        title={heroMovie.title}
        overview={heroMovie.overview}
        backdropPath={heroMovie.backdrop_path}
        type="movie"
        id={heroMovie.id}
      />

      <div className="container mx-auto px-4 pb-16">
        <MovieGrid title="Films Tendance" items={data.trendingMovies} />
        <MovieGrid title="Films Populaires" items={data.popularMovies} />
        <MovieGrid title="Films les Mieux Notés" items={data.topRatedMovies} />
        <TVShowGrid title="Séries Populaires" items={data.popularTVShows} />
        <TVShowGrid title="Séries les Mieux Notées" items={data.topRatedTVShows} />
      </div>
    </main>
  )
}
