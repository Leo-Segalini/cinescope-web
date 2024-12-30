import { render, screen } from '@testing-library/react'
import MoviePage from '../page'
import { tmdbClient } from '@/services/tmdb/client'
import { notFound } from 'next/navigation'

jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}))

jest.mock('@/services/tmdb/client', () => ({
  tmdbClient: {
    getMovieDetails: jest.fn(),
  },
}))

describe('MoviePage', () => {
  const mockMovie = {
    id: 123,
    title: 'Test Movie',
    overview: 'Test Overview',
    poster_path: '/test-poster.jpg',
    backdrop_path: '/test-backdrop.jpg',
    release_date: '2024-01-01',
    vote_average: 8.5,
    vote_count: 1000,
    runtime: 120,
    budget: 1000000,
    revenue: 5000000,
    genres: [{ id: 1, name: 'Action' }],
    tagline: 'Test Tagline',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(tmdbClient.getMovieDetails as jest.Mock).mockResolvedValue(mockMovie)
  })

  it('should render movie details correctly', async () => {
    render(await MoviePage({ params: { id: '123' } }))

    expect(screen.getByText('Test Movie')).toBeInTheDocument()
    expect(screen.getByText('Test Overview')).toBeInTheDocument()
    expect(screen.getByText('Test Tagline')).toBeInTheDocument()
    expect(screen.getByText('Action')).toBeInTheDocument()
  })

  it('should handle invalid movie ID', async () => {
    render(await MoviePage({ params: { id: 'invalid' } }))
    expect(notFound).toHaveBeenCalled()
  })

  it('should handle API errors', async () => {
    ;(tmdbClient.getMovieDetails as jest.Mock).mockRejectedValue(new Error('API Error'))
    render(await MoviePage({ params: { id: '123' } }))
    expect(notFound).toHaveBeenCalled()
  })

  it('should format runtime correctly', async () => {
    render(await MoviePage({ params: { id: '123' } }))
    expect(screen.getByText('2h 0min')).toBeInTheDocument()
  })

  it('should format currency values correctly', async () => {
    render(await MoviePage({ params: { id: '123' } }))
    expect(screen.getByText('1 000 000 $US')).toBeInTheDocument()
    expect(screen.getByText('5 000 000 $US')).toBeInTheDocument()
  })
}) 