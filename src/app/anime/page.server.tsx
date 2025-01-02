import { tmdbClient } from '@/services/tmdb/client';

export const metadata = {
  title: "Animés",
  description: "Découvrez les meilleurs animés japonais, films d'animation et séries animées. Explorez notre collection d'anime avec des critiques, des notes et des recommandations.",
  keywords: ["anime", "animés", "animation japonaise", "manga", "séries animées", "films d'animation", "streaming anime"],
}

export async function getAnimePageData() {
  const [popularAnime, trendingAnime, topRatedAnime, newAnime] = await Promise.all([
    tmdbClient.getPopularAnime(),
    tmdbClient.getTrendingAnime(),
    tmdbClient.getTopRatedAnime(),
    tmdbClient.getNewAnime(),
  ])

  return {
    popularAnime,
    trendingAnime,
    topRatedAnime,
    newAnime,
  }
} 