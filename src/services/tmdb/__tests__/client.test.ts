import { tmdbClient } from '../client'
import type { PaginatedResponse } from '@/types/tmdb'

// Mock global fetch
global.fetch = jest.fn()

describe('TMDBClient', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should fetch popular movies successfully', async () => {
    const mockMovies = {
      page: 1,
      results: [
        {
          id: 1,
          title: 'Test Movie',
          overview: 'Test Overview',
          poster_path: '/test.jpg',
          backdrop_path: '/test-backdrop.jpg',
          release_date: '2024-01-01',
          vote_average: 8.5,
          vote_count: 100,
          genre_ids: [1, 2, 3],
        },
      ],
      total_pages: 10,
      total_results: 100,
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockMovies,
    })

    const result = await tmdbClient.getPopularMovies()
    expect(result).toEqual(mockMovies)
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/movie/popular'),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: expect.stringContaining('Bearer'),
        }),
      })
    )
  })

  it('should fetch popular TV shows successfully', async () => {
    const mockTVShows = {
      page: 1,
      results: [
        {
          id: 1,
          name: 'Test Show',
          overview: 'Test Overview',
          poster_path: '/test.jpg',
          backdrop_path: '/test-backdrop.jpg',
          first_air_date: '2024-01-01',
          vote_average: 8.5,
          vote_count: 100,
          genre_ids: [1, 2, 3],
        },
      ],
      total_pages: 10,
      total_results: 100,
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockTVShows,
    })

    const result = await tmdbClient.getPopularTVShows()
    expect(result).toEqual(mockTVShows)
  })

  it('should handle API errors correctly', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    })

    await expect(tmdbClient.getMovieDetails(999999)).rejects.toThrow('TMDB API Error: 404 Not Found')
  })
}) 