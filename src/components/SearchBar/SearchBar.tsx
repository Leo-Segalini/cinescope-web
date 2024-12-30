'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X } from 'lucide-react'

export const SearchBar = () => {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === '/' && !isFocused && pathname !== '/search') {
        e.preventDefault()
        inputRef.current?.focus()
      }
      if (e.key === 'Escape' && isFocused) {
        inputRef.current?.blur()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isFocused, pathname])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      if (pathname !== '/search') {
        setQuery('')
      }
    }
  }

  const handleClear = () => {
    setQuery('')
    inputRef.current?.focus()
    if (pathname === '/search') {
      router.push('/search')
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="relative w-full max-w-2xl mx-auto"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <motion.div
          className={`absolute inset-0 rounded-lg ${
            isFocused
              ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'
              : 'bg-white/10'
          }`}
          animate={{ opacity: isFocused ? 1 : 0.1 }}
          transition={{ duration: 0.2 }}
        />
        <div className="relative flex items-center p-0.5">
          <motion.div
            className="flex items-center flex-1 px-4 py-2 bg-black rounded-lg"
            whileTap={{ scale: 0.995 }}
          >
            <Search className="w-5 h-5 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Rechercher un film, une série ou un anime... (Appuyez sur '/')"
              className="flex-1 ml-3 bg-transparent text-white placeholder-gray-400 focus:outline-none"
            />
            <AnimatePresence>
              {query && (
                <motion.button
                  type="button"
                  onClick={handleClear}
                  className="p-1 hover:bg-white/10 rounded-full transition-colors"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-4 h-4 text-gray-400" />
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Keyboard shortcut indicator */}
      {pathname !== '/search' && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex items-center space-x-1">
          <kbd className="px-2 py-1 text-xs text-gray-400 bg-black/50 rounded-md border border-gray-700">
            /
          </kbd>
        </div>
      )}
    </motion.form>
  )
} 