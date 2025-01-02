import { render, screen, waitFor } from '@testing-library/react'
import { StreamingProviders } from '@/components/StreamingProviders/StreamingProviders'
import { tmdbClient } from '@/services/tmdb/client'

// Mock du client TMDB
jest.mock('@/services/tmdb/client', () => ({
  tmdbClient: {
    getMovieWatchProviders: jest.fn(),
    getTVShowWatchProviders: jest.fn(),
  },
}))

describe('StreamingProviders Integration Tests', () => {
  const mockProviders = {
    results: {
      FR: {
        flatrate: [
          {
            provider_id: 8,
            provider_name: 'Netflix',
            logo_path: '/netflix.png'
          },
          {
            provider_id: 337,
            provider_name: 'Disney Plus',
            logo_path: '/disney-plus.png'
          }
        ]
      }
    }
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should display streaming providers for a movie', async () => {
    // Setup
    ;(tmdbClient.getMovieWatchProviders as jest.Mock).mockResolvedValue(mockProviders)

    // Render
    render(<StreamingProviders mediaId={123} mediaType="movie" />)

    // Initial loading state
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()

    // Wait for providers to load
    await waitFor(() => {
      expect(screen.getByText('Netflix')).toBeInTheDocument()
      expect(screen.getByText('Disney Plus')).toBeInTheDocument()
    })

    // Verify API call
    expect(tmdbClient.getMovieWatchProviders).toHaveBeenCalledWith(123)
  })

  it('should display streaming providers for a TV show', async () => {
    // Setup
    ;(tmdbClient.getTVShowWatchProviders as jest.Mock).mockResolvedValue(mockProviders)

    // Render
    render(<StreamingProviders mediaId={456} mediaType="tv" />)

    // Initial loading state
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()

    // Wait for providers to load
    await waitFor(() => {
      expect(screen.getByText('Netflix')).toBeInTheDocument()
      expect(screen.getByText('Disney Plus')).toBeInTheDocument()
    })

    // Verify API call
    expect(tmdbClient.getTVShowWatchProviders).toHaveBeenCalledWith(456)
  })

  it('should handle error state', async () => {
    // Setup
    ;(tmdbClient.getMovieWatchProviders as jest.Mock).mockRejectedValue(new Error('API Error'))

    // Render
    render(<StreamingProviders mediaId={789} mediaType="movie" />)

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText('Impossible de charger les plateformes de streaming')).toBeInTheDocument()
    })
  })

  it('should handle empty providers list', async () => {
    // Setup
    ;(tmdbClient.getMovieWatchProviders as jest.Mock).mockResolvedValue({ results: {} })

    // Render
    render(<StreamingProviders mediaId={101} mediaType="movie" />)

    // Wait for no providers message
    await waitFor(() => {
      expect(screen.getByText('Non disponible en streaming')).toBeInTheDocument()
    })
  })
}) 