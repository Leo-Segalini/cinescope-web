'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Vous pouvez logger l'erreur dans un service de monitoring
    console.error('Error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <motion.div
        className="max-w-2xl mx-auto text-center space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-6xl font-bold text-white">Oups !</h1>
        <p className="text-xl text-gray-300">
          Une erreur inattendue s&apos;est produite.
        </p>
        <div className="space-y-4">
          <button
            onClick={reset}
            className="inline-block px-6 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </motion.div>
    </div>
  )
} 