'use client'

import { Hero } from '@/components/Hero/Hero'
import { MovieGrid } from '@/components/MovieGrid/MovieGrid'
import { fetchMovies } from '@/services/api'
import { useEffect, useState } from 'react'
import { Movie } from '@/types'
import { LoadingScreen } from '@/components/LoadingScreen/LoadingScreen'

interface MoviesData {
  popularMovies: Movie[]
  topRatedMovies: Movie[]
  nowPlayingMovies: Movie[]
  upcomingMovies: Movie[]
}

export default function MoviesPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<MoviesData | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const [popularMovies, topRatedMovies, nowPlayingMovies, upcomingMovies] = await Promise.all([
          fetchMovies('popular'),
          fetchMovies('top_rated'),
          fetchMovies('now_playing'),
          fetchMovies('upcoming')
        ])

        setData({
          popularMovies,
          topRatedMovies,
          nowPlayingMovies,
          upcomingMovies
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

      <div className="container mx-auto px-4 -mt-32 relative z-10 pb-16">
        <MovieGrid title="Films Populaires" items={data.popularMovies} />
        <MovieGrid title="Films les Mieux Notés" items={data.topRatedMovies} />
        <MovieGrid title="Films à l'Affiche" items={data.nowPlayingMovies} />
        <MovieGrid title="Prochaines Sorties" items={data.upcomingMovies} />
      </div>
    </main>
  )
} 