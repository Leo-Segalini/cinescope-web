'use client'

import { useState, useEffect, useCallback } from 'react'
import { Heart, Check } from 'lucide-react'
import { useAuth } from '@/components/Auth/AuthProvider'
import { supabase } from '@/lib/supabase'
import { motion } from 'framer-motion'

interface MediaActionsProps {
  mediaId: number
  mediaType: 'movie' | 'tv'
}

export function MediaActions({ mediaId, mediaType }: MediaActionsProps) {
  const { user } = useAuth()
  const [isFavorite, setIsFavorite] = useState(false)
  const [isWatched, setIsWatched] = useState(false)
  const [loading, setLoading] = useState(true)

  const loadUserInteractions = useCallback(async () => {
    try {
      const [{ data: favorites }, { data: watched }] = await Promise.all([
        supabase
          .from('favorites')
          .select('*')
          .eq('user_id', user?.id)
          .eq('media_id', mediaId)
          .eq('media_type', mediaType)
          .single(),
        supabase
          .from('watched')
          .select('*')
          .eq('user_id', user?.id)
          .eq('media_id', mediaId)
          .eq('media_type', mediaType)
          .single()
      ])

      setIsFavorite(!!favorites)
      setIsWatched(!!watched)
    } catch (error) {
      console.error('Error loading user interactions:', error)
    } finally {
      setLoading(false)
    }
  }, [user?.id, mediaId, mediaType])

  useEffect(() => {
    if (user) {
      loadUserInteractions()
    } else {
      setLoading(false)
    }
  }, [user, loadUserInteractions])

  const toggleFavorite = async () => {
    if (!user) return

    try {
      if (isFavorite) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('media_id', mediaId)
          .eq('media_type', mediaType)
      } else {
        await supabase
          .from('favorites')
          .insert([
            {
              user_id: user.id,
              media_id: mediaId,
              media_type: mediaType
            }
          ])
      }
      setIsFavorite(!isFavorite)
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  const toggleWatched = async () => {
    if (!user) return

    try {
      if (isWatched) {
        await supabase
          .from('watched')
          .delete()
          .eq('user_id', user.id)
          .eq('media_id', mediaId)
          .eq('media_type', mediaType)
      } else {
        await supabase
          .from('watched')
          .insert([
            {
              user_id: user.id,
              media_id: mediaId,
              media_type: mediaType
            }
          ])
      }
      setIsWatched(!isWatched)
    } catch (error) {
      console.error('Error toggling watched status:', error)
    }
  }

  if (loading || !user) return null

  return (
    <div className="flex gap-4">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleFavorite}
        className={`p-2 rounded-full ${
          isFavorite ? 'bg-red-600' : 'bg-gray-800'
        } text-white`}
      >
        <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleWatched}
        className={`p-2 rounded-full ${
          isWatched ? 'bg-green-600' : 'bg-gray-800'
        } text-white`}
      >
        <Check className={`w-6 h-6 ${isWatched ? 'fill-current' : ''}`} />
      </motion.button>
    </div>
  )
} 