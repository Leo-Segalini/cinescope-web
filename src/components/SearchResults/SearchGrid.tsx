'use client'

import { MediaCard } from '@/components/MediaCard/MediaCard'
import type { Movie, TVShow } from '@/types'

interface SearchGridProps {
  items: (Movie | TVShow)[]
}

export const SearchGrid = ({ items = [] }: SearchGridProps) => {
  if (!items || items.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-gray-400">Aucun contenu disponible</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6">
      {items.map((item) => (
        <div key={item.id}>
          <MediaCard
            id={item.id}
            title={'title' in item ? item.title : item.name}
            posterPath={item.poster_path}
            releaseDate={'release_date' in item ? item.release_date ?? undefined : item.first_air_date ?? undefined}
            voteAverage={item.vote_average}
            type={'title' in item ? 'movie' : 'tv'}
          />
        </div>
      ))}
    </div>
  )
} 