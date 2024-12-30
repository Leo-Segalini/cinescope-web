import { render } from '@testing-library/react'
import { SearchSuggestions } from '../SearchSuggestions'
import { performance } from 'perf_hooks'
import type { Movie } from '@/types/tmdb'

const generateMockResults = (count: number): Movie[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    title: `Movie ${i}`,
    overview: 'Test overview',
    poster_path: '/test.jpg',
    backdrop_path: '/test-backdrop.jpg',
    release_date: '2024-01-01',
    vote_average: 8.5,
    vote_count: 100,
    genre_ids: [28],
  }))

describe('SearchSuggestions Performance', () => {
  it('renders quickly with few suggestions', () => {
    const results = generateMockResults(5)
    const start = performance.now()

    render(
      <SearchSuggestions
        results={results}
        isVisible={true}
        onSelect={() => {}}
        onClose={() => {}}
      />
    )

    const end = performance.now()
    expect(end - start).toBeLessThan(50) // Devrait prendre moins de 50ms
  })

  it('maintains performance with many suggestions', () => {
    const results = generateMockResults(20)
    const start = performance.now()

    render(
      <SearchSuggestions
        results={results}
        isVisible={true}
        onSelect={() => {}}
        onClose={() => {}}
      />
    )

    const end = performance.now()
    expect(end - start).toBeLessThan(100) // Devrait prendre moins de 100ms
  })

  it('handles rapid visibility toggles efficiently', () => {
    const results = generateMockResults(10)
    const { rerender } = render(
      <SearchSuggestions
        results={results}
        isVisible={true}
        onSelect={() => {}}
        onClose={() => {}}
      />
    )

    const start = performance.now()
    for (let i = 0; i < 10; i++) {
      rerender(
        <SearchSuggestions
          results={results}
          isVisible={i % 2 === 0}
          onSelect={() => {}}
          onClose={() => {}}
        />
      )
    }
    const end = performance.now()

    expect(end - start).toBeLessThan(150) // 10 rerenders devraient prendre moins de 150ms
  })
}) 