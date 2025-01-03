'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const movieQuotes = [
  { quote: "Vers l'infini et au-delà !", movie: "Toy Story" },
  { quote: "La vie, c'est comme une boîte de chocolats...", movie: "Forrest Gump" },
  { quote: "Je suis ton père.", movie: "Star Wars: L'Empire contre-attaque" },
  { quote: "Houston, nous avons un problème.", movie: "Apollo 13" },
  { quote: "Il faut retourner... vers le futur !", movie: "Retour vers le futur" },
]

export default function NotFound() {
  const [randomQuote, setRandomQuote] = useState(movieQuotes[0])

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * movieQuotes.length)
    setRandomQuote(movieQuotes[randomIndex])
  }, [])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <motion.div
        className="max-w-2xl mx-auto text-center space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-6xl md:text-8xl font-bold text-white">404</h1>
        <div className="space-y-4">
          <p className="text-xl md:text-2xl text-gray-300">
            {randomQuote.quote}
          </p>
          <p className="text-lg text-gray-400">
            — {randomQuote.movie}
          </p>
        </div>
        <p className="text-xl text-gray-300">
          Cette page n&apos;existe pas ou a été déplacée.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Retour à l&apos;accueil
        </Link>
      </motion.div>
    </div>
  )
} 