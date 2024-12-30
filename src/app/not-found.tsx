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
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center px-4">
      <div className="text-center">
        {/* Film Reel Animation */}
        <motion.div
          className="mb-8"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <div className="w-32 h-32 mx-auto border-8 border-gray-300 rounded-full relative">
            <div className="absolute inset-0 border-8 border-gray-300 rounded-full transform rotate-45" />
            <div className="absolute inset-0 border-8 border-gray-300 rounded-full transform rotate-90" />
            <div className="absolute inset-4 bg-gray-300 rounded-full" />
          </div>
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
          <p className="text-2xl text-gray-300 mb-8">Cette scène n&apos;existe pas</p>
          <div className="text-lg text-gray-400 mb-8">
            <p className="italic">&quot;{randomQuote.quote}&quot;</p>
            <p className="mt-2">- {randomQuote.movie}</p>
          </div>
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold transition-transform hover:scale-105"
          >
            Retour à l&apos;accueil
          </Link>
        </motion.div>
      </div>
    </div>
  )
} 