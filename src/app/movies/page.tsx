'use client'

import { Hero } from '@/components/Hero/Hero'
import { MovieGrid } from '@/components/MovieGrid/MovieGrid'
import { fetchMovies } from '@/services/api'
import { useEffect, useState } from 'react'
import { Movie } from '@/types'

export default function MoviesPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<{
    trendingMovies: Movie[]
    popularMovies: Movie[]
    topRatedMovies: Movie[]
    upcomingMovies: Movie[]
  } | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        console.log('Fetching movies data...')
        const [trendingMovies, popularMovies, topRatedMovies, upcomingMovies] = await Promise.all([
          fetchMovies('now_playing'),
          fetchMovies('popular'),
          fetchMovies('top_rated'),
          fetchMovies('upcoming'),
        ])

        console.log('Movies data fetched:', {
          trendingMovies: trendingMovies?.length,
          popularMovies: popularMovies?.length,
          topRatedMovies: topRatedMovies?.length,
          upcomingMovies: upcomingMovies?.length,
        })

        setData({
          trendingMovies,
          popularMovies,
          topRatedMovies,
          upcomingMovies,
        })
      } catch (err) {
        console.error('Error fetching movies data:', err)
        setError('Une erreur est survenue lors du chargement des films')
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
        <div className="text-white text-2xl">Aucun film disponible</div>
      </div>
    )
  }

  const heroMovie = data.popularMovies[0]

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
        <MovieGrid title="Films à Venir" items={data.upcomingMovies} />
      </div>
    </main>
  )
} 