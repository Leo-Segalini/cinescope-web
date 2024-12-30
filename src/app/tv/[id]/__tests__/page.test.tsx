import { render, screen } from '@testing-library/react'
import TVShowPage from '../page'
import { tmdbClient } from '@/services/tmdb/client'
import { notFound } from 'next/navigation'

jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}))

jest.mock('@/services/tmdb/client', () => ({
  tmdbClient: {
    getTVShowDetails: jest.fn(),
  },
}))

describe('TVShowPage', () => {
  const mockShow = {
    id: 123,
    name: 'Test Show',
    overview: 'Test Overview',
    poster_path: '/test-poster.jpg',
    backdrop_path: '/test-backdrop.jpg',
    first_air_date: '2024-01-01',
    vote_average: 8.5,
    vote_count: 1000,
    number_of_seasons: 3,
    number_of_episodes: 36,
    genres: [{ id: 1, name: 'Drama' }],
    tagline: 'Test Tagline',
    created_by: [{ id: 1, name: 'Test Creator' }],
    status: 'Ended',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(tmdbClient.getTVShowDetails as jest.Mock).mockResolvedValue(mockShow)
  })

  it('should render TV show details correctly', async () => {
    render(await TVShowPage({ params: { id: '123' } }))

    expect(screen.getByText('Test Show')).toBeInTheDocument()
    expect(screen.getByText('Test Overview')).toBeInTheDocument()
    expect(screen.getByText('Test Tagline')).toBeInTheDocument()
    expect(screen.getByText('Drama')).toBeInTheDocument()
  })

  it('should handle invalid show ID', async () => {
    render(await TVShowPage({ params: { id: 'invalid' } }))
    expect(notFound).toHaveBeenCalled()
  })

  it('should handle API errors', async () => {
    ;(tmdbClient.getTVShowDetails as jest.Mock).mockRejectedValue(new Error('API Error'))
    render(await TVShowPage({ params: { id: '123' } }))
    expect(notFound).toHaveBeenCalled()
  })

  it('should display seasons and episodes count correctly', async () => {
    render(await TVShowPage({ params: { id: '123' } }))
    expect(screen.getByText('3 saisons • 36 épisodes')).toBeInTheDocument()
  })

  it('should display creator information', async () => {
    render(await TVShowPage({ params: { id: '123' } }))
    expect(screen.getByText('Test Creator')).toBeInTheDocument()
  })

  it('should display show status correctly', async () => {
    render(await TVShowPage({ params: { id: '123' } }))
    expect(screen.getByText('Terminée')).toBeInTheDocument()
  })
}) 