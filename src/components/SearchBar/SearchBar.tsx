'use client'

import { useState, useEffect, useRef } from 'react'
import { Search } from 'lucide-react'
import { Movie, TVShow } from '@/types'
import Image from 'next/image'

interface SearchBarProps {
  onSearch: (query: string) => void
  onSubmit: (query: string) => void
  suggestions: (Movie | TVShow)[]
  setSuggestions: (suggestions: (Movie | TVShow)[]) => void
}

export const SearchBar = ({ onSearch, onSubmit, suggestions, setSuggestions }: SearchBarProps) => {
  const [query, setQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const searchRef = useRef<HTMLDivElement>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    setShowSuggestions(true)
    setSelectedIndex(-1)

    // Nettoyer le timeout précédent
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    // Délai pour éviter trop d'appels API
    if (value.trim()) {
      searchTimeoutRef.current = setTimeout(() => {
        onSearch(value)
      }, 300)
    } else {
      setSuggestions([])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSubmit(query)
      setShowSuggestions(false)
      setQuery('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!suggestions.length) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => (prev > -1 ? prev - 1 : -1))
    } else if (e.key === 'Enter' && selectedIndex > -1) {
      e.preventDefault()
      const selected = suggestions[selectedIndex]
      const type = 'title' in selected ? 'movie' : 'tv'
      onSubmit(`${type}/${selected.id}`)
      setShowSuggestions(false)
      setQuery('')
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (item: Movie | TVShow) => {
    const type = 'title' in item ? 'movie' : 'tv'
    onSubmit(`${type}/${item.id}`)
    setShowSuggestions(false)
    setQuery('')
  }

  return (
    <div ref={searchRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Rechercher un film ou une série..."
          className="w-full bg-white/10 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
      </form>

      {showSuggestions && suggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          {suggestions.map((item, index) => {
            const isMovie = 'title' in item
            const title = isMovie ? item.title : item.name
            const date = isMovie ? item.release_date : item.first_air_date
            const year = date ? new Date(date).getFullYear() : null
            const posterPath = item.poster_path
              ? `https://image.tmdb.org/t/p/w92${item.poster_path}`
              : '/placeholder-movie.png'

            return (
              <div
                key={item.id}
                className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
                  index === selectedIndex
                    ? 'bg-gray-700'
                    : 'hover:bg-gray-700'
                }`}
                onClick={() => handleSuggestionClick(item)}
              >
                <div className="relative w-12 h-16 flex-shrink-0">
                  <Image
                    src={posterPath}
                    alt={title}
                    fill
                    className="object-cover rounded"
                    unoptimized={!item.poster_path}
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{title}</p>
                  <p className="text-sm text-gray-400">
                    {year ? `${year} • Film` : 'Série'}
                  </p>
                </div>
                {item.vote_average > 0 && (
                  <div className="text-yellow-500 text-sm font-medium">
                    ★ {item.vote_average.toFixed(1)}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
} 