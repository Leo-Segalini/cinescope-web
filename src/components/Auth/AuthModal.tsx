'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useAuth } from './AuthProvider'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { signIn, signUp } = useAuth()

  // Réinitialiser les champs quand le modal s'ouvre/se ferme
  useEffect(() => {
    if (!isOpen) {
      setEmail('')
      setPassword('')
      setPhone('')
      setError('')
      setSuccess('')
    }
  }, [isOpen])

  // Réinitialiser les champs lors du changement de mode (login/signup)
  useEffect(() => {
    setEmail('')
    setPassword('')
    setPhone('')
    setError('')
    setSuccess('')
  }, [isLogin])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      if (isLogin) {
        const { error: signInError } = await signIn(email, password)
        if (signInError) {
          if (signInError.message.includes('Invalid login credentials')) {
            setError('Email ou mot de passe incorrect')
          } else {
            setError(signInError.message)
          }
          setPassword('')
          return
        }
        onClose()
      } else {
        const { error: signUpError } = await signUp(email, password, phone)
        if (signUpError) {
          if (signUpError.name === 'ConfirmationRequired') {
            setSuccess(signUpError.message)
            // Ne pas fermer le modal, afficher le message de succès
          } else {
            setError(signUpError.message)
            setPassword('')
          }
          return
        }
        onClose()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur inattendue est survenue')
      setPassword('')
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-md p-6 bg-gray-900/95 backdrop-blur-sm rounded-lg shadow-xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
              aria-label="Fermer"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-white mb-6">
              {isLogin ? 'Connexion' : 'Inscription'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800/90 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                  Mot de passe
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800/90 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                  minLength={6}
                />
                <p className="text-xs text-gray-400 mt-1">
                  {!isLogin && 'Le mot de passe doit contenir au moins 6 caractères'}
                </p>
              </div>

              {!isLogin && (
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800/90 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="+33 6 12 34 56 78"
                    required={!isLogin}
                    pattern="^\+?[0-9\s-()]{10,}$"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Format: +33 6 12 34 56 78
                  </p>
                </div>
              )}

              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}

              {success && (
                <p className="text-green-500 text-sm">{success}</p>
              )}

              <button
                type="submit"
                className="w-full py-2 px-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                {isLogin ? 'Se connecter' : "S'inscrire"}
              </button>

              <p className="text-center text-gray-400">
                {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-2 text-indigo-400 hover:text-indigo-300"
                >
                  {isLogin ? "S'inscrire" : "Se connecter"}
                </button>
              </p>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
} 