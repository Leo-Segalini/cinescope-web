'use client'

import { Suspense } from 'react'
import { Hero } from '@/components/Hero/Hero'
import { LoadingSpinner } from '@/components/LoadingSpinner/LoadingSpinner'
import { AnimeGrid } from '@/components/AnimeGrid/AnimeGrid'
import type { TVShow } from '@/types/tmdb'

interface AnimeContentProps {
  data: {
    popularAnime: { results: TVShow[] }
    trendingAnime: { results: TVShow[] }
    topRatedAnime: { results: TVShow[] }
    newAnime: { results: TVShow[] }
  }
}

export function AnimeContent({ data }: AnimeContentProps) {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <Hero 
        title={data.popularAnime.results[0].name}
        overview={data.popularAnime.results[0].overview}
        backdropPath={data.popularAnime.results[0].backdrop_path}
        type="tv"
        id={data.popularAnime.results[0].id}
      />

      {/* Grids Section */}
      <div className="-mt-32 relative z-10">
        <Suspense
          fallback={
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          }
        >
          {/* Animés Tendance */}
          <AnimeGrid
            title="Animés Tendance"
            items={data.trendingAnime.results}
          />

          {/* Animés Populaires */}
          <AnimeGrid
            title="Animés Populaires"
            items={data.popularAnime.results}
          />

          {/* Animés les Mieux Notés */}
          <AnimeGrid
            title="Animés les Mieux Notés"
            items={data.topRatedAnime.results}
          />

          {/* Nouveaux Animés */}
          <AnimeGrid
            title="Nouveaux Animés"
            items={data.newAnime.results}
          />
        </Suspense>
      </div>
    </div>
  )
} 