import { SearchCache } from '../searchCache'
import { Movie } from '@/types'

describe('SearchCache', () => {
  let cache: SearchCache<Movie>

  beforeEach(() => {
    cache = new SearchCache<Movie>()
  })

  it('should store and retrieve items', () => {
    const query = 'test'
    const items: Movie[] = [
      {
        id: 1,
        title: 'Test Movie',
        poster_path: '/test.jpg',
        backdrop_path: '/test-backdrop.jpg',
        overview: 'Test overview',
        release_date: '2023-01-01',
        vote_average: 7.5,
        genre_ids: [1, 2, 3],
      },
    ]

    cache.set(query, items)
    expect(cache.get(query)).toEqual(items)
  })

  it('should return null for non-existent queries', () => {
    expect(cache.get('non-existent')).toBeNull()
  })

  it('should clear old items when max size is reached', () => {
    const maxSize = 3
    cache = new SearchCache<Movie>(maxSize)

    for (let i = 0; i < maxSize + 1; i++) {
      cache.set(`query${i}`, [])
    }

    expect(cache.get('query0')).toBeNull()
    expect(cache.get(`query${maxSize}`)).not.toBeNull()
  })
}) 