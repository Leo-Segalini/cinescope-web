export const metadata = {
  title: 'Animés | TMDB App',
  description: 'Découvrez les meilleurs animés japonais et films d\'animation.',
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