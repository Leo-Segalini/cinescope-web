import Image from 'next/image'
import Link from 'next/link'
import type { Movie } from '@/types/tmdb'

interface MovieCardProps {
  movie: Movie
  priority?: boolean
}

export const MovieCard = ({ movie, priority = false }: MovieCardProps) => {
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/images/no-poster.png'

  return (
    <Link href={`/movie/${movie.id}`} className="group">
      <article className="relative overflow-hidden rounded-lg transition-transform hover:scale-105">
        <div className="aspect-[2/3] relative">
          <Image
            src={imageUrl}
            alt={movie.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            priority={priority}
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <h2 className="text-lg font-semibold text-white">{movie.title}</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-yellow-400">
              ★ {movie.vote_average.toFixed(1)}
            </span>
            <span className="text-sm text-gray-300">
              {new Date(movie.release_date).getFullYear()}
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
} 