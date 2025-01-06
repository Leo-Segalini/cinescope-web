'use client'

import Image from 'next/image'
import { useState } from 'react'

interface TMDBImageProps {
  path: string | null
  alt: string
  fill?: boolean
  width?: number
  height?: number
  type?: 'poster' | 'backdrop' | 'profile'
  size?: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original'
  priority?: boolean
  className?: string
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
}

export function TMDBImage({
  path,
  alt,
  fill = false,
  width,
  height,
  type = 'poster',
  size = 'w500',
  priority = false,
  className = '',
  placeholder,
  blurDataURL,
}: TMDBImageProps) {
  const [isLoading, setIsLoading] = useState(true)

  const placeholderImage = type === 'backdrop' 
    ? '/placeholder-backdrop.png'
    : type === 'profile'
    ? '/placeholder-profile.png'
    : '/placeholder-movie.png'

  const imageUrl = path ? `https://image.tmdb.org/t/p/${size}${path}` : placeholderImage

  return (
    <div className={`relative ${className} ${isLoading ? 'animate-pulse bg-gray-800' : ''}`}>
      <Image
        src={imageUrl}
        alt={alt}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        className={`object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onLoadingComplete={() => setIsLoading(false)}
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
        sizes={
          type === 'backdrop'
            ? '100vw'
            : type === 'poster'
            ? '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw'
            : '(max-width: 640px) 33vw, 25vw'
        }
        placeholder={placeholder}
        blurDataURL={blurDataURL}
      />
    </div>
  )
} 