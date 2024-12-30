import { render, screen } from '@testing-library/react'
import HomePage from '../page'
import { tmdbClient } from '@/services/tmdb/client'

jest.mock('@/services/tmdb/client', () => ({
  tmdbClient: {
    getPopularMovies: jest.fn(),
    getPopularTVShows: jest.fn(),
  },
}))

describe('HomePage', () => {
  const mockMovies = {
    results: [
      {
        id: 1,
        title: 'Test Movie',
        overview: 'Test Overview',
        poster_path: '/test-movie.jpg',
        backdrop_path: '/test-backdrop.jpg',
        release_date: '2024-01-01',
        vote_average: 8.5,
        vote_count: 100,
        genre_ids: [1, 2, 3],
      },
    ],
  }

  const mockTVShows = {
    results: [
      {
        id: 1,
        name: 'Test Show',
        overview: 'Test Overview',
        poster_path: '/test-show.jpg',
        backdrop_path: '/test-backdrop.jpg',
        first_air_date: '2024-01-01',
        vote_average: 8.5,
        vote_count: 100,
        genre_ids: [1, 2, 3],
      },
    ],
  }

  beforeEach(() => {
    ;(tmdbClient.getPopularMovies as jest.Mock).mockResolvedValue(mockMovies)
    ;(tmdbClient.getPopularTVShows as jest.Mock).mockResolvedValue(mockTVShows)
  })

  it('renders both movies and TV shows sections', async () => {
    render(await HomePage())
    
    // Vérification des titres de section
    expect(screen.getByText('Films Populaires')).toBeInTheDocument()
    expect(screen.getByText('Séries Populaires')).toBeInTheDocument()

    // Vérification du contenu
    expect(screen.getByText('Test Movie')).toBeInTheDocument()
    expect(screen.getByText('Test Show')).toBeInTheDocument()
  })

  it('includes search functionality', async () => {
    render(await HomePage())
    expect(screen.getByRole('searchbox')).toBeInTheDocument()
  })

  it('displays loading spinners when content is loading', async () => {
    render(await HomePage())
    const spinners = screen.getAllByRole('status')
    expect(spinners.length).toBeGreaterThan(0)
  })
}) 