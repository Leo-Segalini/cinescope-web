'use client'

import { Suspense } from 'react'
import { Hero } from '@/components/Hero/Hero'
import { LoadingSpinner } from '@/components/LoadingSpinner/LoadingSpinner'
import { AnimeSlider } from './AnimeSlider'
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
      <Hero media={data.popularAnime.results[0]} type="tv" />

      {/* Sliders Section */}
      <div className="-mt-32 relative z-10">
        <Suspense
          fallback={
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          }
        >
          {/* Animés Tendance */}
          <AnimeSlider
            title="Animés Tendance"
            items={data.trendingAnime.results}
          />

          {/* Animés Populaires */}
          <AnimeSlider
            title="Animés Populaires"
            items={data.popularAnime.results}
          />

          {/* Animés les Mieux Notés */}
          <AnimeSlider
            title="Animés les Mieux Notés"
            items={data.topRatedAnime.results}
          />

          {/* Nouveaux Animés */}
          <AnimeSlider
            title="Nouveaux Animés"
            items={data.newAnime.results}
          />
        </Suspense>
      </div>
    </div>
  )
} 