// Page d'accueil principale de l'application
// Affiche les films et séries tendances, populaires et les mieux notés
'use client'

import { useEffect, useState } from 'react'
import { Movie, TVShow } from '@/types'
import { fetchMovies, fetchTVShows } from '@/services/api'
import { Hero } from '@/components/Hero/Hero'
import { MovieGrid } from '@/components/MovieGrid/MovieGrid'
import { TVShowGrid } from '@/components/TVShowGrid/TVShowGrid'
import { LoadingScreen } from '@/components/LoadingScreen/LoadingScreen'

// Interface définissant la structure des données de la page d'accueil
interface HomeData {
  trendingMovies: Movie[]
  popularMovies: Movie[]
  topRatedMovies: Movie[]
  popularTVShows: TVShow[]
  topRatedTVShows: TVShow[]
}

export default function HomePage() {
  // États pour gérer le chargement, les erreurs et les données
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<HomeData | null>(null)

  // Effet pour charger les données au montage du composant
  useEffect(() => {
    async function fetchData() {
      try {
        // Chargement parallèle de toutes les données nécessaires
        const [
          trendingMovies,
          popularMovies,
          topRatedMovies,
          popularTVShows,
          topRatedTVShows
        ] = await Promise.all([
          fetchMovies('trending'),
          fetchMovies('popular'),
          fetchMovies('top_rated'),
          fetchTVShows('popular'),
          fetchTVShows('top_rated')
        ])

        // Mise à jour de l'état avec les données récupérées
        setData({
          trendingMovies,
          popularMovies,
          topRatedMovies,
          popularTVShows,
          topRatedTVShows
        })
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Une erreur est survenue lors du chargement des données')
      } finally {
        // Délai minimum pour l'animation de chargement
        setTimeout(() => {
          setIsLoading(false)
        }, 2000)
      }
    }

    fetchData()
  }, [])

  // Affichage de l'écran de chargement
  if (isLoading) {
    return <LoadingScreen />
  }

  // Affichage des erreurs
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    )
  }

  // Affichage si aucune donnée n'est disponible
  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-lg">Aucun contenu disponible</div>
      </div>
    )
  }

  // Sélection du premier film tendance pour le héros
  const heroMovie = data.trendingMovies[0]

  // Rendu principal de la page
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Section héro avec le film tendance */}
      <Hero
        title={heroMovie.title}
        overview={heroMovie.overview}
        backdropPath={heroMovie.backdrop_path}
        type="movie"
        id={heroMovie.id}
      />

      {/* Grilles de contenu */}
      <div className="container mx-auto px-4 -mt-32 relative z-10 pb-16">
        <MovieGrid title="Films Populaires" items={data.popularMovies} />
        <MovieGrid title="Films les Mieux Notés" items={data.topRatedMovies} />
        <TVShowGrid title="Séries Populaires" items={data.popularTVShows} />
        <TVShowGrid title="Séries les Mieux Notées" items={data.topRatedTVShows} />
      </div>
    </main>
  )
}
