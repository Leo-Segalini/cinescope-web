'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { tmdbClient } from '@/services/tmdb/client'

interface Review {
  id: string
  author: string
  content: string
  created_at: string
  author_details?: {
    rating?: number
    avatar_path?: string
  }
}

interface ReviewsProps {
  mediaId: number
  mediaType: 'movie' | 'tv'
}

export function Reviews({ mediaId, mediaType }: ReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await tmdbClient.getReviews(mediaType, mediaId)
        setReviews(response.results)
      } catch (error) {
        console.error('Error fetching reviews:', error)
      } finally {
        setLoading(false)
      }
    }

    if (mediaId) {
      fetchReviews()
    }
  }, [mediaId, mediaType])

  if (loading) {
    return <div>Chargement des avis...</div>
  }

  if (reviews.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Avis des spectateurs</h2>
      <div className="space-y-6">
        {reviews.map((review) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 p-4 rounded-lg"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-medium">{review.author}</h3>
                <p className="text-sm text-gray-400">
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              </div>
              {review.author_details?.rating && (
                <div className="bg-yellow-500 text-black px-2 py-1 rounded">
                  {review.author_details.rating}/10
                </div>
              )}
            </div>
            <p className="text-gray-300">{review.content}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
} 