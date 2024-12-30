import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SearchBar } from '../SearchBar'
import { tmdbClient } from '@/services/tmdb/client'

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

jest.mock('@/services/tmdb/client', () => ({
  tmdbClient: {
    searchMulti: jest.fn(),
  },
}))

describe('SearchBar Integration', () => {
  const mockSearchResults = {
    results: [
      {
        id: 1,
        title: 'Test Movie',
        media_type: 'movie',
      },
      {
        id: 2,
        name: 'Test Show',
        media_type: 'tv',
      },
    ],
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(tmdbClient.searchMulti as jest.Mock).mockResolvedValue(mockSearchResults)
  })

  it('performs search and calls onSearch with results', async () => {
    const mockOnSearch = jest.fn()
    render(<SearchBar onSearch={mockOnSearch} />)

    const searchInput = screen.getByRole('searchbox')
    fireEvent.change(searchInput, { target: { value: 'test' } })

    await waitFor(() => {
      expect(tmdbClient.searchMulti).toHaveBeenCalledWith('test', 1)
      expect(mockOnSearch).toHaveBeenCalledWith('test')
    })
  })

  it('handles API errors gracefully', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
    ;(tmdbClient.searchMulti as jest.Mock).mockRejectedValue(new Error('API Error'))

    render(<SearchBar />)
    const searchInput = screen.getByRole('searchbox')
    fireEvent.change(searchInput, { target: { value: 'error test' } })

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalled()
    })

    consoleError.mockRestore()
  })

  it('debounces search requests correctly', async () => {
    render(<SearchBar />)
    const searchInput = screen.getByRole('searchbox')

    fireEvent.change(searchInput, { target: { value: 't' } })
    fireEvent.change(searchInput, { target: { value: 'te' } })
    fireEvent.change(searchInput, { target: { value: 'test' } })

    await waitFor(
      () => {
        expect(tmdbClient.searchMulti).toHaveBeenCalledTimes(1)
        expect(tmdbClient.searchMulti).toHaveBeenCalledWith('test', 1)
      },
      { timeout: 1000 }
    )
  })
}) 