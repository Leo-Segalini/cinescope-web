import { getAnimePageData } from './page.server';
import { Hero } from '@/components/Hero/Hero';
import { TVShowGrid } from '@/components/TVShowGrid/TVShowGrid';
import { TVShow } from '@/types/tmdb';

export default async function AnimePage() {
  const { popularAnime, trendingAnime, topRatedAnime, newAnime } = await getAnimePageData();

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {popularAnime[0] && popularAnime[0].overview && (
        <Hero
          title={popularAnime[0].name}
          overview={popularAnime[0].overview}
          backdropPath={popularAnime[0].backdrop_path}
          type="tv"
          id={popularAnime[0].id}
        />
      )}

      <div className="container mx-auto px-4 py-8 space-y-8">
        <TVShowGrid title="Animes Populaires" items={popularAnime as unknown as TVShow[]} />
        <TVShowGrid title="Animes Tendances" items={trendingAnime as unknown as TVShow[]} />
        <TVShowGrid title="Animes les Mieux Notés" items={topRatedAnime as unknown as TVShow[]} />
        <TVShowGrid title="Nouveaux Animes" items={newAnime as unknown as TVShow[]} />
      </div>
    </main>
  );
} 