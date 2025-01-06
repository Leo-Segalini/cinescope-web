'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User, AuthError } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  signUp: (email: string, password: string, phone: string) => Promise<{ error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Vérifier la session actuelle
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Écouter les changements d'authentification
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, phone: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            phone: phone
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        console.error('Erreur lors de l\'inscription:', error.message)
        return { error }
      }

      // Si l'inscription réussit mais nécessite une confirmation par email
      if (data.user && !data.user.confirmed_at) {
        return {
          error: {
            name: 'ConfirmationRequired',
            message: 'Veuillez vérifier votre email pour confirmer votre inscription.'
          } as AuthError
        }
      }

      return { error: null }
    } catch (err) {
      console.error('Erreur inattendue:', err)
      return {
        error: {
          name: 'UnexpectedError',
          message: 'Une erreur inattendue est survenue.'
        } as AuthError
      }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('Erreur lors de la connexion:', error.message)
        return { error }
      }

      return { error: null }
    } catch (err) {
      console.error('Erreur inattendue:', err)
      return {
        error: {
          name: 'UnexpectedError',
          message: 'Une erreur inattendue est survenue.'
        } as AuthError
      }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
      throw error
    }
  }

  const value = {
    user,
    signUp,
    signIn,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 