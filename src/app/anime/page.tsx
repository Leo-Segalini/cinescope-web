import { getAnimePageData } from './page.server';
import { Hero } from '@/components/Hero/Hero';
import { TVShowGrid } from '@/components/TVShowGrid/TVShowGrid';

export default async function AnimePage() {
  const { popularAnime, trendingAnime, topRatedAnime, newAnime } = await getAnimePageData();

  return (
    <main className="min-h-screen">
      {popularAnime[0] && (
        <Hero
          title={popularAnime[0].name}
          overview={popularAnime[0].overview}
          backdropPath={popularAnime[0].backdrop_path}
          type="tv"
          id={popularAnime[0].id}
        />
      )}

      <div className="container mx-auto px-4 py-8 space-y-8">
        <TVShowGrid title="Animes Populaires" items={popularAnime} />
        <TVShowGrid title="Animes Tendances" items={trendingAnime} />
        <TVShowGrid title="Animes les Mieux Notés" items={topRatedAnime} />
        <TVShowGrid title="Nouveaux Animes" items={newAnime} />
      </div>
    </main>
  );
} 