'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export function Footer() {
  return (
    <footer className="bg-black py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid gap-8 md:grid-cols-3"
        >
          {/* Navigation */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Films
                </Link>
              </li>
              <li>
                <Link
                  href="/tv"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Séries TV
                </Link>
              </li>
              <li>
                <Link
                  href="/anime"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Anime
                </Link>
              </li>
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Légal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Conditions d&apos;utilisation
                </Link>
              </li>
            </ul>
          </div>

          {/* À propos */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">À propos</h3>
            <p className="text-gray-400">
              Ce site utilise l&apos;API TMDB pour fournir des informations sur les films,
              séries et animes. Toutes les données sont fournies par TMDB.
            </p>
          </div>
        </motion.div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <p className="text-center text-gray-400">
            © {new Date().getFullYear()} TMDB App. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
} 