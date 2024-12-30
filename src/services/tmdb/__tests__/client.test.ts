import { TMDBClient } from '../client'
import { Movie, TVShow } from '@/types'

describe('TMDBClient', () => {
  let client: TMDBClient

  beforeEach(() => {
    client = new TMDBClient({
      apiKey: 'test-api-key',
      baseUrl: 'https://api.themoviedb.org/3',
      defaultLanguage: 'fr-FR',
    })
  })

  it('should fetch trending movies', async () => {
    const mockResponse: Movie[] = [
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

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ results: mockResponse }),
    })

    const result = await client.getTrendingMovies()
    expect(result).toEqual({ results: mockResponse })
  })

  it('should fetch trending TV shows', async () => {
    const mockResponse: TVShow[] = [
      {
        id: 1,
        name: 'Test Show',
        poster_path: '/test.jpg',
        backdrop_path: '/test-backdrop.jpg',
        overview: 'Test overview',
        first_air_date: '2023-01-01',
        vote_average: 7.5,
        genre_ids: [1, 2, 3],
      },
    ]

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ results: mockResponse }),
    })

    const result = await client.getTrendingTVShows()
    expect(result).toEqual({ results: mockResponse })
  })

  it('should handle API errors', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ status_message: 'API Error' }),
    })

    await expect(client.getTrendingMovies()).rejects.toThrow('Failed to fetch trending movies')
  })
}) 