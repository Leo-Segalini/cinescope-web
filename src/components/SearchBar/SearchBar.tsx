import { useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import debounce from 'lodash/debounce'

interface SearchBarProps {
  placeholder?: string
  onSearch?: (query: string) => void
  className?: string
}

export const SearchBar = ({ 
  placeholder = 'Rechercher un film ou une série...',
  onSearch,
  className = ''
}: SearchBarProps) => {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (onSearch) {
        onSearch(query)
      } else {
        router.push(`/search?q=${encodeURIComponent(query)}`)
      }
    }, 500),
    [onSearch, router]
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    if (value.length >= 2) {
      debouncedSearch(value)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.length >= 2) {
      if (onSearch) {
        onSearch(searchTerm)
      } else {
        router.push(`/search?q=${encodeURIComponent(searchTerm)}`)
      }
    }
  }

  return (
    <form 
      onSubmit={handleSubmit}
      className={`relative w-full max-w-2xl ${className}`}
    >
      <input
        type="search"
        value={searchTerm}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full rounded-full bg-gray-800 px-6 py-3 pl-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        aria-label="Rechercher"
      />
      <svg
        className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </form>
  )
} 