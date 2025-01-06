'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HeaderSearchBar } from '@/components/SearchBar/HeaderSearchBar'
import { useAuth } from '@/components/Auth/AuthProvider'
import { AuthModal } from '@/components/Auth/AuthModal'
import { User, LogOut } from 'lucide-react'

export function Header() {
  const { user, signOut } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const pathname = usePathname()

  const handleSignOut = async () => {
    try {
      await signOut()
      setIsUserMenuOpen(false)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

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
          <nav className="hidden lg:flex items-center gap-8">
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
              <HeaderSearchBar />
            </div>
            <div className="relative">
              {user ? (
                <div className="relative">
                  <motion.button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white hover:opacity-90 transition-opacity"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <User className="w-5 h-5" />
                  </motion.button>

                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-gray-900/95 backdrop-blur-sm rounded-lg shadow-xl py-1"
                    >
                      <Link
                        href="/favorites"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800/50"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Mes favoris
                      </Link>
                      <Link
                        href="/watchlist"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800/50"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Ma liste
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800/50 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Déconnexion
                      </button>
                    </motion.div>
                  )}
                </div>
              ) : (
                <motion.button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Se connecter
                </motion.button>
              )}
            </div>
          </nav>

          {/* Burger Menu */}
          <div className="flex items-center lg:hidden">
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
          className={`fixed inset-x-0 top-[72px] lg:hidden overflow-hidden bg-black/90 backdrop-blur-lg shadow-lg ${
            isMenuOpen ? 'block' : 'hidden'
          }`}
          initial={false}
          animate={{
            height: isMenuOpen ? 'auto' : 0,
            opacity: isMenuOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="mt-4 space-y-4 pb-4 px-4">
            <div className="mb-6">
              <HeaderSearchBar />
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
              {!user ? (
                <motion.li
                  whileHover={{ x: 10 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button
                    onClick={() => {
                      setIsAuthModalOpen(true)
                      setIsMenuOpen(false)
                    }}
                    className="text-lg font-medium text-indigo-400"
                  >
                    Se connecter
                  </button>
                </motion.li>
              ) : (
                <>
                  <motion.li
                    whileHover={{ x: 10 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href="/favorites"
                      className="block text-lg font-medium text-gray-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Mes favoris
                    </Link>
                  </motion.li>
                  <motion.li
                    whileHover={{ x: 10 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href="/watchlist"
                      className="block text-lg font-medium text-gray-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Ma liste
                    </Link>
                  </motion.li>
                  <motion.li
                    whileHover={{ x: 10 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button
                      onClick={handleSignOut}
                      className="text-lg font-medium text-red-400 flex items-center gap-2"
                    >
                      <LogOut className="w-5 h-5" />
                      Déconnexion
                    </button>
                  </motion.li>
                </>
              )}
            </ul>
          </div>
        </motion.nav>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </motion.header>
  )
} 