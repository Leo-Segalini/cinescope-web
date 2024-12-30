'use client'

import { Slider } from '@/components/Slider/Slider'
import { TVShowCard } from '@/components/TVShowCard/TVShowCard'
import type { TVShow } from '@/types/tmdb'

interface AnimeSliderProps {
  title: string
  items: TVShow[]
}

export function AnimeSlider({ title, items }: AnimeSliderProps) {
  return (
    <Slider title={title}>
      {items.map((anime, index) => (
        <TVShowCard key={anime.id} show={anime} priority={index < 5} />
      ))}
    </Slider>
  )
} 