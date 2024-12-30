'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Movie, TVShow } from '@/types/tmdb'

interface SearchSuggestionsProps {
  results: (Movie | TVShow)[]
  isVisible: boolean
  onSelect: (item: Movie | TVShow) => void
  onClose: () => void
}

export const SearchSuggestions = ({
  results,
  isVisible,
  onSelect,
  onClose,
}: SearchSuggestionsProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const [activeIndex, setActiveIndex] = useState<number>(-1)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isVisible, onClose])

  useEffect(() => {
    if (!isVisible) {
      setActiveIndex(-1)
    }
  }, [isVisible])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveIndex(prev => (prev < results.length - 1 ? prev + 1 : prev))
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex(prev => (prev > 0 ? prev - 1 : prev))
        break
      case 'Escape':
        onClose()
        break
    }
  }

  if (!isVisible || results.length === 0) return null

  return (
    <div
      ref={ref}
      className="absolute left-0 right-0 top-full z-50 mt-2 max-h-96 overflow-auto rounded-lg bg-gray-800 shadow-xl"
      role="listbox"
      aria-label="Suggestions de recherche"
      onKeyDown={handleKeyDown}
    >
      {results.map((item, index) => {
        const isMovie = 'title' in item
        const title = isMovie ? item.title : item.name
        const year = new Date(
          isMovie ? item.release_date : item.first_air_date
        ).getFullYear()
        const isActive = index === activeIndex

        return (
          <div
            key={`${item.id}-${isMovie ? 'movie' : 'tv'}`}
            className={`cursor-pointer px-4 py-3 transition-colors hover:bg-gray-700 ${
              isActive ? 'bg-gray-700' : ''
            }`}
            role="option"
            aria-selected={isActive}
            onClick={() => {
              onSelect(item)
              router.push(`/${isMovie ? 'movie' : 'tv'}/${item.id}`)
            }}
            onMouseEnter={() => setActiveIndex(index)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onSelect(item)
                router.push(`/${isMovie ? 'movie' : 'tv'}/${item.id}`)
              }
            }}
            tabIndex={0}
            id={`search-suggestion-${index}`}
            aria-label={`${title} (${year}) - ${isMovie ? 'Film' : 'Série'}`}
          >
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <p className="font-medium text-white">{title}</p>
                <p className="text-sm text-gray-400">
                  {year} • {isMovie ? 'Film' : 'Série'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-yellow-500" aria-label={`Note : ${item.vote_average.toFixed(1)} sur 10`}>
                  ★ {item.vote_average.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
} 