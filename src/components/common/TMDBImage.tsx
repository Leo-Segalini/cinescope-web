'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'

interface TMDBImageProps {
  path: string | null
  alt: string
  width?: number
  height?: number
  size?: 'w200' | 'w300' | 'w400' | 'w500' | 'original'
  className?: string
  priority?: boolean
  fill?: boolean
  type?: 'poster' | 'backdrop' | 'profile'
}

const FALLBACK_IMAGES = {
  poster: '/images/no-poster.png',
  backdrop: '/images/no-poster.png',
  profile: '/images/no-poster.png',
}

const IMAGE_SIZES = {
  w200: 200,
  w300: 300,
  w400: 400,
  w500: 500,
  original: 1920,
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
  type = 'poster',
}: TMDBImageProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const [imageUrl, setImageUrl] = useState<string>(FALLBACK_IMAGES[type])

  useEffect(() => {
    if (!path) {
      setImageUrl(FALLBACK_IMAGES[type])
      return
    }

    // Construit l'URL de l'image avec le token d'accès
    const baseUrl = 'https://image.tmdb.org/t/p/'
    setImageUrl(`${baseUrl}${size}${path}`)
  }, [path, size, type])

  const handleError = () => {
    setImageUrl(FALLBACK_IMAGES[type])
    console.warn(`Failed to load image from TMDB: ${path}`)
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  // Calcule les tailles responsives en fonction du type d'image
  const getSizes = () => {
    if (!fill) return undefined

    switch (type) {
      case 'backdrop':
        return '100vw'
      case 'poster':
        return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
      case 'profile':
        return '(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw'
      default:
        return '100vw'
    }
  }

  // Si fill est true, on ne doit pas utiliser width et height
  const imageProps = fill
    ? {
        fill: true,
        sizes: getSizes(),
      }
    : {
        width: width || IMAGE_SIZES[size],
        height: height || (width ? Math.floor(width * 1.5) : IMAGE_SIZES[size] * 1.5),
      }

  return (
    <Image
      src={imageUrl}
      alt={alt}
      {...imageProps}
      className={`${className} transition-opacity duration-300 ${
        isLoading ? 'opacity-0' : 'opacity-100'
      }`}
      priority={priority}
      onError={handleError}
      onLoad={handleLoad}
      quality={85}
      loading={priority ? 'eager' : 'lazy'}
      blurDataURL={FALLBACK_IMAGES[type]}
      placeholder="blur"
    />
  )
} 