'use client'

interface Video {
  id: string
  key: string
  name: string
  site: string
  type: string
  official: boolean
}

interface VideoSectionProps {
  videos: Video[]
}

export function VideoSection({ videos }: VideoSectionProps) {
  const trailerVideo = videos.find(
    (video) => video.type === 'Trailer' && video.site === 'YouTube'
  )

  if (!trailerVideo) {
    return null
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-4xl">
        <div className="relative pb-[56.25%]">
          <iframe
            src={`https://www.youtube.com/embed/${trailerVideo.key}`}
            title={trailerVideo.name}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full rounded-lg"
          />
        </div>
      </div>
    </div>
  )
} 