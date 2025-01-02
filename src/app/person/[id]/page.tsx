'use client'

import { useEffect, useState, use } from 'react'
import { tmdbClient } from '@/services/tmdb/client'
import { LoadingSpinner } from '@/components/LoadingSpinner/LoadingSpinner'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { FilmographyCard } from '@/components/FilmographyCard/FilmographyCard'

interface PersonDetailsData {
  details: {
    id: number
    name: string
    biography: string
    profile_path: string | null
    birthday: string | null
    place_of_birth: string | null
  }
  movieCredits: {
    id: number
    title: string
    character: string
    poster_path: string | null
    release_date: string
    vote_average: number
  }[]
  tvCredits: {
    id: number
    name: string
    character: string
    poster_path: string | null
    first_air_date: string
    vote_average: number
  }[]
}

export default function PersonPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<PersonDetailsData | null>(null)

  useEffect(() => {
    async function fetchPersonDetails() {
      try {
        const [details, movieCredits, tvCredits] = await Promise.all([
          tmdbClient.getPersonDetails(Number(resolvedParams.id)),
          tmdbClient.getPersonMovieCredits(Number(resolvedParams.id)),
          tmdbClient.getPersonTVCredits(Number(resolvedParams.id))
        ])

        setData({
          details,
          movieCredits: movieCredits.cast
            .sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime())
            .slice(0, 20),
          tvCredits: tvCredits.cast
            .sort((a, b) => new Date(b.first_air_date).getTime() - new Date(a.first_air_date).getTime())
            .slice(0, 20)
        })
      } catch (err) {
        console.error('Error fetching person details:', err)
        setError('Une erreur est survenue lors du chargement des détails')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPersonDetails()
  }, [resolvedParams.id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-2xl">{error || 'Personne non trouvée'}</div>
      </div>
    )
  }

  const { details, movieCredits, tvCredits } = data

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-24">
      <div className="container mx-auto px-4 pt-10">
        {/* En-tête avec photo et informations */}
        <motion.div
          className="grid gap-8 md:grid-cols-[300px,1fr]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Photo */}
          <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
            <Image
              src={details.profile_path ? `https://image.tmdb.org/t/p/w500${details.profile_path}` : '/placeholder-actor.png'}
              alt={details.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Informations */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-white">{details.name}</h1>
              {details.birthday && (
                <p className="mt-2 text-gray-400">
                  Né(e) le {new Date(details.birthday).toLocaleDateString('fr-FR')}
                  {details.place_of_birth && ` à ${details.place_of_birth}`}
                </p>
              )}
            </div>

            {details.biography && (
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">Biographie</h2>
                <p className="text-gray-300 whitespace-pre-line">{details.biography}</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Filmographie */}
        <div className="mt-16 space-y-12">
          {movieCredits.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">Films</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {movieCredits.map((movie) => (
                  <FilmographyCard
                    key={`${movie.id}-${movie.character}`}
                    id={movie.id}
                    title={movie.title}
                    character={movie.character}
                    posterPath={movie.poster_path}
                    voteAverage={movie.vote_average}
                    type="movie"
                  />
                ))}
              </div>
            </section>
          )}

          {tvCredits.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">Séries TV</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {tvCredits.map((show) => (
                  <FilmographyCard
                    key={`${show.id}-${show.character}`}
                    id={show.id}
                    title={show.name}
                    character={show.character}
                    posterPath={show.poster_path}
                    voteAverage={show.vote_average}
                    type="tv"
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  )
} 