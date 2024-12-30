import { render } from '@testing-library/react'
import SearchPage from '../page'
import { tmdbClient } from '@/services/tmdb/client'
import { performance } from 'perf_hooks'

jest.mock('@/services/tmdb/client', () => ({
  tmdbClient: {
    searchMulti: jest.fn(),
    getMovieGenres: jest.fn(),
    getTVGenres: jest.fn(),
  },
}))

const generateMockResults = (count: number) => ({
  results: Array.from({ length: count }, (_, i) => ({
    id: i,
    title: `Movie ${i}`,
    media_type: 'movie',
    genre_ids: [28, 12],
    poster_path: '/test.jpg',
    release_date: '2024-01-01',
    vote_average: 8.5,
    vote_count: 100,
    overview: 'Test overview',
  })),
  total_pages: Math.ceil(count / 20),
  total_results: count,
})

describe('SearchPage Performance', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(tmdbClient.getMovieGenres as jest.Mock).mockResolvedValue([
      { id: 28, name: 'Action' },
    ])
    ;(tmdbClient.getTVGenres as jest.Mock).mockResolvedValue([
      { id: 18, name: 'Drama' },
    ])
  })

  it('renders quickly with small result set', async () => {
    const mockResults = generateMockResults(10)
    ;(tmdbClient.searchMulti as jest.Mock).mockResolvedValue(mockResults)

    const start = performance.now()
    await render(
      await SearchPage({
        searchParams: { q: 'test' },
      })
    )
    const end = performance.now()

    expect(end - start).toBeLessThan(100) // Devrait prendre moins de 100ms
  })

  it('handles large result sets efficiently', async () => {
    const mockResults = generateMockResults(100)
    ;(tmdbClient.searchMulti as jest.Mock).mockResolvedValue(mockResults)

    const start = performance.now()
    await render(
      await SearchPage({
        searchParams: { q: 'test' },
      })
    )
    const end = performance.now()

    expect(end - start).toBeLessThan(200) // Devrait prendre moins de 200ms même avec 100 résultats
  })

  it('maintains performance with multiple filters', async () => {
    const mockResults = generateMockResults(50)
    ;(tmdbClient.searchMulti as jest.Mock).mockResolvedValue(mockResults)

    const start = performance.now()
    await render(
      await SearchPage({
        searchParams: {
          q: 'test',
          type: 'movie',
          genres: '28,12',
        },
      })
    )
    const end = performance.now()

    expect(end - start).toBeLessThan(150) // Devrait prendre moins de 150ms avec filtres
  })
}) 