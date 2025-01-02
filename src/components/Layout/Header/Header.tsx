'use client'

import Link from 'next/link'
import Image from 'next/image'
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
        isScrolled ? 'bg-black/80 backdrop-blur-lg shadow-lg' : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mx-auto max-w-[1920px] px-4 py-4 md:px-8">
        <div className="flex items-center justify-between">
          {/* Logo et Titre */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-12 w-12">
              <Image
                src="/logo-nobg.png"
                alt="CinéScope"
                fill
                className="object-contain"
                priority
              />
            </div>
            <motion.span 
              className="text-2xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent hidden sm:block"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              CinéScope
            </motion.span>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            <ul className="flex items-center gap-8">
              {menuItems.map(item => (
                <motion.li key={item.href} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href={item.href}
                    className={`relative text-lg font-medium transition-colors ${
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
            <div className="w-72">
              <SearchBar />
            </div>
          </nav>

          {/* Burger Menu */}
          <div className="flex items-center md:hidden">
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
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
        </div>

        {/* Mobile Menu */}
        <motion.nav
          className="md:hidden overflow-hidden"
          initial={false}
          animate={{
            height: isMenuOpen ? 'auto' : 0,
            opacity: isMenuOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="mt-4 space-y-4 pb-4">
            <div className="mb-6">
              <SearchBar />
            </div>
            <ul className="space-y-4">
              {menuItems.map(item => (
                <motion.li
                  key={item.href}
                  whileHover={{ x: 10 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={item.href}
                    className={`block text-lg font-medium ${
                      pathname === item.href ? 'text-white' : 'text-gray-300'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.nav>
      </div>
    </motion.header>
  )
} 