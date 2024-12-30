'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { SearchBar } from '@/components/SearchBar/SearchBar'

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const menuItems = [
    { href: '/movies', label: 'Films' },
    { href: '/tv', label: 'Séries' },
    { href: '/anime', label: 'Animés' },
    { href: '/search', label: 'Recherche' },
  ]

  return (
    <motion.header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/80 backdrop-blur-lg' : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mx-auto max-w-[1920px] px-4 py-4 md:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold">
            <motion.span 
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              TMDB App
            </motion.span>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:block">
            <ul className="flex items-center space-x-8">
              {menuItems.map(item => (
                <motion.li key={item.href} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href={item.href}
                    className={`relative text-lg transition-colors ${
                      pathname === item.href ? 'text-white' : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {item.label}
                    {pathname === item.href && (
                      <motion.div
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                        layoutId="underline"
                      />
                    )}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </nav>

          {/* Burger Menu */}
          <motion.button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            <div className="flex h-6 w-6 flex-col items-center justify-center space-y-1.5">
              <motion.span
                animate={{
                  rotate: isMenuOpen ? 45 : 0,
                  y: isMenuOpen ? 8 : 0,
                }}
                className="h-0.5 w-6 bg-white transform origin-center transition-transform"
              />
              <motion.span
                animate={{
                  opacity: isMenuOpen ? 0 : 1,
                }}
                className="h-0.5 w-6 bg-white"
              />
              <motion.span
                animate={{
                  rotate: isMenuOpen ? -45 : 0,
                  y: isMenuOpen ? -8 : 0,
                }}
                className="h-0.5 w-6 bg-white transform origin-center transition-transform"
              />
            </div>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <motion.nav
          className="md:hidden"
          initial={false}
          animate={{
            height: isMenuOpen ? 'auto' : 0,
            opacity: isMenuOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          <ul className="mt-4 space-y-4">
            {menuItems.map(item => (
              <motion.li
                key={item.href}
                whileHover={{ x: 10 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={item.href}
                  className={`block text-lg ${
                    pathname === item.href ? 'text-white' : 'text-gray-300'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </motion.li>
            ))}
          </ul>
        </motion.nav>

        {/* SearchBar */}
        <div className="mt-4">
          <SearchBar />
        </div>
      </div>
    </motion.header>
  )
} 