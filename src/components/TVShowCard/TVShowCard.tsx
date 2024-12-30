import Image from 'next/image'
import Link from 'next/link'
import type { TVShow } from '@/types/tmdb'

interface TVShowCardProps {
  show: TVShow
  priority?: boolean
}

export const TVShowCard = ({ show, priority = false }: TVShowCardProps) => {
  const imageUrl = show.poster_path
    ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
    : '/images/no-poster.png'

  return (
    <Link href={`/tv/${show.id}`} className="group">
      <article className="relative overflow-hidden rounded-lg transition-transform hover:scale-105">
        <div className="aspect-[2/3] relative">
          <Image
            src={imageUrl}
            alt={show.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            priority={priority}
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <h2 className="text-lg font-semibold text-white">{show.name}</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-yellow-400">
              ★ {show.vote_average.toFixed(1)}
            </span>
            <span className="text-sm text-gray-300">
              {new Date(show.first_air_date).getFullYear()}
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
} 