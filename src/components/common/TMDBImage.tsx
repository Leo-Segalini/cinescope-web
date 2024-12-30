'use client'

import Image from 'next/image'
import { useState } from 'react'

interface TMDBImageProps {
  path: string | null
  alt: string
  width?: number
  height?: number
  size?: 'w200' | 'w300' | 'w400' | 'w500' | 'original'
  className?: string
  priority?: boolean
  fill?: boolean
}

export const TMDBImage = ({
  path,
  alt,
  size = 'w500',
  className = '',
  priority = false,
  fill = false,
  width,
  height,
}: TMDBImageProps) => {
  const [error, setError] = useState(false)

  const imageUrl = path
    ? `https://image.tmdb.org/t/p/${size}${path}`
    : '/images/no-poster.png'

  const handleError = () => {
    setError(true)
  }

  return (
    <Image
      src={error ? '/images/no-poster.png' : imageUrl}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      fill={fill}
      onError={handleError}
      sizes={fill ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" : undefined}
    />
  )
} 