'use client'

import { motion } from 'framer-motion'

interface Video {
  id: string
  key: string
  name: string
  site: string
  type: string
}

interface VideoGalleryProps {
  videos: Video[]
}

export function VideoGallery({ videos }: VideoGalleryProps) {
  if (!videos || videos.length === 0) {
    return null
  }

  // Filtrer pour n'avoir que les vidéos YouTube et les bandes-annonces
  const filteredVideos = videos
    .filter((video) => video.site === 'YouTube' && video.type.includes('Trailer'))
    .slice(0, 6)

  if (filteredVideos.length === 0) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {filteredVideos.map((video) => (
        <motion.div
          key={video.id}
          className="relative aspect-video rounded-lg overflow-hidden"
          whileHover={{ scale: 1.02 }}
        >
          <iframe
            src={`https://www.youtube.com/embed/${video.key}`}
            title={video.name}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </motion.div>
      ))}
    </motion.div>
  )
} 