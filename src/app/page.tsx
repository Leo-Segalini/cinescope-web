import { Suspense } from 'react'
import { MovieCard } from '@/components/MovieCard/MovieCard'
import { SearchBar } from '@/components/SearchBar/SearchBar'
import { LoadingSpinner } from '@/components/LoadingSpinner/LoadingSpinner'
import { tmdbClient } from '@/services/tmdb/client'

async function getPopularMovies() {
  const data = await tmdbClient.getPopularMovies()
  return data.results
}

async function getPopularTVShows() {
  const data = await tmdbClient.getPopularTVShows()
  return data.results
}

export default async function HomePage() {
  const [movies, tvShows] = await Promise.all([
    getPopularMovies(),
    getPopularTVShows(),
  ])

  return (
    <main className="min-h-screen bg-gray-900 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <SearchBar className="mb-12" />

        <section className="mb-16">
          <h1 className="mb-8 text-3xl font-bold text-white">Films Populaires</h1>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <Suspense
              fallback={
                <div className="col-span-full flex justify-center py-12">
                  <LoadingSpinner size="lg" />
                </div>
              }
            >
              {movies.map((movie, index) => (
                <MovieCard key={movie.id} movie={movie} priority={index < 4} />
              ))}
            </Suspense>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="mb-8 text-3xl font-bold text-white">Séries Populaires</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <Suspense
              fallback={
                <div className="col-span-full flex justify-center py-12">
                  <LoadingSpinner size="lg" />
                </div>
              }
            >
              {tvShows.map((show, index) => (
                <TVShowCard key={show.id} show={show} priority={index < 4} />
              ))}
            </Suspense>
          </div>
        </section>
      </div>
    </main>
  )
}
