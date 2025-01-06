'use client'

import { useEffect, useState, use } from 'react'
import { tmdbClient } from '@/services/tmdb/client'
import { LoadingSpinner } from '@/components/LoadingSpinner/LoadingSpinner'
import Image from 'next/image'
import { FilmographyCard } from '@/components/FilmographyCard/FilmographyCard'

interface MovieCredit {
  id: number
  title: string
  character: string
  poster_path: string | null
  release_date: string | null
  vote_average: number
}

interface TVCredit {
  id: number
  name: string
  character: string
  poster_path: string | null
  first_air_date: string | null
  vote_average: number
}

interface PersonDetailsData {
  details: {
    id: number
    name: string
    biography: string
    profile_path: string | null
    birthday: string | null
    place_of_birth: string | null
  }
  movieCredits: MovieCredit[]
  tvCredits: TVCredit[]
}

interface MovieCreditResponse {
  id: number
  title?: string
  character?: string
  poster_path: string | null
  release_date?: string | null
  vote_average: number
}

interface TVCreditResponse {
  id: number
  name?: string
  character?: string
  poster_path: string | null
  first_air_date?: string | null
  vote_average: number
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
          details: {
            id: details.id,
            name: details.name,
            biography: details.biography,
            profile_path: details.profile_path,
            birthday: details.birthday,
            place_of_birth: details.place_of_birth
          },
          movieCredits: movieCredits.cast.map((credit: MovieCreditResponse) => ({
            id: credit.id,
            title: credit.title || '',
            character: credit.character || '',
            poster_path: credit.poster_path,
            release_date: credit.release_date || null,
            vote_average: credit.vote_average
          })),
          tvCredits: tvCredits.cast.map((credit: TVCreditResponse) => ({
            id: credit.id,
            name: credit.name || '',
            character: credit.character || '',
            poster_path: credit.poster_path,
            first_air_date: credit.first_air_date || null,
            vote_average: credit.vote_average
          }))
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

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-[300px,1fr]">
          {/* Photo de profil */}
          <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
            <Image
              src={data.details.profile_path ? `https://image.tmdb.org/t/p/w500${data.details.profile_path}` : '/placeholder-person.png'}
              alt={data.details.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Informations */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-4">{data.details.name}</h1>
              {data.details.biography && (
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-white">Biographie</h2>
                  <p className="text-gray-300">{data.details.biography}</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.details.birthday && (
                <div>
                  <h3 className="text-lg font-semibold text-white">Date de naissance</h3>
                  <p className="text-gray-300">
                    {new Date(data.details.birthday).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              )}
              {data.details.place_of_birth && (
                <div>
                  <h3 className="text-lg font-semibold text-white">Lieu de naissance</h3>
                  <p className="text-gray-300">{data.details.place_of_birth}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Filmographie */}
        {data.movieCredits.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">Films</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {data.movieCredits.map((movie) => (
                <FilmographyCard
                  key={movie.id}
                  id={movie.id}
                  title={movie.title}
                  character={movie.character}
                  posterPath={movie.poster_path}
                  voteAverage={movie.vote_average}
                  type="movie"
                />
              ))}
            </div>
          </div>
        )}

        {/* Séries TV */}
        {data.tvCredits.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">Séries TV</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {data.tvCredits.map((show) => (
                <FilmographyCard
                  key={show.id}
                  id={show.id}
                  title={show.name}
                  character={show.character}
                  posterPath={show.poster_path}
                  voteAverage={show.vote_average}
                  type="tv"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
} 